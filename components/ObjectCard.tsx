import { Card } from "@/components/ui/card";
import React from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Object {
  address: string;
  avatar_url: string;
  category_id: string;
  category_name: string;
  city_name: string;
  closed: boolean; // closed: either true or false
  description: string;
  district_name: string;

  in_district: string;

  gmail: string;
  happen_time: string;
  img_url: string;
  object_id: string;
  object_name: string;
  post_time: string;
  type: "lost" | "found"; // type: either lost or found
  user_id: string;
  user_name: string;
}

type Props = {
  post: Object;
  handlePostClick: (id: string) => void;
  className?: string;
};

export default function ObjectCard({
  post,
  handlePostClick,
  className,
}: Props) {
  const time = new Date(post.happen_time);
  const timeText = time.toLocaleDateString();

  const addressText = "At: " + post.address;
  return (
    <Card
      key={post.object_id}
      onClick={() => handlePostClick(post.object_id)}
      className={className}
    >
      <div className="flex flex-wrap h-full">
        <div className="w-3/5 h-full ">
          <div className="flex mr-2 flex-wrap h-full justify-normal">
            <div className="flex w-full h-[20%] items-center">
              <h3 className="font-semibold w-full">{post.object_name}</h3>
            </div>

            <div className="flex w-full h-[20%] items-center">
              <span
                className={`inline-block text-sm px-2 py-1 rounded mr-2 ${
                  post.type === "lost"
                    ? "bg-red-200 text-red-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {post.type}
              </span>
              <span className="inline-block bg-blue-200/25 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                {post.city_name}
              </span>
              <span className="inline-block bg-yellow-200/25 text-yellow-800 text-xs px-2 py-1 rounded-full mr-2">
                {post.district_name}
              </span>
              <span className="inline-block bg-orange-200/25 text-orange-800 text-xs px-2 py-1 rounded-full mr-2">
                {post.category_name}
              </span>
            </div>

            <div className="flex flex-wrap h-[40%] w-full p-2 bg-gray-300/75 rounded-md overflow-hidden">
              <span className=" text-sm">{post.description}</span>
            </div>

            <div className="flex w-full h-[20%] items-center justify-between">
              <div className="flex h-full items-center">
                <span className="text-sm w-full">
                  {post.type === "found" ? "Found at" : "Lost at"}: {timeText}
                </span>
              </div>
              <div className="flex h-full items-center overflow-hidden">
                <span className="text-sm w-full inline-block whitespace-nowrap overflow-hidden text-ellipsis">
                  {post.address ? addressText : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* if post.img_url is not null, show image, else says 'no image'. normalize the size of the image to the height of this card*/}
        <div className="w-2/5 h-full flex justify-center items-center">
          
            {post.img_url ? (
                <AspectRatio ratio={2 / 1}>
              <Image
                src={post.img_url}
                alt={`${post.object_name}的圖片`}
                fill={true}
                className="rounded-md object-contain"
              />
              </AspectRatio>
            ) : (
              <div className="flex aspect-square h-full items-center justify-center rounded-md ">
                <div className="flex w-full h-full items-center justify-center bg-gray-200 rounded-md">
                  <span className="text-gray-500">no image</span>
                </div>
              </div> // Replace this with your placeholder component
            )}
          
        </div>
      </div>
    </Card>
  );
}
