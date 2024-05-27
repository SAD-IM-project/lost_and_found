// `app/page.tsx` is the UI for the `/` URL
"use client";
import Image from "next/image";
import { Loader } from "lucide-react";
import pic1 from "@/public/app_images/pic1.jpeg";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { get } from "http";
import Loading from "@/components/Loading";

type DataType = {
  city_name: string;
  district_name: string;
  user_name: string;
  user_id: string;
  object_name: string;
  category_name: string;
  happen_time: string;
  address: string;
  post_by: string;
  post_time: string;
  img_url: string;
  description: string;
};
type CommentType = {
  comment_id: string;
  content: string;
  post_by: string;
  post_time: string;
  user_name: string;
  object_id: string;
};

export default function Content({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [comment, setComment] = useState<string | undefined>("");
  const [data, setData] = useState<DataType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [me, setMe] = useState<any>(null);

  const getObjectData = async () => {
    try {
      const response = await fetch(`/api/object/get?object_id=${params.id}`, {
        method: "GET",
      });
      const data = await response.json();
      setData(data);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setMe(user);
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const getComments = async () => {
    try {
      const response = await fetch(`/api/comment/get?object_id=${params.id}`, {
        method: "GET",
      });
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = async () => {
    // const content = searchParams.get("content");
    // const post_by = searchParams.get("post_by");
    // const post_time = new Date();
    // const object_id = searchParams.get("object_id");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      let url = `/api/comment/create?content=${comment}&post_by=${user.id}&object_id=${params.id}`;
      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Error uploading data");
      }

      const data = await response.json();

      alert("Commented successfully!");
      setComment("");
      getComments();
    }
  };

  useEffect(() => {
    getObjectData();
    getComments();
  }, []);

  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    const data = await fetch(`/api/object/delete?object_id=${params.id}`, {method: "DELETE"});
    const res = await data.json();
    setDeleting(false);
    router.back();
  }

  return data ? (
    <div className="flex flex-row items-start p-5 flex-wrap scroll-smooth focus:scroll-auto border-2 m-2 rounded-md">
      <div className="flex w-full h-1/2 ">
        <div className="w-1/2 h-1/3 pl-10 flex flex-col justify-center items-center">
          <div className="w-2/3 h-full relative">
            <AspectRatio ratio={1 / 1}>
              {data.img_url ? (
                <Image
                  src={data.img_url}
                  alt="Hero Image"
                  fill={true}
                  className="rounded-md object-contain"
                />
              ) : (
                <div className="flex aspect-square w-full h-full items-center justify-center rounded-md border-dashed border-2">
                  <div className="text-right">no image</div>
                </div> // Replace this with your placeholder component
              )}
            </AspectRatio>
          </div>
        </div>
        <Card className="w-1/2 h-full dark:bg-white dark:text-black">
          <CardHeader>
            <CardTitle>{data.object_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <b>物品ID：</b> {params.id}
            </p>
            <p>
              <b>尋獲時間：</b>
              {new Date(data.happen_time).toISOString().split("T")[0]}
            </p>
            <p>
              <b>尋獲地點：</b>
              {data.city_name} {data.district_name}
            </p>
            <p>
              <b>物品種類：</b>
              {data.category_name}
            </p>
            <p>
              <b>尋獲人：</b>
              {data.user_name}
            </p>
            <p>
              <b>描述：</b>
              {data.description}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            {me ? (
              data.user_id === me.id ? (
                deleting? <Loader/>:<Trash2 onClick={handleDelete}/>
              ) : (
                <Button
                  onClick={() =>
                    router.push(`/chatroom/${params.id}/${data.user_id}`)
                  }
                >
                  Go to chat
                </Button>
              )
            ) : (
              <></>
            )}
          </CardFooter>
        </Card>
      </div>
      <div className="w-full ml-14 border-black border-solid">
        <div className="grid my-5 w-full gap-1.5">
          <Label htmlFor="message-2">留個言吧</Label>
          <Textarea
            className="dark:bg-white dark:text-black"
            placeholder="Type your message here."
            id="message-2"
            value={comment}
            onChange={handleCommentChange}
          />
          <Button
            type="submit"
            size="sm"
            className="ml-auto gap-1.5"
            onClick={handleCommentSubmit}
          >
            Comment
            <MessageSquare className="size-3.5" />
          </Button>
        </div>
        {comments.map((comment, index) => (
          <Card className="my-3">
            <CardHeader>
              <CardTitle>{comment.content}</CardTitle>
              <CardDescription>{comment.user_name}</CardDescription>
            </CardHeader>
          </Card>
        ))}

        {/* <div className="grid my-5 w-full gap-1.5  px-2 rounded-lg outline-black outline">
                <div className=" text-black ">
                    Author
                </div>
                <div className=" text-black ">
                    Time
                </div>
                <div className=" text-black ">
                    Comment
                </div>
            </div>
            <div className="grid my-5 w-full gap-1.5  px-2 rounded-lg outline-black outline">
                <div className=" text-black ">
                    Author
                </div>
                <div className=" text-black ">
                    Time
                </div>
                <div className=" text-black ">
                    Comment
                </div>
            </div>
            <div className="grid my-5 w-full gap-1.5  px-2 rounded-lg outline-black outline">
                <div className=" text-black ">
                    Author
                </div>
                <div className=" text-black ">
                    Time
                </div>
                <div className=" text-black ">
                    Comment
                </div>
            </div>*/}
      </div>
    </div>
  ) : (
    <Loading />
  );
}
