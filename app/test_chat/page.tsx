'use client';

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function Test_chat() {
  useEffect(() => {
    const supabase = createClient();

    const me = supabase.auth.getUser();

    const subscription = supabase
      .channel(`message`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message"},
        (payload) => {
          if (payload.new.sender_id === me || payload.new.receiver_id === me)
            console.log("Change received!", payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    }
  });

  const handleAddMessage = async () => {
    const data = await fetch("/api/message/create?content=hello&sender_id=06d132bc-70c1-497e-b51e-7fe42fb4e090&receiver_id=ce7f7e0e-9a6b-42ab-816c-22f56f871230&object_id=91cdc6a6-4e7a-451c-903a-6dbdd56f9d30", {method: "POST"})
    const res = await data.json()
    console.log(res)    
  }

  return (<div>
    <Button onClick={handleAddMessage}>test</Button>
  </div>)
}
