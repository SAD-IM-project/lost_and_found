"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { postcss } from "tailwindcss";
import { area_data, onclick_api } from "./data";
import { createClient } from "@/utils/supabase/client";

export default function Test() {
  const handleOnClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      let api =
        onclick_api[event.currentTarget.name as keyof typeof onclick_api].api +
        "?";
      const method =
        onclick_api[event.currentTarget.name as keyof typeof onclick_api]
          .method;

      for (const param of onclick_api[
        event.currentTarget.name as keyof typeof onclick_api
      ].params) {
        api += `${param}=${form[param as keyof typeof form]}&`;
      }

      const response = await fetch(api, { method: method });
      const data = await response.json();
      if (!response.ok) {
        // console.log("Failed to create city district");
      } else {
        // console.log(data)
      }
    } catch (error) {
      // Handle network error
      console.log("Network error:", error);
    }
  };

  const addAllCityDistrict = async () => {
    try {
      for (const city in area_data) {
        for (const district of area_data[city as keyof typeof area_data]) {
          const response = await fetch(
            `api/db/add_city_district?city=${city}&district=${district}`,
            { method: "POST" }
          );
          if (!response.ok) {
            console.error(
              `Failed to create city district: ${city} ${district}`
            );
          } else {
            console.log(response, city, district);
          }
        }
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
    }
  };

  const getAllCityDistrict = async () => {
    try {
      const response = await fetch("api/city_district/get_all", {
        method: "GET",
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  const getAllCategory = async () => {
    try {
      const response = await fetch("api/category/get?category_name=all", {
        method: "GET",
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  const createObject = async () => {
    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) return console.error("User not found");
    const object: Partial<LostObject> = {
      object_name: "sovheorv",
      type: "lost",
      description: "hohsvoehvo",
      post_by: user.id,
    }
    let api = "api/object/create?";
    for (const key in object) {
      api += `${key}=${object[key as keyof LostObject]}&`;
    }
    try {
      const response = await fetch( api, {
        method: "POST",
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  const getObject = async () => {
    try {
      const id = "91cdc6a6-4e7a-451c-903a-6dbdd56f9d30"
      const response = await fetch(`api/object/get?object_id=0ad56c04-0b16-4801-ba32-761b19adea88`, {
        method: "GET",
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  const [form, setForm] = useState({
    city: "",
    district: "",
    category_name: "",
    sub_of: "",
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.name);
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  return (
    <div className="w-full flex flex-wrap h-screen justify-center items-center overflow-auto">
      <Card className="w-[30%] h-[350px] overflow-auto">
        <CardHeader>
          <CardTitle>Welcome to content management system</CardTitle>
          <CardDescription>你可以在此處新增或刪除db資源</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap w-full justify-center">
          <Input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="m-2"
          />
          <Input
            name="district"
            placeholder="District"
            value={form.district}
            onChange={handleChange}
            className="m-2"
          />
          <Button
            name="createCityDistrict"
            onClick={handleOnClick}
            className="m-2"
          >
            新增
          </Button>
          <Button onClick={addAllCityDistrict} className="m-2">
            新增全部
          </Button>
        </CardContent>
      </Card>

      <Card className="w-[30%] h-[350px] overflow-auto">
        <CardHeader>
          <CardTitle>Category</CardTitle>
          <CardDescription>你可以在此處修改CATEGORY資料表</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap w-full justify-center">
          <Input
            name="category_name"
            placeholder="category_name"
            value={form.category_name}
            onChange={handleChange}
            className="m-2"
          />
          <Input
            name="sub_of"
            placeholder="sub_of"
            value={form.sub_of}
            onChange={handleChange}
            className="m-2"
          />
          <Button name="deleteCategory" onClick={handleOnClick} className="m-2" variant="outline">
            刪除
          </Button>
          <Button name="createCategory" onClick={handleOnClick} className="m-2">
            新增
          </Button>
        </CardContent>
      </Card>

      <Button onClick={getAllCityDistrict}>getAllCityDistrict</Button>
      <Button onClick={getAllCategory}>getAllCategory</Button>
      <Button onClick={createObject}>createObject</Button>
      <Button onClick={getObject}>getObject</Button>
    </div>
  );
}
