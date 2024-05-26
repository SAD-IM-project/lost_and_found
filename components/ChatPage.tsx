"use client";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import ChatHeader from "@/components/ChatHeader";
import MyMessage from "@/components/MyMessage";
import YourMessage from "@/components/YourMessage";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Loading from "./Loading";

interface channel {
  channelid: string;
  receiver_id: string;
}
const ChatPage: React.FC<channel> = ({ channelid, receiver_id }) => {
  useEffect(() => {
    const supabase = createClient();

    const subscription = supabase
      .channel(`message`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message" },
        (payload) => {
          if (payload.new.object_id === channelid) {
            fetchChatRoom();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  });
  const initialData = [
    { receiver_id: "me", content: "hello", time: "12:00" },
    { receiver_id: "you", content: "hi", time: "11:11" },
  ];
  const [messages, setMessages] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [receiver, setReceiver] = useState<any>(null);
  const [me, setMe] = useState<any>(null);

  const fetchChatRoom = async () => {
    const supabase = createClient();
    if (!me) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setMe(user);
    }
    const data = await fetch("/api/message/get", { method: "GET" });
    const res = await data.json();
    if (!receiver) {
      const receiver_data = await fetch(
        `/api/user/get?user_id=${receiver_id}`,
        { method: "GET" }
      );
      const receiver = await receiver_data.json();
      setReceiver(receiver);
    }

    if (res.error) {
      console.log(res.error);
      return;
    }

    res.data = res.data.filter(
      (element: Message) => element.object_id === channelid
    );
    setMessages([...res.data]);
    setLoading(false);
  };
  if (loading) {
    fetchChatRoom();
  }

  const [inputValue, setInputValue] = useState("");
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    setInputValue("");
    e.preventDefault();
    if (inputValue.trim() === "") return;
    const supabase = createClient();
    const me = await supabase.auth.getUser();
    // Add new message
    const newMessage = {
      receiver_id: receiver_id,
      content: inputValue,
      time: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);

    const data = await fetch(
      `/api/message/create?content=${inputValue}&sender_id=${me.data.user?.id}&receiver_id=${receiver_id}&object_id=${channelid}`,
      { method: "POST" }
    );
    const res = await data.json();
    // Clear the input
  };

  React.useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="max-w-3xl mx-auto md:py-5 w-9/12 h-full">
          <div className="h-full border rounded-md flex flex-col">
            <ChatHeader channel_id={channelid} receiver_id={receiver.user_id} receiver_name={receiver.user_name}/>
            <div className="flex-1 flex flex-col overflow-auto">
              <div className="w-full mt-2 max-h-full">
                {messages.map((msg, index) =>
                  msg.receiver_id === receiver_id ? (
                    <MyMessage
                      key={index}
                      text={msg.content}
                      avatar_url={me.user_metadata.avatar_url}
                      time={msg.time}
                    />
                  ) : (
                    <YourMessage
                      key={index}
                      text={msg.content}
                      avatar_url={receiver.avatar_url}
                      time={msg.time}
                    />
                  )
                )}
                <div ref={buttonRef}></div>
              </div>
            </div>
            <div className="p-5">
              <form onSubmit={handleFormSubmit}>
                <Input
                  placeholder="Send message"
                  value={inputValue}
                  onChange={handleInputChange}
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPage;
