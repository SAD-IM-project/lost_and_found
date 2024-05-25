import { deleteCategory } from "@/lib/category/utils";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * Delete a category from the database.
 * url - /api/category/delete?category_name=xxx
 * method - DELETE
 * 
 * @param request - The incoming request object.
 * @returns The response object.
 * @throws If there is an error during the delete operation.
 */
export async function DELETE(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  const category_name = searchParams.get("category_name");

  if (!category_name){
    return NextResponse.json({message: 'category_name is required'}, {status:400 });
  }

  try{
    const data = await deleteCategory(supabase, category_name);
    return NextResponse.json(data, {status:200 });
  }
  catch(error){
    return NextResponse.json(error, {status:500 });
  }
}
