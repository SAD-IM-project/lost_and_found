// `app/page.tsx` is the UI for the `/` URL
import Image from "next/image"
import pic1 from "@/public/app_images/pic1.jpeg"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {MessageSquare} from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


export default function Content({ params }: { params: { id: string } }) {
    return (<div className="flex flex-row items-start p-5 w-full flex-wrap scroll-smooth focus:scroll-auto border-double border-black border-2">
        <div className="flex w-full h-1/2 ">
            <div className="w-1/2 h-1/3 pl-10 flex flex-col ">
                <div className="w-2/3 h-full relative">
                    <AspectRatio ratio={1 / 1}>
                        <Image
                            src={pic1}
                            alt="Hero Image"
                            fill={true}
                            className="rounded-md object-contain"
                        />
                    </AspectRatio>
                </div>
            </div>
            <Card className="w-1/2 h-full dark:bg-white dark:text-black">
                <CardHeader>
                    <CardTitle>雨傘</CardTitle>
                </CardHeader>
                <CardContent >
                    <p><b>物品名稱：</b>雨傘</p>
                    <p><b>物品ID：</b>  {params.id}</p>
                    <p><b>尋獲時間：</b>2024/4/1 上午10:00</p>
                    <p><b>尋獲地點：</b>管二一樓</p>
                    <p><b>尋獲人：</b>卍煞氣的許文鑫卍</p>
                    <p><b>描述：</b>黑色的傘，約100公分長有幾處破洞</p>
                </CardContent>
                <CardFooter>

                </CardFooter>
            </Card>
        </div>
        <div className="w-full ml-14 border-black border-solid">
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
        </div>
    </div>
    )
}