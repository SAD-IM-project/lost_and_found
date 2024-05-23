import React from 'react'
import ChatPage from '@/components/ChatPage'
export default function page({ params }: { params: { channelid: string , receiver_id:string} }) {  
    //  construct a list of messages , each contains user and text
      return (
        <ChatPage channelid={params.channelid} receiver_id={params.receiver_id}/>
      )
    }
    