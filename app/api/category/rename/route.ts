import { renameCategory } from "@/lib/category/utils";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

/**
 * rename a category in the database.
 * url - /api/category/rename?original_name=xxx&new_name=xxx
 * method - POST
 * 
 * @param request - The incoming request object.
 * @returns The response object.
 * @throws If there is an error during the upsert operation.
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  const original_name = searchParams.get("original_name");
  const new_name = searchParams.get("new_name");

  if (!original_name || !new_name){
    return NextResponse.json({message: 'original_name and new_name is required'}, {status:400 });
  }

  try{
    const data = await renameCategory(supabase, original_name, new_name);
    return NextResponse.json(data, {status:200 });
  }
  catch(error){
    return NextResponse.json(error, {status:500 });
  }
}
