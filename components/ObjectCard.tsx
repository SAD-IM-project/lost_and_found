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
  return (
    <Card
      key={post.object_id}
      onClick={() => handlePostClick(post.object_id)}
      className={className}
    >
      <div className="flex">
        <div className="w-3/5">
          <h3 className="font-semibold">{post.object_name}</h3>
          <span
            className={`inline-block px-2 py-1 text-xs rounded ${
              post.type === "lost"
                ? "bg-red-200 text-red-800"
                : "bg-green-200 text-green-800"
            }`}
          >
            {post.type}
          </span>
          <p className="text-sm text-gray-700 mt-2">{post.description}</p>
          <div className="mt-2">
            {/* if post.district_name not none, shows, else shows 'no distrcit tag' in red font, same background colour */}
            {post.category_name ? (
              <span className="inline-block bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full mr-2">
                {post.district_name}
              </span>
            ) : (
              <span className="inline-block bg-yellow-100 text-black-800 text-xs px-2 py-1 rounded-full mr-2">
                no district tag
              </span>
            )}
            {/* if post.category_name not none, shows, else shows 'no category tag' in red font, same background colour */}
            {post.category_name ? (
              <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                {post.category_name}
              </span>
            ) : (
              <span className="inline-block bg-blue-100 text-black-800 text-xs px-2 py-1 rounded-full mr-2">
                no category tag
              </span>
            )}
          </div>
        </div>
        {/* if post.img_url is not null, show image, else says 'no image'. normalize the size of the image to the height of this card*/}
        <div className="w-2/5 h-full relative">
          <AspectRatio ratio={2 / 1}>
            {post.img_url ? (
              <Image
                src={post.img_url}
                alt={`${post.object_name}的圖片`}
                fill={true}
                className="rounded-md object-contain"
              />
            ) : (
              <div className="flex aspect-square w-full h-full items-center justify-center rounded-md ">
                <div className="flex w-full h-full items-center justify-center bg-gray-200 rounded-md">
                  <span className="text-gray-500">no image</span>
                </div>
              </div> // Replace this with your placeholder component
            )}
          </AspectRatio>
        </div>
      </div>
    </Card>
  );
}
