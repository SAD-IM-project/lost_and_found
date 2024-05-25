import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getAllCommentsInObject } from '@/lib/comment/utils';

export async function GET(request: NextRequest) {
    try{
        const supabase = createClient();
        const { searchParams } = new URL(request.url);
        const object_id = searchParams.get("object_id");
        if (!object_id){
            return NextResponse.json({message: 'object_id is required'}, {status:400 });
        }
        const data = await getAllCommentsInObject(supabase, object_id);
        return NextResponse.json(data, {status:200 });
    }
    catch(error){
        return NextResponse.json(error, {status:500 });
    }
}