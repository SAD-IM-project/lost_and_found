"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";

interface ChatPreviewProps {
  receiver_id: string;
  lastmessage: string;
  channelid: string;
}
type DataType = {
  city_name: string;
  district_name: string;
  user_name: string;
  user_id: string;
  object_name: string;
  category_name: string;
  happen_time: string;
  address: string;
  post_by: string;
  post_time: string;
  img_url: string;
  description: string;
};

const ChatPreview: React.FC<ChatPreviewProps> = ({
  receiver_id,
  lastmessage,
  channelid,
}) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/chatroom/${channelid}/${receiver_id}`);
  };

  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchObjest = async () => {
    const data = await fetch(`/api/object/get?object_id=${channelid}`, {
      method: "GET",
    });
    const res = await data.json();
    if (res.error) {
      console.log(res.error);
      return;
    }
    setData(res);
    setLoading(false);
  };
  if (loading) {
    fetchObjest();
  }

  return (
    <div
      onClick={handleClick}
      className="flex items-center m-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md w-[80%] h-[100px] border"
    >
      <div className="flex-1">
        {/* <h2 className="text-lg font-semibold">{data?.object_name}</h2> */}
        {loading ? (
          <h2 className="text-lg font-semibold">Loading...</h2>
        ) : (
          <span className="text-3xl font-semibold">
            {data?.object_name}{" "}
            <span className=" text-base text-gray-500">
              post by {data?.user_name}
            </span>
          </span>
        )}
        <p className="text-base text-gray-600">{lastmessage}</p>
      </div>
      <div className=" w-1/5 h-full flex items-center justify-center">
        {data?.img_url ? (
          // <AspectRatio ratio={2 / 1}>
          <Image
            src={data.img_url}
            alt={`${data.object_name}的圖片`}
            width={100}
            height={100}
            // fill={true}
            className="rounded-md h-[100%] w-auto object-fill"
          />
        ) : (
          //</AspectRatio>
          <div className="flex aspect-square h-full items-center justify-center rounded-md ">
            <div className="flex w-full h-full items-center justify-center bg-gray-200 rounded-md">
              <span className="text-gray-500">no image</span>
            </div>
          </div> // Replace this with your placeholder component
        )}
      </div>
    </div>
  );
};

export default ChatPreview;
