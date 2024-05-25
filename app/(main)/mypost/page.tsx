"use client";

import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import pic1 from "@/public/app_images/pic1.jpeg";

import { createClient } from "@/utils/supabase/client";
import { set } from "date-fns";
import { User } from "lucide-react";
import ObjectCard from "@/components/ObjectCard";
import Loading from "@/components/Loading";

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

export default function MyPostFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const [objects, setObjects] = useState<Object[]>([]);
  const [userID, setUserID] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // get search query
  const search = params.get("search") || "";

  // get date query
  // date format : YYYY-MM-DD-YYYY-MM-DD
  // the former is start date, the latter is end date
  const date = params.get("date") || "";
  const dateArrayStr = date.split("-");
  const dateArray = dateArrayStr.map((item) => parseInt(item, 10));
  // convert dateArray from string to int

  // get category query, for later filtering
  const subCategories = params.get("subCategories") || "";
  const districts_id = params.get("districts") || "";
  const subCategoriesArray = subCategories.split(",");
  const districts_idArray = districts_id.split(",");

  const handlePostClick = (id: string) => {
    router.push(`/content/${id}`);
  };

  const getObject = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/object/get?object_id=all&search=${search}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      setObjects(data);
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserID = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserID(user.id);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  // filtering
  const filteredObjects = objects.filter((object) => {
    // filter by UserID
    if (object.user_id !== userID) {
      return false;
    }
    // filter by subCategories
    if (
      subCategoriesArray.length > 0 &&
      subCategoriesArray[0] !== "" &&
      !subCategoriesArray.includes(object.category_name)
    ) {
      return false;
    }
    // filter by districts
    if (
      districts_idArray.length > 0 &&
      districts_idArray[0] !== "" &&
      !districts_idArray.includes(object.in_district)
    ) {
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

  React.useEffect(() => {
    getUserID();
  });

  return (
    <>
      <div className="bg-white overflow-y-scroll p-4 w-full h-full">
        {loading ? (
          <Loading />
        ) : (
          filteredObjects.map((post) => (
            <ObjectCard
              key={post.object_id}
              post={post}
              handlePostClick={handlePostClick}
              className="mb-4 p-4 bg-gray-100 rounded cursor-pointer h-[200px]"
            />
          ))
        )}
        {filteredObjects.length === 0 && !loading ? (
          <div className="flex justify-center items-center w-full h-full">
            <div className="text-center text-gray-500">沒有相關的搜尋結果</div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
