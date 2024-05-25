"use client";

import React from "react";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
interface ProfileProps {
  title: string;
  mail: string;
  image: string;
}

const Profile: React.FC<ProfileProps> = ({ title, image, mail }) => {
  const router = useRouter();
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center  w-full h-full justify-center">
      <div className="w-2/3 bg-white shadow-md p-8 rounded-xl flex items-center flex-col">
        <div className="w-full flex flex-col items-center pb-2 border-b-2">
          <img src={image} alt="profile" className="w-24 h-24 rounded-full" />
          <h1 className="text-2xl font-bold mt-4">{title}</h1>
          <p className="text-lg mt-2">{mail}</p>
        </div>
        {/* <div className="w-full  flex"> */}
          <Button
            className="w-1/2 m-2 border-[1.5px]"
            onClick={() => {
              router.push("/mypost");
            }}
            variant={"outline"}
          >
            My Post
          </Button>
          <Button
            className="w-1/2 m-2 border-[1.5px] text-red-600 hover:text-red-600 hover:border-red-600"
            onClick={handleLogout}
            variant={"outline"}
          >
            logout
          </Button>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Profile;
