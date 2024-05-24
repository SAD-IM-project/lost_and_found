// `app/page.tsx` is the UI for the `/` URL
"use client";
import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, ArrowUpFromLine } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRef } from "react";

/*
必填的東西
object_name === "string" &&
type === "lost" || type === "found" &&
description === "string" &&
data.closed === "boolean" &&
data.post_by === "string" &&
data.post_time === "Date" &&
data.in_district === "string"
*/

export default function Content({ params }: { params: { id: string } }) {
  const [date, setDate] = React.useState<Date>();
  const [uploading, setUploading] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef?.current) fileInputRef.current.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type.split("/")[0] !== "image") {
      alert("Invalid file type. Please upload an image file.");
      return;
    }
    setFile(file);
  };

  const handleSubmit = async () => {
    setUploading(true);
    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();
    console.log("user", user);

    try {
      if (!file) {
        throw new Error("No file selected");
      }
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      console.log("path:", filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images") // Replace with your actual bucket name
        .upload(filePath, file);

      if (uploadError) {
        console.log(uploadError);
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("your-bucket-name").getPublicUrl(filePath);

      // TODO upload this publicUrl to the database
      console.log("publicURL:", publicUrl);

      alert("File uploaded successfully!");
    } catch (error) {
      if (error instanceof Error) {
        alert("Error uploading file: " + error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  React.useEffect(() => {
    console.log(file);
    if (file) {
      console.log(URL.createObjectURL(file));
    }
  }, [file]);

  return (
    <div className="flex flex-row items-start p-5 w-full flex-wrap scroll-smooth focus:scroll-auto border-double border-black border-2">
      <div className="flex w-full h-2/3 ">
        <div className="w-1/2 h-2/3 pl-16 flex flex-col ">
          <button
            className="flex aspect-square w-2/3 h-full items-center justify-center rounded-md border border-dashed"
            onClick={handleButtonClick}
          >
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Upload</span>
            <div className="text-right">上傳遺失物圖片</div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <img src={file ? URL.createObjectURL(file) : ""} />
          </button>
        </div>
        <Card className="w-1/2 h-full dark:bg-white dark:text-black">
          <CardHeader>
            <CardTitle>上傳遺失物</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <b>物品名稱：</b>
            </p>
            <Input className="mb-2" placeholder="e.g. 雨傘" />
            <p>
              <b>尋獲時間：</b>
            </p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                <Select
                  onValueChange={(value) =>
                    setDate(addDays(new Date(), parseInt(value)))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="0">Today</SelectItem>
                    <SelectItem value="1">Tomorrow</SelectItem>
                    <SelectItem value="3">In 3 days</SelectItem>
                    <SelectItem value="7">In a week</SelectItem>
                  </SelectContent>
                </Select>
                <div className="rounded-md border">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </div>
              </PopoverContent>
            </Popover>
            <p className="mt-2">
              <b>尋獲地點：</b>
            </p>
            <Input className="mb-2" placeholder="e.g. 台大總圖" />
            <p>
              <b>尋獲人：</b>
            </p>
            <Input className="mb-2" placeholder="e.g. 王大明" />
            <p>
              <b>物品描述：</b>
            </p>
            <div className="grid w-full gap-1.5">
              <Textarea
                className="dark:bg-white dark:text-black"
                placeholder="Type your message here."
                id="message-2"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="sm" className="ml-auto gap-1.5">
              Upload
              <ArrowUpFromLine className="size-3.5" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      {/* <div className="w-full ml-14 border-black border-solid">
            <div className="grid my-5 w-full gap-1.5">
                <Label htmlFor="message-2">留個言吧</Label>
                <Textarea className="dark:bg-white dark:text-black" placeholder="Type your message here." id="message-2" />
                <Button type="submit" size="sm" className="ml-auto gap-1.5">
                    Comment
                    <MessageSquare className="size-3.5" />
                </Button>
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
        </div> */}
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
