import type { SupabaseClient } from "@supabase/supabase-js";

export async function createMessage(supabase: SupabaseClient, message: Message) {
    const { data, error } = await supabase
        .from("message")
        .insert([message])
        .single();
    if (error) {
        throw error;
    }
    return data;
}