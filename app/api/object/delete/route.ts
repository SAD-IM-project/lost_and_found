import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { deleteObject } from "@/lib/object/uitls";

/**
 * Delete an object from the database.
 * url - /api/object/delete?object_id=xxx
 * method - DELETE
 */
export async function DELETE(request: NextRequest) {
  const supabase = createClient();

  const { searchParams } = new URL(request.url);
  const object_id = searchParams.get("object_id");

  if (!object_id) {
    return NextResponse.json(
      { message: "object_id is required" },
      { status: 400 }
    );
  }

  try {
    const data = await deleteObject(supabase, object_id);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
