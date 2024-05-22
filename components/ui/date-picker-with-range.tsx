"use client"
import * as React from "react"
import { format, set } from "date-fns"
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
import Select from 'react-select';

const category = [
    {
        label: '證件',
        options: [
            { value: '學生證', label: '學生證' },
            { value: '身分證', label: '身分證' },
        ],
    },
    {
        label: '電子產品',
        options: [
            { value: 'iPhone', label: 'iPhone' },
            { value: 'airpods pro', label: 'airpods pro' },
        ],
    },
];

const location = [
    {
        label: '台北市',
        options: [
            { value: '中正區', label: '中正區' },
            { value: '大安區', label: '大安區' },
        ],
    },
    {
        label: '新北市',
        options: [
            { value: '泰山區', label: '泰山區' },
            { value: '新莊區', label: '新莊區' },
        ],
    },
];

export function DatePickerWithRange({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const [date, setDate] = React.useState<DateRange | undefined>(undefined)
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const [selectedCategories, setSelectedCategories] = React.useState(null);
    const [selectedLocations, setSelectedLocations] = React.useState(null);

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
        setSelectedCategories(null)
        setSelectedLocations(null)
    }

    const handleSetCategories = (selectedCategories) => {
        setSelectedCategories(selectedCategories)
    }

    const handleSetLocations = (selectedLocations) => {
        setSelectedLocations(selectedLocations)
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
            <span>Category:</span>
            <Select
                options={category}
                isMulti
                className="w-[300px]"
                placeholder="Select category..."
                value={selectedCategories}
                onChange={handleSetCategories}
            />
            <span>Location:</span>
            <Select
                options={location}
                isMulti
                className="w-[300px]"
                placeholder="Select location..."
                value={selectedLocations}
                onChange={handleSetLocations}
            />
            <div className="flex justify-end gap-2 p-5">
                <Button onClick={handleReset} variant="outline">Reset</Button>
                <Button onClick={handleApply}>Apply</Button>
            </div>
        </div>
    )
}
