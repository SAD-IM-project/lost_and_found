import React from "react";

interface MyMessageProps {
  text: string;
  time?: string;
  avatar_url?: string;
}
const MyMessage: React.FC<MyMessageProps> = ({ text, time, avatar_url }) => {
  const messageTime = time ? new Date(time).toLocaleTimeString() : "";

  return (
    <div className="flex justify-end mb-4 ">
      <div className="h-full flex items-end ">
        <span className="text-xs text-gray-400 mx-1">{messageTime}</span>

        <div className="mr-2 py-2 px-3 bg-blue-400 rounded-bl-2xl rounded-tl-2xl rounded-tr-xl text-white">
          {text}
        </div>
      </div>
      <img
        src={avatar_url}
        className="object-cover h-8 w-8 rounded-full mr-2"
        alt=""
      />
    </div>
  );
};

export default MyMessage;
