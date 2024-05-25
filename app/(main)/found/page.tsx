
'use client';

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import pic1 from "@/public/app_images/pic1.jpeg"

interface Object {
  address: string;
  avatar_url: string;
  category_id: string;
  category_name: string;
  city_name: string;
  closed: boolean; // closed: either true or false
  description: string;
  district_name: string;

  district_id: string;
  
  gmail: string;
  happen_time: string;
  img_url: string;
  object_id: string;
  object_name: string;
  post_time: string;
  type: 'lost' | 'found'; // type: either lost or found
  user_id: string;
  user_name: string;
}

export default function FoundFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const [objects, setObjects] = useState<Object[]>([]);

  // get search query
  const search = params.get('search') || '';

  // get date query
  // date format : YYYY-MM-DD-YYYY-MM-DD
  // the former is start date, the latter is end date
  const date = params.get('date') || ''; 
  const dateArrayStr = date.split('-');
  const dateArray = dateArrayStr.map(item => parseInt(item, 10));
  // convert dateArray from string to int
  
  // get category query, for later filtering
  const subCategories = params.get('subCategories') || '';
  const districts_id = params.get('districts') || '';
  const subCategoriesArray = subCategories.split(',');
  const districts_idArray = districts_id.split(',');

  const handlePostClick = (id: string) => {
    router.push(`/content/${id}`);
  };

  const getObject = async () => {
    try {
      const response = await fetch(`/api/object/get?object_id=all&search=${search}`, 
      {
        method: "GET",
      });
      const data = await response.json();
      // console.log(data);
      setObjects(data);
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  // filtering
  const filteredObjects = objects.filter((object) => {
    // filter by lost
    if (object.type !== 'found') {
      return false;
    }
    // filter by subCategories
    if (subCategoriesArray.length > 0 && subCategoriesArray[0] !== '' && !subCategoriesArray.includes(object.category_name)) {
      return false;
    }
    // filter by districts
    if (districts_idArray.length > 0 && districts_idArray[0] !== '' && !districts_idArray.includes(object.district_id)) {
      return false;
    }
    // filter by date
    // format of date array [start_date_YYYY, start_date_MM, start_date_DD, end_date_YYYY, end_date_MM, end_date_DD]
    if (dateArray.length === 6) {
      const startDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
      const endDate = new Date(dateArray[3], dateArray[4] - 1, dateArray[5]);
      const postDate = new Date(object.happen_time);
      if (postDate < startDate || postDate > endDate) {
        return false;
      }
    }
    return true;
  });

  React.useEffect(() => {
    getObject();
  }, [search, date, subCategories, districts_id]);

  console.log(objects);

  return (
    <div>
      <div className="w-full bg-white overflow-y-scroll p-4 ">
        {filteredObjects.map((post) => (
          <Card key={post.object_id} onClick={() => handlePostClick(post.object_id)} className="mb-4 p-4 bg-gray-100 rounded cursor-pointer">
            <div className="flex">
              <div className="w-3/5">
                <h3 className="font-semibold">{post.object_name}</h3>
                <span className={`inline-block px-2 py-1 text-xs rounded ${post.type === 'lost' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>{post.type}</span>
                <p className="text-sm text-gray-700 mt-2">{post.description}</p>
                <div className="mt-2">
                  <span className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full mr-2">{post.district_name}</span>
                  <span className="inline-block bg-blue-200  text-blue-800  text-xs px-2 py-1 rounded-full mr-2">{post.category_name}</span>
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
                          <div
                              className="flex aspect-square w-full h-full items-center justify-center rounded-md "
                          >
                            <div className="flex w-full h-full items-center justify-center bg-gray-200 rounded-md">
                              <span className="text-gray-500">no image</span>
                            </div>
                          </div> // Replace this with your placeholder component
                      )}
                  </AspectRatio>
                </div>
            </div>
          </Card>
        ))}
        {filteredObjects.length === 0 && <div className="text-center text-gray-500">沒有相關的搜尋結果</div>}
      </div>
    </div>
  );
}
