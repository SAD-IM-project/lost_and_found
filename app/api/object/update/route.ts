import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { updateObject } from "@/lib/object/uitls";

/**
 * Edit an object in the database.
 * url - /api/object/edit?object_id=xxx&object_name=xxx&type=xxx&description=xxx&post_by=xxx&post_time=xxx&happen_time=xxx&address=xxx
 * method - POST
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
    if (key in newObject) {
      if (key === "post_time"){}
      else if (key === "happen_time") {
        newObject[key as keyof LostObject] = new Date(value as string) as any;
      } else {
        newObject[key as keyof LostObject] = value as any;
      }
    }
  });

  if (!newObject.object_id) {
    return NextResponse.json(
      { message: "object_id is required" },
      { status: 400 }
    );
  }

  const supabase = createClient();
  try {
    const data = await updateObject(supabase, newObject);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
