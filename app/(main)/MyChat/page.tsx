import React from 'react'
import ChatPreview from '@/components/ChatPreview'
import { data } from 'autoprefixer'
export default function page() {

  // get all my chat
  const data = [
    {
      username: 'user1',
      lastmessage: 'Hello',
      channelid: '1'

    },
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
    // <div>
    //     <ChatPreview />
    //     <ChatPreview />
    // </div>
    <div className='w-1/2 top-10 flex flex-col absolute'>
      {data.map((chat) => (
        <ChatPreview username={chat.username} lastmessage={chat.lastmessage} channelid={chat.channelid} />
      ))}
    </div>
    
  )
}
