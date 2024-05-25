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
import { useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"

// 定義選項類型
interface Option {
    value: string;
    label: string;
}

// 定義過濾器組件
export function Filter({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const [date, setDate] = React.useState<DateRange | undefined>(undefined)
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const [selectedMainCategories, setSelectedMainCategories] = React.useState<MultiValue<Option>>([]);
    const [selectedSubCategories, setSelectedSubCategories] = React.useState<MultiValue<Option>>([]);
    const [subCategoryOptions, setSubCategoryOptions] = React.useState<GroupBase<Option>[]>([]);
    const [selectedCities, setSelectedCities] = React.useState<MultiValue<Option>>([]);
    const [selectedDistricts, setSelectedDistricts] = React.useState<MultiValue<Option>>([]);
    const [districtOptions, setDistrictOptions] = React.useState<GroupBase<Option>[]>([]);
    const [categories, setCategories] = React.useState<Record<string, Option[]>>({})
    const [locations, setLocations] = React.useState<Record<string, Option[]>>({});

    React.useEffect(() => {
        fetch('/api/category/get?category_name=all')
            .then(response => response.json())
            .then(data => {
                const formattedData = data.reduce((acc: any, item: any) => {
                    if (item.sub_of.length > 0) {
                        acc[item.category_name] = item.sub_of.map((d: any) => ({
                            value: d.category_name,
                            label: d.category_name
                        }));
                    }
                    return acc;
                }, {});
                setCategories(formattedData);
            })
            .catch(error => console.error('Error:', error));
    }, []);

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

        // 更新子分類選項
        const subCategories = newSelectedMainCategories.map(cat => ({
            label: cat.label,
            options: categories[cat.value] || []
        }));
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

        // 更新區選項
        const districts = newSelectedCities.map(city => ({
            label: city.label,
            options: locations[city.value] || []
        }));
        setDistrictOptions(districts);
    }

    const handleResetDate = () => {
        setDate(undefined)
    }

    const handleApplyDate = () => {
        setIsPopoverOpen(false)
    }

    const router = useRouter()
    const searchParams = useSearchParams();
    const handleApply = () => {
        setIsPopoverOpen(false)
        const currentQuery = queryString.parse(searchParams.toString());
        const query = {
            ...currentQuery,
            date: date ? `${format(date.from!, 'yyyy-MM-dd')}-${format(date.to!, 'yyyy-MM-dd')}` : undefined,
            subCategories: selectedSubCategories.map(sub => sub.value).join(','),
            districts: selectedDistricts.map(district => district.value).join(',')
        }
        const queryStringified = queryString.stringify(query, { skipNull: true, skipEmptyString: true })
        router.push(`?${queryStringified}`)
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
        router.push('?')
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
