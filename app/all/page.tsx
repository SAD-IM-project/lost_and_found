'use client';

import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect, useSearchParams } from "next/navigation";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';



interface Object {
  object_id: number;
  object_name: string;
  type: 'lost' | 'found'; // type: either lost or found
  description: string;
  closed: boolean; // closed: either true or false
  post_by: string;
  image: string;
  category: string; // 直接使用文字描述種類
  district: string; // 直接使用文字描述地區
}

const objects: Object[] = [
  {
    object_id: 1,
    object_name: 'Post 1',
    type: 'lost',
    description: '這是 Post 1 的內容。',
    closed: false,
    post_by: 'user1',
    image: 'https://via.placeholder.com/150',
    category: 'item1',
    district: 'loc1'
  },
  {
    object_id: 2,
    object_name: 'Post 2',
    type: 'found',
    description: '這是 Post 2 的內容。',
    closed: false,
    post_by: 'user2',
    image: 'https://via.placeholder.com/150',
    category: 'item2',
    district: 'loc2'
  },
  // 可以繼續添加更多 post
];

export default function HomeFilter() {
  const router = useRouter();

  const handlePostClick = (id: number) => {
    router.push(`/content/${id}`);
  };

  return (
    <div>
      {/* 中间的 post 列表 */}
      <div className="w-full bg-white overflow-y-scroll p-4">
        {objects.map((post) => (
          <Card key={post.object_id} onClick={() => handlePostClick(post.object_id)} className="mb-4 p-4 bg-gray-100 rounded">
            <div className="flex">
              <div className="w-2/3">
                <h3 className="font-semibold">{post.object_name}</h3>
                <span className={`inline-block px-2 py-1 text-xs rounded ${post.type === 'lost' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>{post.type}</span>
                <p className="text-sm text-gray-700 mt-2">{post.description}</p>
                <div className="mt-2">
                  <span className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full mr-2">{post.district}</span>
                  <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">{post.category}</span>
                </div>
              </div>
              <div className="w-1/3 ml-4">
                <img src={post.image} alt={post.object_name} className="w-full h-auto rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}