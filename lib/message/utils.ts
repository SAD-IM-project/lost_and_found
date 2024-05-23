import type { SupabaseClient } from "@supabase/supabase-js";

export async function createMessage(supabase: SupabaseClient, message: Message) {
    const { data, error } = await supabase
        .from("message")
        .insert([message])
        .select("*")
        .single();
    if (error) {
        throw error;
    }
    return data;
}

export async function getAllMessage(supabase: SupabaseClient) {
    const { data, error } = await supabase
        .from("message")
        .select("*");
    if (error) {
        throw error;
    }
    return data;
}