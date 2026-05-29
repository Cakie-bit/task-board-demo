import { useState } from 'react'
import './App.css'

interface Task {
  id: string
  title: string
  column: 'todo' | 'inProgress' | 'done'
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Design UI mockups', column: 'done' },
    { id: '2', title: 'Set up project repository', column: 'done' },
    { id: '3', title: 'Implement task board component', column: 'inProgress' },
    { id: '4', title: 'Add drag and drop functionality', column: 'todo' },
    { id: '5', title: 'Write tests', column: 'todo' },
  ])
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        column: 'todo',
      }
      setTasks([...tasks, newTask])
      setNewTaskTitle('')
    }
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const moveTask = (id: string, newColumn: 'todo' | 'inProgress' | 'done') => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, column: newColumn } : task
      )
    )
  }

  const getTasksByColumn = (column: 'todo' | 'inProgress' | 'done') => {
    return tasks.filter((task) => task.column === column)
  }

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string
  ) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('taskId', taskId)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    column: 'todo' | 'inProgress' | 'done'
  ) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    moveTask(taskId, column)
  }

  return (
    <div className="task-board-container">
      <h1>Task Board</h1>

      <div className="add-task-section">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              addTask()
            }
          }}
          className="task-input"
        />
        <button onClick={addTask} className="add-task-btn">
          Add Task
        </button>
      </div>

      <div className="board">
        <div
          className="column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'todo')}
        >
          <h2>Todo</h2>
          <div className="tasks">
            {getTasksByColumn('todo').map((task) => (
              <div
                key={task.id}
                className="task"
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
              >
                <span className="task-title">{task.title}</span>
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div
          className="column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'inProgress')}
        >
          <h2>In Progress</h2>
          <div className="tasks">
            {getTasksByColumn('inProgress').map((task) => (
              <div
                key={task.id}
                className="task"
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
              >
                <span className="task-title">{task.title}</span>
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div
          className="column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'done')}
        >
          <h2>Done</h2>
          <div className="tasks">
            {getTasksByColumn('done').map((task) => (
              <div
                key={task.id}
                className="task completed"
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
              >
                <span className="task-title">{task.title}</span>
                <button
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
