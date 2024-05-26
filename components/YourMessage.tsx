import React from "react";

// add a param for input message
interface YourMessageProps {
  text: string;
  time?: string;
  avatar_url?: string;
}
const YourMessage: React.FC<YourMessageProps> = ({
  text,
  time,
  avatar_url,
}) => {
  const messageTime = time ? new Date(time).toLocaleTimeString() : "";

  return (
    <div className="flex justify-start mb-4">
      <img
        src={avatar_url}
        className="object-cover h-8 w-8 rounded-full ml-2"
        alt=""
      />
      <div className="h-full flex items-end ">
        <div className="ml-2 py-2 px-3 bg-gray-400 rounded-br-2xl rounded-tr-2xl rounded-tl-xl text-white">
          {text}
        </div>
        <span className="text-xs text-gray-400 mx-1">{messageTime}</span>
      </div>
    </div>
  );
};

export default YourMessage;
