"use client"
import React from 'react'
import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import ChatPreview from '@/components/ChatPreview'
import { object } from 'zod'
import { set } from 'date-fns'
export default function page() {

  // useEffect(() => {
  //   const supabase = createClient();

  //   const me = supabase.auth.getUser();
  //   console.log({me})

  //   const subscription = supabase
  //     .channel(`message`)
  //     .on(
  //       "postgres_changes",
  //       { event: "INSERT", schema: "public", table: "message"},
  //       (payload) => {
  //         if (payload.new.sender_id === me || payload.new.receiver_id === me)
  //           console.log("Change received!", payload);
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(subscription);
  //   }
  // });

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
    console.log(res)
    if(me.error) {
      console.log(me.error)
      return
    }
    if (res.error) {
      console.log(res.error)
      return
    }
    


    res.data.filter((element: Message) => element.sender_id === me.data.user.id || element.receiver_id === me.data.user.id)
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
    console.log(uniqueData)
    setChatroom([...uniqueData])
    console.log(chatroom)
    setLoading(false)
    setMyid(me.data.user.id)
  }

  if (loading)
  {
    fetchChatRoom()
  }
  

  // const data = await fetch('/api/message/get, {method: "GET"}')
  // get all my chat
  const data = [
    ,
    {
      username: 'user2',
      lastmessage: 'Hello',
      channelid: '2'

    },
    {
      username: 'user3',
      lastmessage: 'Hello',
      channelid: '3'

    },
    {
      username: 'user4',
      lastmessage: 'Hello',
      channelid: '4'

    },
    {
      username: 'user5',
      lastmessage: 'Hello',
      channelid: '5'

    },
    {
      username: 'user6',
      lastmessage: 'Hello',
      channelid: '6'

    }
  ]
  return (
    <>
    {loading? <div>Loading...</div> : 
    <div className='w-1/2 top-10 flex flex-col absolute'>
      {chatroom.map((chat) => (
        <ChatPreview channelid={chat.object_id} lastmessage={chat.content} receiver_id={chat.sender_id== myid? chat.receiver_id: chat.sender_id} />
      ))}
    </div>
  }
    </>
    
  )
}
