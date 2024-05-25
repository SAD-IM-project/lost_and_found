import { getAllCategories, getCategory } from "@/lib/category/utils";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * Get a category from the database.
 * url - /api/category/get?category_name=xxx
 * method - GET
 * 
 * @param request - The incoming request object.
 * @returns The response object.
 * @throws If there is an error during the select operation.
 */
export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  const category_name = searchParams.get("category_name");

  if (!category_name) {
    return NextResponse.json({ message: 'category_name is required' }, { status: 400 });
  }

  try {
    if (category_name === 'all') {
      const data = await getAllCategories(supabase);
      return NextResponse.json(data, { status: 200 });
    }
    const data = await getCategory(supabase, category_name);
    return NextResponse.json(data, { status: 200 });
  }
  catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
