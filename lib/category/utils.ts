import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Create a new category in the database if it does not exist.
 *
 * @param supabase - The Supabase client.
 * @param category_name - The name of the category.
 * @returns The data from the upsert operation.
 * @throws If there is an error during the upsert operation.
 */
export async function createCategory(
  supabase: SupabaseClient,
  category_name: string,
  sub_of?: string
) {
  const category = await getCategory(supabase, category_name);
  if (category) {
    console.log("Category already exists");
    return category;
  }
  let parent_category = null;
  if (sub_of){
    parent_category = await getCategory(supabase, sub_of);
  }
  const { data, error } = await supabase
    .from("category")
    .upsert([{ category_name, sub_of: parent_category?.category_id}])
    .select("*");
  if (error) {
    throw error;
  }
  return data;
}

/**
 * Check if a category exists in the database.
 * @param supabase - The Supabase client.
 * @param category_name - The name of the category.
 * @returns The category if it exists, otherwise null.
 * @throws If there is an error during the select operation.
 */
export async function getCategory(
  supabase: SupabaseClient,
  category_name: string
): Promise<Category | null> {
  const { data, error } = await supabase
    .from("category")
    .select("*")
    .eq("category_name", category_name);
  if (error) {
    throw error;
  }
  return data ? data[0] : null;
}

/**
 * Rename a category in the database.
 * @param supabase - The Supabase client.
 * @param original_name - The original name of the category.
 * @param new_name - The new name of the category.
 * @returns The data from the update operation.
 * @throws If there is an error during the update operation.
 */
export async function renameCategory(
  supabase: SupabaseClient,
  original_name: string,
  new_name: string
) {
  const { data, error } = await supabase
    .from("category")
    .update({ category_name: new_name })
    .eq("category_name", original_name)
    .select("*");
  if (error) {
    throw error;
  }
  return data;
}

/**
 * Delete a category from the database.
 * @param supabase - The Supabase client.
 * @param category_name - The name of the category.
 * @returns The data from the delete operation.
 */
export async function deleteCategory(
  supabase: SupabaseClient,
  category_name: string
) {
  const { data, error } = await supabase
    .from("category")
    .delete()
    .eq("category_name", category_name)
    .select("*");
  if (error) {
    throw error;
  }
  return data;
}

export async function getAllCategories(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("category")
    .select("*, sub_of: category(*)")
    // .contains('sub_of', []);
  if (error) {
    throw error;
  }
  return data;
}