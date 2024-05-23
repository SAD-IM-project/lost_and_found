"use client"
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

export default function MyPostButton() {
    const router = useRouter()
    const handleClick = () =>{
        console.log('My post')
        // redirect to /mypost using router
        router.push('/mypost')
    }
  return (
    <div className='m-5'>
        <Button onClick={handleClick}>My post</Button>
    </div>
    
  )
}
