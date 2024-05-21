// `app/page.tsx` is the UI for the `/` URL
import Image from "next/image"
import pic1 from "@/public/app_images/pic1.jpg"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


export default function Content() {
    return (<div className="flex flex-row items-start p-5 w-9/12 h-screen flex-wrap">
        <div className="flex w-full h-1/2">
            <div className="w-1/2 h-1/3 flex items-center justify-center ">
                <div className="w-3/4 h-full relative">
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
                <CardContent>
                    <p><b>物品名稱：</b>雨傘</p>
                    <p><b>尋獲時間：</b>2024/4/1 上午10:00</p>
                    <p><b>尋獲地點：</b>管二一樓</p>
                    <p><b>尋獲人：</b>卍煞氣的許文鑫卍</p>
                    <p><b>描述：</b>黑色的傘，約100公分長有幾處破洞</p>
                </CardContent>
            </Card>
        </div>
        <div className="grid w-full gap-1.5 ">
            <Label htmlFor="message-2">留個言吧</Label>
            <Textarea className="dark:bg-white dark:text-black" placeholder="Type your message here." id="message-2" />
        </div>
        <div className="grid w-full gap-1.5 bg-slate-400 px-2 rounded-lg">
            <div className="bg-slate-400 text-white "> 
                Author
            </div>
            <div className="bg-slate-400 text-white "> 
                Time
            </div>
            <div className="bg-slate-400 text-white "> 
                HIIIII
            </div>
        </div>

    </div>
    )
}