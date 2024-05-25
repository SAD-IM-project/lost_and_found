"use client"
import Profile from "@/components/Profile";
import React, { useState, useEffect, use } from 'react';
import { createClient } from '@/utils/supabase/client'
import Loading from "@/components/Loading";



export default function Page() {
  const [profile, setProfile] = React.useState({
    picture:"",
    name:"",
    email:"",

  })
  const [loading, setLoading] = React.useState(true)

  const fetchProfile = async () => {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.log(error);
      return;
    }
    if (user === null) {
      return;
    }
    const userProfile = {
      picture: user.user_metadata.picture as string,
      name: user.user_metadata.full_name as string,
      email: user.email as string,
    }
    setProfile(userProfile);
    setLoading(false);
  };
  if (loading) {
    fetchProfile();
  }

  return (
    <>
    {loading ? <Loading/> :
    <Profile 
      title={profile.name} 
      image={profile.picture} 
      mail={profile.email} 
    />
    }
    </>
  );
}
