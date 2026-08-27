import React from 'react'
import { SignUp } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <SignUp />
    </div>
  )
}

export default page
