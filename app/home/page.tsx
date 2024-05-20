'use client';

import Link from "next/link";
import { headers } from "next/headers";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React, { useState } from 'react';

interface Object {
  object_id: number;
  object_name: string;
  type: 'lost' | 'found'; // type: either lost or found
  description: string;
  closed: boolean; // closed: either true or false
  post_by: string;
  image: string;
  category_id: number[]; // map to category
  in_district: number[];  // map to district
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
    category_id: [1],
    in_district: [1]
  },
  {
    object_id: 2,
    object_name: 'Post 2',
    type: 'found',
    description: '這是 Post 2 的內容。',
    closed: false,
    post_by: 'user2',
    image: 'https://via.placeholder.com/150',
    category_id: [2],
    in_district: [2]
  },
  // 可以繼續添加更多 post
];

const districts: string[] = ['loc1', 'loc2', 'loc3'];
const categories: string[] = ['item1', 'item2', 'item3'];

const yearOptions: number[] = Array.from({ length: 10 }, (_, index) => 2022 - index);
const monthOptions: number[] = Array.from({ length: 12 }, (_, index) => index + 1);
const dayOptions: number[] = Array.from({ length: 31 }, (_, index) => index + 1);

export default function Home() {
  const [filters, setFilters] = useState<{ district: string | 'all', category: string | 'all', type: 'all' | 'lost' | 'found' }>({
    district: 'all',
    category: 'all',
    type: 'all'
  });

  const filteredPosts = objects.filter(post => {
    const districtMatch = filters.district === 'all' || post.in_district.some(d => districts[d - 1] === filters.district);
    const categoryMatch = filters.category === 'all' || post.category_id.some(c => categories[c - 1] === filters.category);
    const typeMatch = filters.type === 'all' || post.type === filters.type;

    return districtMatch && categoryMatch && typeMatch;
  });

  const handleDistrictFilter = (district: string) => {
    setFilters(prevFilters => ({ ...prevFilters, district }));
  };

  const handleCategoryFilter = (category: string) => {
    setFilters(prevFilters => ({ ...prevFilters, category }));
  };

  const handleTypeFilter = (type: 'all' | 'lost' | 'found') => {
    setFilters(prevFilters => ({ ...prevFilters, type }));
  };

  const handleClearFilters = () => {
    setFilters({ district: 'all', category: 'all', type: 'all' });
  };

  return (
    <div className="flex h-screen">
      {/* 左側選擇欄 */}
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">選擇標籤</h2>
        <div>
          <h3 className="font-semibold">地點</h3>
          <div className="space-y-2">
            {districts.map((tag, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded ${filters.district === tag ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => handleDistrictFilter(tag)}
              >
                {tag}
              </button>
            ))}
            <button
              className="px-4 py-2 rounded bg-gray-300"
              onClick={() => handleDistrictFilter('all')}
            >
              清除地點篩選
            </button>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">物品</h3>
          <div className="space-y-2">
            {categories.map((tag, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded ${filters.category === tag ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => handleCategoryFilter(tag)}
              >
                {tag}
              </button>
            ))}
            <button
              className="px-4 py-2 rounded bg-gray-300"
              onClick={() => handleCategoryFilter('all')}
            >
              清除物品篩選
            </button>
            <h3 className="font-semibold">遺失時間</h3>
          <div className="flex">
            <select className="w-1/3">
              {yearOptions.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
            <select className="w-1/3">
              {monthOptions.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
            <select className="w-1/3">
              {dayOptions.map((day, index) => (
                <option key={index} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <h3 className="font">到</h3>
          <div className="flex">
            <select className="w-1/3">
              {yearOptions.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
            <select className="w-1/3">
              {monthOptions.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
            <select className="w-1/3">
              {dayOptions.map((day, index) => (
                <option key={index} value={day}>{day}</option>
              ))}
            </select>
          </div>
          </div>
        </div>
      </div>

      {/* 中間的 post 列表 */}
      <div className="w-2/4 bg-white overflow-y-scroll p-4">
        {/* <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="搜尋文章名稱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md w-full"
          />
        </div> */}
        <h2 className="text-xl font-bold mb-4">Post 列表</h2>
        <div className="mb-4 flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${filters.type === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => handleTypeFilter('all')}
          >
            全部
          </button>
          <button
            className={`px-4 py-2 rounded ${filters.type === 'lost' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => handleTypeFilter('lost')}
          >
            Lost
          </button>
          <button
            className={`px-4 py-2 rounded ${filters.type === 'found' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => handleTypeFilter('found')}
          >
            Found
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-300"
            onClick={handleClearFilters}
          >
            清除所有篩選
          </button>
        </div>
        {filteredPosts.map((post, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-100 rounded shadow flex">
            {/* 左側文字部分 */}
            <div className="w-3/4 pr-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{post.object_name}</h3>
                <span className={`inline-block px-2 py-1 text-xs rounded ${post.type === 'lost' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>{post.type}</span>
              </div>
              <p>{post.description}</p>
              {/* 地區和物品標籤 */}
              <div className="mt-2">
                <div className="flex">
                  {post.in_district.map((districtId, idx) => (
                    <span key={idx} className="inline-block bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full mr-2">{districts[districtId - 1]}</span>
                  ))}
                </div>
                <div className="flex mt-2">
                  {post.category_id.map((categoryId, idx) => (
                    <span key={idx} className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">{categories[categoryId - 1]}</span>
                  ))}
                </div>
                </div>
            </div>
            {/* 右側圖片部分 */}
            <div className="w-1/4">
              <img src={post.image} alt={post.object_name} className="w-full h-auto rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* 右側按鍵欄 */}
      <div className="fixed top-1/2 transform -translate-y-1/2 right-4 flex flex-col space-y-2">
        <button className="w-12 h-12 bg-blue-500 text-white rounded-full">✉️</button>
        <button className="w-12 h-12 bg-blue-500 text-white rounded-full">🔔</button>
        <button className="w-12 h-12 bg-blue-500 text-white rounded-full">➕</button>
      </div>
    </div>
  );
}
