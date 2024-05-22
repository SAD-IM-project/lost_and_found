import type { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function createObject(
    supabase: SupabaseClient,
    
)