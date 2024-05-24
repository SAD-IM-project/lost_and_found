"use client"
import React, { ChangeEvent, FormEvent, useState } from 'react';
import ChatHeader from '@/components/ChatHeader';
import MyMessage from '@/components/MyMessage';
import YourMessage from '@/components/YourMessage';
import { Input } from '@/components/ui/input';
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface channel {
  channelid: string;
  receiver_id: string;
}
const ChatPage: React.FC<channel> = ({channelid, receiver_id}) => {
  useEffect(() => {
    const supabase = createClient();

    const me = supabase.auth.getUser();

    const subscription = supabase
      .channel(`message`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message"},
        (payload) => {
          if (payload.new.object_id === channelid)
          {
            console.log("Change received!", payload);
            fetchChatRoom()
          }
            
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    }
  });
  const initialData = [
    { receiver_id: "me", content: "hello" },
    { receiver_id: "you", content: "hi" }
  ];
  const [messages, setMessages] = useState(initialData);
  const [loading, setLoading] = useState(true);

  
  const fetchChatRoom = async () => {
    const data = await fetch('/api/message/get', {method: "GET"})
    const res = await data.json()
    if (res.error) {
      console.log(res.error)
      return
    }
    

    res.data = res.data.filter((element: Message) => element.object_id === channelid)
    console.log(res.data)
    setMessages([...res.data])
    setLoading(false)
    console.log("fetching")
  }
  if (loading) {
    fetchChatRoom()
  }

  
  
  
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement> ) => {
    setInputValue(e.target.value);
  };


  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    const supabase = createClient();
    const me = await supabase.auth.getUser();
    // Add new message
    const newMessage = { receiver_id: receiver_id, content: inputValue };
    setMessages([...messages, newMessage]);

    const data = await fetch(`/api/message/create?content=${inputValue}&sender_id=${me.data.user?.id}&receiver_id=${receiver_id}&object_id=${channelid}`, {method: "POST"})
    const res = await data.json()
    console.log(res)
    // Clear the input
    setInputValue('');
  };

  return (
    <div className='max-w-3xl mx-auto md:py-10 w-9/12 h-3/5'>
      <div className='h-full border rounded-md flex flex-col'>
        <ChatHeader />
        <div className='flex-1 flex flex-col'>
          <div className='flex-1'></div>
          <div className=' overflow-auto w-full h-5/6'>
            {loading? <p>Loading...</p> : (messages.map((msg, index) => (
              msg.receiver_id === receiver_id ? 
                <MyMessage key={index} text={msg.content} /> :
                <YourMessage key={index} text={msg.content} />
            )))}
          </div>
        </div>
        <div className='p-5'>
        <form onSubmit={handleFormSubmit}>
            <Input 
              placeholder='Send message' 
              value={inputValue}
              onChange={handleInputChange}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
