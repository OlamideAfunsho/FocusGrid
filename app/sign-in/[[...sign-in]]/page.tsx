import React from 'react'
import { SignIn } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <SignIn />
    </div>
  )
}

export default page
