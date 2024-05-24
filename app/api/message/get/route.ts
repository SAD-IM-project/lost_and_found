import { NextResponse, NextRequest } from "next/server";
import { getAllMessage } from "@/lib/message/utils";
import { createClient } from "@/utils/supabase/server";
export async function GET(request: NextRequest) {
  const supabase = createClient();
  try {
    
    const data = await getAllMessage(supabase );
    return NextResponse.json({ data }, { status: 200});
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
