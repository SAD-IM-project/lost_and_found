"use client"
import React from 'react'
import { createClient } from '@/utils/supabase/client'
import ChatPreview from '@/components/ChatPreview'
import { set } from 'date-fns'
import Loading from '@/components/Loading'
export default function page() {

  const [chatroom, setChatroom] = React.useState([{
      sender_id: 'user1',
      content: 'Hello',
      object_id: '1',
      receiver_id: 'user2'

    }])
  const [myid, setMyid] = React.useState('')
  const [loading, setLoading] = React.useState(true)

  const fetchChatRoom = async () => {
    const data = await fetch('/api/message/get', {method: "GET"})
    const res = await data.json()
    const supabase = createClient();
    const me = await supabase.auth.getUser();
    if(me.error) {
      // console.log(me.error)
      return
    }
    if (res.error) {
      // console.log(res.error)
      return
    }
    


    res.data = res.data.filter((element: Message) => element.sender_id === me.data.user.id || element.receiver_id === me.data.user.id)
    const uniqueData: Message[] = [];
    const uniqueCSet = new Set();
    // reverse res.data
    res.data.reverse()
    res.data.forEach((element: Message) => {
      if (!uniqueCSet.has(element.object_id)) {
        uniqueCSet.add(element.object_id);
        uniqueData.push(element);
      }
    });
    setChatroom([...uniqueData])
    setLoading(false)
    setMyid(me.data.user.id)
  }

  if (loading)
  {
    fetchChatRoom()
  }
  return (
    <>
    {loading? <Loading/> : 
    <div className='w-full h-full flex flex-col items-center overflow-auto'>
      {chatroom.map((chat) => (
        <ChatPreview key={chat.object_id+chat.receiver_id} channelid={chat.object_id} lastmessage={chat.content} receiver_id={chat.sender_id== myid? chat.receiver_id: chat.sender_id} />
      ))}
    </div>
  }
    </>
    
  )
}
