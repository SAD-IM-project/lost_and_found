"use client"
import React from 'react'
import { useRouter } from 'next/navigation'

interface ChatPreviewProps {
    receiver_id: string;
    lastmessage: string;
    channelid: string;
}

const ChatPreview: React.FC<ChatPreviewProps> = ({receiver_id, lastmessage, channelid}) => {
    const router = useRouter()
    const handleClick = () => {
        
        router.push(`/chatroom/${channelid}/${receiver_id}`)
    }
  return (
    <div onClick={handleClick} className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md w-full">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{channelid}</h2>
                <p className="text-gray-600">{lastmessage}</p>
              </div>
            </div>
  )
}

export default ChatPreview