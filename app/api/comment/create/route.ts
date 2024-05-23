import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createComment } from "@/lib/comment/utils";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  const content = searchParams.get("content");
  const post_by = searchParams.get("post_by");
  const post_time = new Date();
  const object_id = searchParams.get("object_id");

  if (!content || !post_by || !object_id) {
    return NextResponse.json(
      { message: "content, post_by, and object_id are required" },
      { status: 400 }
    );
  }
  try {
    const param = { content, post_by, post_time, object_id };
    const data = await createComment(supabase, param);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
