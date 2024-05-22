"use client"

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import queryString from "query-string";

const SearchForm = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 获取现有的查询参数
        const currentQuery = queryString.parse(searchParams.toString());

        // 合并现有的查询参数和新的搜索参数
        const query = {
            ...currentQuery,
            search: searchQuery,
        };

        // 构建新的查询字符串
        const queryStringified = queryString.stringify(query);
        router.push(`?${queryStringified}`);
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center flex-1 sm:flex-initial justify-between">
            <div className="relative flex-grow mr-4">
                <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-8 sm:w-[50px] md:w-[200px] lg:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <button type="submit" className="hidden"></button>
        </form>
    );
};

export default SearchForm;
