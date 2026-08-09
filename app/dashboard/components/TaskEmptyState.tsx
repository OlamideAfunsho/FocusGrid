import { PlusIcon } from 'lucide-react';
import React from 'react'




interface EmptyStateProps {
  onAddTask: () => void;
}

const TaskEmptyState = ({ onAddTask }: EmptyStateProps) => {
  return (
    <>
    <div>
          <p className='italic text-[#8F98A3] mt-4 mb-4'>You have no tasks yet. Start by adding a new task.</p>
          <button 
            onClick={onAddTask}
            className="flex justify-center items-center gap-1 bg-[#3399ff] text-white px-4 py-2 rounded-[8px] cursor-pointer shadow-[0px_7px_9.1px_0px_#C9C9FF9F] bg-[linear-gradient(109.51deg,_#3399FF_2.27%,_#3864F5_100%)]"
          >
            <PlusIcon className="w-4 h-4" />
            Add Task
          </button>
        </div>
    </>
  )
}

export default TaskEmptyState