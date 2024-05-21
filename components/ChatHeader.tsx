import React from 'react'
import { Button } from './ui/button'
export default function ChatHeader() {
  return (
    <div className='h-20'>
          <div className='p-5 border-b flex items-center justify-between'>
            <div>
              <h1 className='text-xl font-bold'>Lost and found</h1>
              <div className='flex items-center gap-1'>
                <div className='h-4 w-4 bg-green-500 rounded-full animate-pulse'>
                
                </div>
                

              </div>
              
            </div>        
          </div>
        </div>
  )
}
