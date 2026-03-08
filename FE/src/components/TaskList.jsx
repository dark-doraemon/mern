import React from 'react'
import TaskEmptyState from './TaskEmptyState';
import TaskCard from './TaskCard';

const TaskList = ({tasks, filter, handleTasksChanged}) => {

  if (!tasks || tasks.length === 0) {
    return <TaskEmptyState filter={filter}/>
  }
  return (
    <div className='space-y-3'>
      {tasks.map((task,index) => (
        <TaskCard key={task._id ?? index} task={task} index={index} handleTasksChanged={handleTasksChanged}/>
      ))}
    </div>
  )
}

export default TaskList