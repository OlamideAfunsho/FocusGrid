import React from 'react'

const TaskSkeleton = () => {
  return (
    <>
    <div className="flex flex-col gap-4 w-full md:w-3/5">
        <div className="h-8 w-32 bg-neutral-200 rounded  mt-4 mb-1" /> 
      {[1, 2, 3].map((key) => (
        <div
          key={key}
          className="p-4 bg-white border rounded-xl flex items-center justify-between animate-pulse"
        >
          <div className="flex items-center gap-3">
            {/* Checkbox Placeholder */}
            <div className="h-4 w-4 rounded bg-neutral-200" />
            
            <div className="space-y-2">
              {/* Task Title Placeholder */}
              <div className="h-4 w-36 md:w-48 bg-neutral-200 rounded" />
              {/* Due Date Placeholder */}
              <div className="h-3 w-24 bg-neutral-100 rounded" />
              {/* Course Placeholder */}
              <div className="h-4 w-36 md:w-48 bg-neutral-200 rounded" />
            </div>
          </div>

          {/* Action Buttons Placeholder */}
          <div className="flex gap-3">
            <div className="h-3 w-8 bg-neutral-200 rounded" />
            <div className="h-3 w-10 bg-neutral-200 rounded" />
          </div>
        </div>
      ))}
    </div>
    </>
  )
}

export default TaskSkeleton