"use client"
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

export default function MyChatButton() {
    const router = useRouter()
    const handleClick = () =>{
        router.push('/MyChat')
    }
  return (
    <div className='m-5'>
        <Button onClick={handleClick}>My Chat</Button>
    </div>
    
  )
}
