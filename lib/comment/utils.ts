import type { SupabaseClient } from "@supabase/supabase-js";

export async function createComment(supabase: SupabaseClient, comment: Partial<ObjectComment>) {
    const { data, error } = await supabase
        .from("comment")
        .insert([comment])
        .select("*")
        .single();
    if (error) {
        throw error;
    }
    return data;
}

export async function getAllCommentsInObject(supabase: SupabaseClient, object_id: string) {
    const { data, error } = await supabase
        .rpc("get_comments", {o_id: object_id})
        .order("post_time", { ascending: false });
    if (error) {
        throw error;
    }
    return data;
}