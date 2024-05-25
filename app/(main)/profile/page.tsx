"use client"
import Profile from "@/components/Profile";
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'



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
    console.log(user?.user_metadata);
    if (user === null) {
      return;
    }
    setProfile(user.user_metadata);
    setLoading(false);
  };
  if (loading) {
    fetchProfile();
  }

  return (
    <>
    {loading ? <div>Loading...</div> :
    <Profile 
      title={profile.name} 
      image={profile.picture} 
      mail={profile.email} 
    />
    }
    </>
  );
}
