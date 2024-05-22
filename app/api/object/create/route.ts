import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createObject } from "@/lib/object/uitls";

/**
 * Create a new object in the database.
 * url - /api/object/create?object_name=xxx&type=xxx&description=xxx&post_by=xxx&post_time=xxx&happen_time=xxx&address=xxx
 * method - POST
 * 
 * @param request - The incoming request object.
 * @returns The response object.
 * @throws If there is an error during the upsert operation.
 */
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let newObject: Partial<LostObject> = {
    object_name: "",
    type: "lost",
    description: "",
    closed: false,
    post_by: "",
    post_time: new Date(),
    address: "",
  };
  const category_name = searchParams.forEach((value, key) => {
    console.log(key, value);
    if (key in newObject) {
      if (key === "post_time" || key === "happen_time") {
        newObject[key as keyof LostObject] = new Date(value as string) as any;
      } else {
        newObject[key as keyof LostObject] = value as any;
      }
    }
  });

  console.log(newObject);

  const supabase = createClient();
  try {
    const data = await createObject(supabase, newObject);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
