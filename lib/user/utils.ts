import type { SupabaseClient } from "@supabase/supabase-js";

export async function getUser(supabase: SupabaseClient, user_id: string) {
    const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("user_id", user_id);
    if (error) {
        throw error;
    }
    return data ? data[0] : null;
}

export async function createUser(supabase: SupabaseClient, user: Partial<User>) {
    if (!user.user_id) {
        throw new Error("User ID is required");
    }
    if (!user.user_name) {
        throw new Error("User name is required");
    }
    if (user.user_name == '') {
        throw new Error("User name cannot be empty");
    }

    const { data, error } = await supabase
        .from("user")
        .upsert([user])
        .select("*");
    if (error) {
        throw error;
    }
    return data;
}

export async function updateUser(supabase: SupabaseClient, user: Partial<User>) {
    if (!user.user_id) {
        throw new Error("User ID is required");
    }

    const { data, error } = await supabase
        .from("users")
        .update(user)
        .eq("user_id", user.user_id)
        .select("*");
    if (error) {
        throw error;
    }
    return data;
}