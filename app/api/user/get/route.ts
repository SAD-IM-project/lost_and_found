import { getUser } from "@/lib/user/utils";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    const supabase = createClient();
    if (!user_id) {
      return NextResponse.json(
        { message: "invalid object data" },
        { status: 400 }
      );
    }
    const data = await getUser(supabase, user_id);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 500 })
  }
}
