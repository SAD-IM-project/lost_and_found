import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchUser(supabase: SupabaseClient) {
    try{
        const user = await supabase.auth.getUser();
        return user;
    } catch (error) {
        console.log('error', error);
    }
}
