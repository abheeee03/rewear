import React from 'react'
import LogoutButton from '@/components/LogoutButton'

function Home() {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <h1 className="text-2xl font-bold">Protected Home</h1>
      <LogoutButton />
    </div>
  )
}

export default Home