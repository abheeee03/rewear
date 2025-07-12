import Link from 'next/link'
import React from 'react'

function Home() {
  return (
    <div>
      <Link href={'/signin'}>Signin</Link>
      <Link href={'/signup'}>Signup</Link>
    </div>
  )
}
export default Home
