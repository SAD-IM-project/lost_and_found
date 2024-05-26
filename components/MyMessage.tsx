import React from 'react'

interface MyMessageProps {
    text:string
    time?:string
    avatar_url?:string
}
const MyMessage: React.FC<MyMessageProps> = ({ text, time, avatar_url }) => {
  const messageTime = time? new Date(time).toLocaleTimeString(): ''
  
  return (
    <div className="flex justify-end mb-4">
         <span className='text-xs text-gray-400'>{messageTime}</span>
        <div
          className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
        >
          {text}
        </div>
        <img
          src={avatar_url}
          className="object-cover h-8 w-8 rounded-full"
          alt=""
        />
    </div>
  )
}

export default MyMessage;
