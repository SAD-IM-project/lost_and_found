"use client"
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Select, { MultiValue, ActionMeta, GroupBase } from 'react-select';

// 定義選項類型
interface Option {
    value: string;
    label: string;
}


// // 定義大分類及其對應的子分類
// const categories: Record<string, Option[]> = {
//     '證件': [
//         { value: '學生證', label: '學生證' },
//         { value: '身分證', label: '身分證' },
//     ],
//     '電子產品': [
//         { value: 'iPhone', label: 'iPhone' },
//         { value: 'airpods pro', label: 'airpods pro' },
//     ],
// };

// 定義城市及其對應的區
// const locations: Record<string, Option[]> = {
//     '台北市': [
//         { value: '中正區', label: '中正區' },
//         { value: '大安區', label: '大安區' },
//     ],
//     '新北市': [
//         { value: '泰山區', label: '泰山區' },
//         { value: '新莊區', label: '新莊區' },
//     ],
// };

export function Filter({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const [date, setDate] = React.useState<DateRange | undefined>(undefined)
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const [selectedMainCategories, setSelectedMainCategories] = React.useState<MultiValue<Option>>([]);
    const [selectedSubCategories, setSelectedSubCategories] = React.useState<MultiValue<Option>>([]);
    const [subCategoryOptions, setSubCategoryOptions] = React.useState<Option[]>([]);
    const [selectedCities, setSelectedCities] = React.useState<MultiValue<Option>>([]);
    const [selectedDistricts, setSelectedDistricts] = React.useState<MultiValue<Option>>([]);
    const [districtOptions, setDistrictOptions] = React.useState<Option[]>([]);
    const [categories, setCategories] = React.useState<Record<string, Option[]>>({})
    const [locations, setLocations] = React.useState([]);



    React.useEffect(() => {
        fetch('/api/city_district/get_all')
            .then(response => response.json())
            .then(data => {
                const formattedData = data.data.city_district.reduce((acc: any, item: any) => {
                    acc[item.city_name] = item.district.map((d: any) => ({
                        value: d.district_name,
                        label: d.district_name
                    }));
                    return acc;
                }, {});
                setLocations(formattedData);
                console.log(formattedData);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    // 當大分類改變時，更新子分類選項
    const handleMainCategoryChange = (newSelectedMainCategories: MultiValue<Option>, actionMeta: ActionMeta<Option>) => {
        // 找出被移除的大分類
        const removedMainCategories = selectedMainCategories.filter(
            category => !newSelectedMainCategories.some(newCat => newCat.value === category.value)
        );

        // 更新大分類
        setSelectedMainCategories(newSelectedMainCategories);

        // 找出需要保留的子分類
        const remainingSubCategories = selectedSubCategories.filter(
            subCategory => !removedMainCategories.some(
                mainCategory => categories[mainCategory.value].some(
                    cat => cat.value === subCategory.value
                )
            )
        );

        setSelectedSubCategories(remainingSubCategories);

        const subCategories = newSelectedMainCategories.flatMap(cat => categories[cat.value] || []);
        setSubCategoryOptions(subCategories);
    }
    // 當城市改變時，更新區選項
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

        const districts = newSelectedCities.flatMap(city => locations[city.value] || []);
        setDistrictOptions(districts);
    }
    const handleResetDate = () => {
        setDate(undefined)
    }
    const handleApplyDate = () => {
        setIsPopoverOpen(false)
    }
    const handleApply = () => {
        setIsPopoverOpen(false)
    }
    const handleReset = () => {
        setDate(undefined)
        setIsPopoverOpen(false)
        setSelectedMainCategories([])
        setSelectedSubCategories([])
        setSubCategoryOptions([])
        setSelectedCities([])
        setSelectedDistricts([])
        setDistrictOptions([])
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <span>Date:</span>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                    <div className="flex justify-end gap-2 p-5">
                        <Button onClick={handleResetDate} variant="outline">Reset</Button>
                        <Button onClick={handleApplyDate}>Apply</Button>
                    </div>
                </PopoverContent>
            </Popover>
            <span>Main Category:</span>
            <Select
                options={Object.keys(categories).map(cat => ({ value: cat, label: cat }))}
                isMulti
                className="w-[300px]"
                placeholder="Select main category..."
                value={selectedMainCategories}
                onChange={handleMainCategoryChange}
                id="mainCategory"
            />
            <span>Sub Category:</span>
            <Select
                options={subCategoryOptions}
                isMulti
                className="w-[300px]"
                placeholder="Select sub category..."
                value={selectedSubCategories}
                onChange={setSelectedSubCategories}
                id="subCategory"
                isDisabled={selectedMainCategories.length === 0}
            />
            <span>City:</span>
            <Select
                options={Object.keys(locations).map(city => ({ value: city, label: city }))}
                isMulti
                className="w-[300px]"
                placeholder="Select city..."
                value={selectedCities}
                onChange={handleCityChange}
                id="city"
            />
            <span>District:</span>
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
            <div className="flex justify-end gap-2 p-5">
                <Button onClick={handleReset} variant="outline">Reset</Button>
                <Button onClick={handleApply}>Apply</Button>
            </div>
        </div>
    )
}
