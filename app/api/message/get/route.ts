import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const data = await fetch("api/message/get", { method: "GET" });
    return NextResponse.json({ data }, { status: 200});
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
