"use client";

import React from "react";
import MyPostButton from "./MyPostButton";
import MyChatButton from "./MyChatButton";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
interface ProfileProps {
    title: string;
    mail: string;
    image: string;
}

const Profile: React.FC<ProfileProps> = ({ title, image, mail }) => {
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  }
  return (
    <div className="flex flex-col items-center  w-full h-full mt-20 ml-51">
      <div className="w-2/3 h-2/5 bg-white shadow-md p-8 rounded-xl border-4 border-black flex items-center flex-col">
        
        <img
          src={image}
          alt="profile"
          className="w-24 h-24 rounded-full"
        />
        <h1 className="text-2xl font-bold mt-4">{title}</h1>
        <p className="text-lg mt-2">{mail}</p>
      </div>
      <MyPostButton />
      <MyChatButton />
      <Button onClick={handleLogout}>logout</Button>
    </div>
  );
};

export default Profile;
