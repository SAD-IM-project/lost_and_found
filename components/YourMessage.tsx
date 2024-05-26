import React from 'react'


// add a param for input message
interface YourMessageProps {
    text: string;
    time?: string;
    avatar_url?: string;
  }
  const YourMessage: React.FC<YourMessageProps> = ({ text, time, avatar_url }) => {
    const messageTime = time? new Date(time).toLocaleTimeString(): ''

    return (
      
      <div className="flex justify-start mb-4">
              <img
                src={avatar_url}
                className="object-cover h-8 w-8 rounded-full"
                alt=""
              />
              <div
                className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
              >
                {text}
              </div>     
              <span className='text-xs text-gray-400'>{messageTime}</span>     
      </div>
    );
  };
  
  export default YourMessage;