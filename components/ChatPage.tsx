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
    console.log({me})

    const subscription = supabase
      .channel(`message`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message"},
        (payload) => {
          if (payload.new.sender_id === me || payload.new.receiver_id === me)
            console.log("Change received!", payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    }
  });
  const initialData = [
    { user: "me", text: "hello" },
    { user: "you", text: "hi" }
  ];
  const [messages, setMessages] = useState(initialData);
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
    const newMessage = { user: "me", text: inputValue };
    setMessages([...messages, newMessage]);

    const data = await fetch(`/api/message/create?content=${inputValue}&sender_id=${me.data.user?.id}&receiver_id=${receiver_id}&object_id=${channelid}`, {method: "POST"})
    const res = await data.json()
    console.log(res)
    // Clear the input
    setInputValue('');
  };

  return (
    <div className='max-w-3xl mx-auto md:py-10 h-screen w-9/12'>
      <div className='h-full border rounded-md flex flex-col'>
        <ChatHeader />
        <p>{channelid}</p>
        <div className='flex-1 flex flex-col'>
          <div className='flex-1'></div>
          <div>
            {messages.map((msg, index) => (
              msg.user === "me" ? 
                <MyMessage key={index} text={msg.text} /> :
                <YourMessage key={index} text={msg.text} />
            ))}
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
