'use client';

import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect, useSearchParams } from "next/navigation";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

type LostObject = {
  object_id: string;
  object_name: string;
  type: 'lost' | 'found';
  description: string;
  closed: boolean;
  post_by: string;
  category_id: string;
  in_district: string;
  post_time: Date;
  happen_time: Date;
  address: string;
  image: string;
};

const objects: LostObject[] = [
  {
    object_id: '1',
    object_name: 'Post 1',
    type: 'lost',
    description: '這是 Post 1 的內容。',
    closed: false,
    post_by: 'user1',
    category_id: 'item1',
    in_district: 'loc1',
    post_time: new Date(),
    happen_time: new Date(),
    address: 'address1',
    image: 'https://via.placeholder.com/150',
  },
  {
    object_id: '2',
    object_name: 'Post 2',
    type: 'found',
    description: '這是 Post 2 的內容。',
    closed: false,
    post_by: 'user2',
    category_id: 'item2',
    in_district: 'loc2',
    post_time: new Date(),
    happen_time: new Date(),
    address: 'address2',
    image: 'https://via.placeholder.com/150',
  },
];

export default function All() {
  const router = useRouter();
  const params = useSearchParams();
  console.log(params.get('search')); // search
  console.log(params.get('date')); // start date and end date

  const handlePostClick = (id: number) => {
    router.push(`/id/${id}`);
  };

  const getObjects = async () => {
    try {
      const response = await fetch("api/object/get?object_id=all&search=sovhe", {
        method: "GET",
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  return (
    <div className="w-full bg-white overflow-y-scroll p-4">
      {objects.map((post) => (
        <Card key={post.object_id} post={post} onClick={handlePostClick} />
      ))}
    </div>
  );
}
