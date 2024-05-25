import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createMessage } from "@/lib/message/utils";

function isMessage(data: any): boolean {
  return (
    typeof data.content === "string" &&
    typeof data.sender_id === "string" &&
    typeof data.receiver_id === "string" &&
    data.time instanceof Date &&
    typeof data.object_id === "string"
  );
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let newMessage: any = {};

  const category_name = searchParams.forEach((value, key) => {
    newMessage[key as keyof Message] = value as any;
  });

  newMessage.time = new Date();

  if (!isMessage(newMessage)) {
    return NextResponse.json(
      { message: "invalid message data" },
      { status: 400 }
    );
  }

  const supabase = createClient();
  try {
    const data = await createMessage(supabase, newMessage);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
