import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createObject } from "@/lib/object/uitls";
import { getCategory } from "@/lib/category/utils";

/**
 * Create a new object in the database.
 * url - /api/object/create?object_name=xxx&type=xxx&description=xxx&post_by=xxx&post_time=xxx&happen_time=xxx&address=xxx
 * method - POST
 * 
 * @param request - The incoming request object.
 * @returns The response object.
 * @throws If there is an error during the upsert operation.
 */

function isObject(data: any): boolean {
  return (
    typeof data.object_name === "string" &&
    (data.type === "lost" || data.type === "found") &&
    typeof data.description === "string" &&
    typeof data.closed === "boolean" &&
    typeof data.post_by === "string" &&
    typeof data.post_time === "object" &&
    typeof data.in_district === "string"
  );
}
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let newObject: any = {
    closed: false,
    post_time: new Date(),
  };
  const category_name = searchParams.forEach((value, key) => {
    if (key in newObject) {
      if (key === "post_time" || key === "happen_time") {
        newObject[key as keyof LostObject] = new Date(value as string) as any;
      } 
    }
    else {
      newObject[key as keyof LostObject] = value as any;
    }
  });

  if (!isObject(newObject)) {
    console.log(newObject);
    console.log("newObject is not valid");
    return NextResponse.json(
      { message: "invalid object data" },
      { status: 400 }
    );
  }
  
  const supabase = createClient();
  try {
    if (!newObject.category_id){
      const category = await getCategory(supabase, "其他");
      newObject.category_id = category?.category_id;
    }
    else {
      const category = await getCategory(supabase, newObject.category_id);
      newObject.category_id = category?.category_id;
    }
    const data = await createObject(supabase, newObject);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}
