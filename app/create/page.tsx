// `app/page.tsx` is the UI for the `/` URL
"use client";
import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import Image from "next/image"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    
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

import Select, { MultiValue, ActionMeta, GroupBase } from 'react-select';
// 定義選項類型
interface Option {
    value: string;
    label: string;
}
/*
必填的東西
object_name === "string" &&
type === "lost" || type === "found" &&
description === "string" &&
data.closed === "boolean" && 不用
data.post_by === "string" &&
data.post_time === "Date" && 不用
data.in_district === "string"

optional
happen_time === "Date" &&
address === "string"
img_url === "string"
*/

export default function Content({ params }: { params: { id: string } }) {

    const [date, setDate] = React.useState<Date>();
    const [objectName, setObjectName] = React.useState<string | null>(null);
    const [description, setDescription] = React.useState<string | null>(null);
    const [postBy, setPostBy] = React.useState<string | null>(null);
    const [inDistrict, setInDistrict] = React.useState<string | null>(null);
    const [lostFound, setLostFound] = React.useState<string | undefined>("lost");


    const [selectedCities, setSelectedCities] = React.useState<MultiValue<Option>>([]);
    const [selectedDistricts, setSelectedDistricts] = React.useState<MultiValue<Option>>([]);
    const [districtOptions, setDistrictOptions] = React.useState<GroupBase<Option>[]>([]);
    const [locations, setLocations] = React.useState<Record<string, Option[]>>({});

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

    const handleCityChange = (newSelectedCities: MultiValue<Option>, actionMeta: ActionMeta<Option>) => {
        // 找出被移除的城市
        const removedCities = selectedCities.filter(
            city => !newSelectedCities.some(newCity => newCity.value === city.value)
        );

        // 更新城市
        setSelectedCities(newSelectedCities);

        // 找出需要保留的區
        const remainingDistricts = selectedDistricts.filter(
            district => !removedCities.some(
                city => locations[city.value].some(
                    loc => loc.value === district.value
                )
            )
        );

        setSelectedDistricts(remainingDistricts);

        // 更新區選項
        const districts = newSelectedCities.map(city => ({
            label: city.label,
            options: locations[city.value] || []
        }));
        setDistrictOptions(districts);
    }

    const handleSubmit = async () => {
        setUploading(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        console.log("user", user);

        try {
            if (!(file && objectName && description && postBy && inDistrict && date && lostFound)) {
                throw new Error("Missing required fields");
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



            // Make a POST request to the API
            const response = await fetch(`api/object/create?object_name=${objectName}&descripttion=${description}&post_by=${postBy}&in_district=${inDistrict}&type=${lostFound}`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Error uploading data');
            }

            const data = await response.json();

            console.log('Data:', data);
        } catch (error) {
            if (error instanceof Error) {
                alert("Error uploading file: " + error.message);
            }
        } finally {
            setUploading(false);
        }
    };

    const onTabChange = (value: string) => {
        setLostFound(value);
    }

    React.useEffect(() => {
        fetch('/api/city_district/get_all')
            .then(response => response.json())
            .then(data => {
                const formattedData = data.city_district.reduce((acc: any, item: any) => {
                    acc[item.city_name] = item.district.map((d: any) => ({
                        value: d.district_id,
                        label: d.district_name
                    }));
                    return acc;
                }, {});
                setLocations(formattedData);
            })
            .catch(error => console.error('Error:', error));
    }, []);
    
    return (
        <div className="flex flex-row items-start p-5 w-full flex-wrap scroll-smooth focus:scroll-auto border-double border-black border-2">
            <div className="flex w-full h-2/3 ">
                <div className="w-1/2 h-3/4  flex flex-col mr-2">
                    {!file ? (<button
                        className="flex aspect-square w-full h-full items-center justify-center rounded-md border-dashed border-2"
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
                    </button>) :
                        (<div className="w-full h-full relative">
                            <AspectRatio ratio={1 / 1}>
                                <Image
                                    src={URL.createObjectURL(file)}
                                    alt="Hero Image"
                                    fill={true}
                                    className="rounded-md object-contain"
                                />
                            </AspectRatio>
                        </div>)}
                </div>
                <Card className="w-1/2 h-full dark:bg-white dark:text-black">
                    <CardHeader>
                        <CardTitle>上傳遺失物</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            <b>物品名稱：</b>
                        </p>
                        <Input className="mb-2" placeholder="e.g. 雨傘"
                            value={objectName as string} // Change the type of value prop from String to string
                            onChange={e => setObjectName(e.target.value)} />
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
                                <div className="rounded-md border">
                                    <Calendar mode="single" selected={date} onSelect={setDate} />
                                </div>
                            </PopoverContent>
                        </Popover>
                        <p className="mt-2">
                            <b>尋獲地點：</b>
                        </p>
                        <span>城市:</span>
                        <Select
                            options={Object.keys(locations).map(city => ({ value: city, label: city }))}
                            isMulti
                            className="w-[300px]"
                            placeholder="Select city..."
                            value={selectedCities}
                            onChange={handleCityChange}
                            id="city"
                        />
                        <span>區:</span>
                        <Select
                            options={districtOptions}
                            isMulti
                            className="w-[300px]"
                            placeholder="Select district..."
                            value={selectedDistricts}
                            onChange={setSelectedDistricts}
                            id="district"
                            isDisabled={selectedCities.length === 0}
                        />
                        <Input className="my-2" placeholder="e.g. 台大總圖"
                            value={inDistrict as string} // Change the type of value prop from String to string
                            onChange={e => setInDistrict(e.target.value)}
                        />
                        <p>
                            <b>尋獲人：</b>
                        </p>
                        <Input className="mb-2" placeholder="e.g. 王大明"
                            value={postBy as string} // Change the type of value prop from String to string
                            onChange={e => setPostBy(e.target.value)}
                        />
                        <Tabs value={lostFound} onValueChange={onTabChange} defaultValue="lost" className="my-2">
                            <TabsList className="w-full my-2">
                                <TabsTrigger className="w-full my-2" value="lost">Lost</TabsTrigger>
                                <TabsTrigger className="w-full my-2" value="found">Found</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <p>
                            <b>物品描述：</b>
                        </p>
                        <div className="grid w-full gap-1.5">
                            <Textarea
                                className="dark:bg-white dark:text-black"
                                placeholder="Type your message here."
                                id="message-2"
                                value={description as string} // Change the type of value prop from String to string
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" size="sm" className="ml-auto gap-1.5"
                            onClick={handleSubmit}>
                            Upload
                            <ArrowUpFromLine className="size-3.5" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
