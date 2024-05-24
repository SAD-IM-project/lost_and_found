"use client"
import Profile from "@/components/Profile";
import React from 'react'
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
export default function page() {

  const [loading, setLoading] = useState(true)
  // initial me as a user_metadata
  const [me, setMe] = useState({})
  const fetchuser = async () => {
  const supabase = createClient();
    const me = await supabase.auth.getUser();

    if(me.error) {
      return
    }
    console.log(me)
    setMe(me.data.user.user_metadata)
    setLoading(false)
  }
  if (loading)
  {
    fetchuser()
  }
  
  return (
    <>
     {loading? <div>Loading...</div> : <Profile title={me.name} mail={me.email} image={me.picture}  />}  
    </>
    
        
        
    
    
  )
}
