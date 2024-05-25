import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Create a new object in the database.
 *
 * @param supabase - The Supabase client.
 * @param object - The object to create. (object_name and type are required)
 * @returns The data from the insert operation.
 * @throws If there is an error during the insert operation.
 */
export async function createObject(
  supabase: SupabaseClient,
  object: Partial<LostObject>
) {
  if (!object.object_name) {
    throw new Error("Object name is required");
  }
  if (!object.type) {
    throw new Error("Object type is required");
  }
  if (object.object_name == "") {
    throw new Error("Object name cannot be empty");
  }

  const { data, error } = await supabase
    .from("object")
    .upsert([object])
    .select("*")
    .single();
  if (error) {
    throw error;
  }
  return data;
}

export async function updateObject(
  supabase: SupabaseClient,
  object: Partial<LostObject>
) {
  if (!object.object_id) {
    throw new Error("Object ID is required");
  }

  const { data, error } = await supabase
    .from("object")
    .update(object)
    .eq("object_id", object.object_id)
    .select("*");
  if (error) {
    throw error;
  }
  return data;
}

export async function deleteObject(
  supabase: SupabaseClient,
  object_id: string
) {
  if (!object_id) {
    throw new Error("Object ID is required");
  }

  const { data, error } = await supabase
    .from("object")
    .delete()
    .eq("object_id", object_id);
  if (error) {
    throw error;
  }
  return data;
}

export async function getObject(supabase: SupabaseClient, object_id: string) {
  if (!object_id) {
    throw new Error("Object ID is required");
  }

  const { data, error } = await supabase.rpc("object", { id: object_id }).single();
  if (error) {
    throw error;
  }
  return data ? data : null;
}

export async function getObjects(supabase: SupabaseClient, search?: string) {
  if (search) {
    let search_arr = search?.split(" ");
    const { data, error } = await supabase.rpc("filter_objects", {
      filter_arr: search_arr,
    });
    if (error) {
      throw error;
    }
    return data;
  } else {
    const { data, error } = await supabase.rpc("all_objects");
    if (error) {
      throw error;
    }
    return data;
  }
}
