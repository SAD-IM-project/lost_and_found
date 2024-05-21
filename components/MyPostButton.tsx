"use client"
import React from 'react'
import { Button } from './ui/button'


export default function MyPostButton() {

    const handleClick = () =>{
        console.log('My post')
        // redirect to /mypost using router
        window.location.href = '/mypost'
    }
  return (
    <div className='m-5'>
        <Button onClick={handleClick}>My post</Button>
    </div>
    
  )
}
