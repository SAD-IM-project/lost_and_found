import { createCategory } from "@/lib/category/utils";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { Result } from "postcss";

export async function POST(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  console.log(searchParams);

  const category_name = searchParams.get("category_name");
  const sub_of = searchParams.get("sub_of");

  if (!category_name){
    return NextResponse.json({message: 'category_name is required'}, {status:400 });
  }

  try{
    const data = await createCategory(supabase, category_name, sub_of? sub_of: undefined);
    return NextResponse.json(data, {status:200 });
  }
  catch(error){
    return NextResponse.json(error, {status:500 });
  }
}
