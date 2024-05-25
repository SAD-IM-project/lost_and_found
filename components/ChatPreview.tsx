"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ChatPreviewProps {
    receiver_id: string;
    lastmessage: string;
    channelid: string;
}
type DataType = {
  city_name: string;
  district_name: string;
  user_name: string;
  user_id: string;
  object_name: string;
  category_name: string;
  happen_time: string;
  address: string;
  post_by: string;
  post_time: string;
  img_url: string;
  description: string;
};

const ChatPreview: React.FC<ChatPreviewProps> = ({receiver_id, lastmessage, channelid}) => {
    const router = useRouter()
    const handleClick = () => {
        
        router.push(`/chatroom/${channelid}/${receiver_id}`)
    }

    const [data, setData] = useState<DataType | null>(null);
    const [loading, setLoading] = useState(true);
    const fetchObjest = async () => {
      const data = await fetch(`/api/object/get?object_id=${channelid}`, {method: "GET"})
      const res = await data.json()
      if (res.error) {
        console.log(res.error)
        return
      }
      console.log(res)
      setData(res)
      setLoading(false)
    }
    if (loading) {
      fetchObjest()
    }
    
    
  return (
    <div onClick={handleClick} className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md w-full">
              <div className="flex-1">
                {/* <h2 className="text-lg font-semibold">{data?.object_name}</h2> */}
                {loading? <h2 className="text-lg font-semibold">Loading...</h2> : <h2 className="text-lg font-semibold">{data?.category_name} {data?.user_name}</h2>}
                <p className="text-gray-600">{lastmessage}</p>
              </div>
            </div>
  )
}

export default ChatPreview