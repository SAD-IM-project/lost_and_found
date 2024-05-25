import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getObject, getObjects } from "@/lib/object/uitls";

export async function GET(request: NextRequest) {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    const object_id = searchParams.get("object_id");
    const search = searchParams.get("search");
    
    if (!object_id) {
        return NextResponse.json({ message: "object_id is required" }, { status: 400 });
    }
    
    try {
        if (search){
            const data = await getObjects(supabase, search);
            return NextResponse.json(data, { status: 200 });
        }
        if (object_id === "all") {
            const data = await getObjects(supabase);
            return NextResponse.json(data, { status: 200 });
        }
        
        const data = await getObject(supabase, object_id);
        
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}