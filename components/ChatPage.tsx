"use client"
import React, { ChangeEvent, FormEvent, useState } from 'react';
import ChatHeader from '@/components/ChatHeader';
import MyMessage from '@/components/MyMessage';
import YourMessage from '@/components/YourMessage';
import { Input } from '@/components/ui/input';

interface channel {
  channelid: string;
}
const ChatPage: React.FC<channel> = ({channelid}) => {
  const initialData = [
    { user: "me", text: "hello" },
    { user: "you", text: "hi" }
  ];
  const [messages, setMessages] = useState(initialData);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement> ) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add new message
    const newMessage = { user: "me", text: inputValue };
    setMessages([...messages, newMessage]);

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
