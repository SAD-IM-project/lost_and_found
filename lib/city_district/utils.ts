import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

/**
 * Create a new city and district in the database if it does not exist.
 *
 * @param supabase - The Supabase client.
 * @param city - The name of the city.
 * @param district - The name of the district.
 * @returns The data from the upsert operation.
 * @throws If there is an error during the upsert operation.
 */
export async function createCityDistrict(
  supabase: SupabaseClient,
  city: string,
  district: string
) {
  let city_db = await getCity(supabase, city);
  if (!city_db) {
    const { data, error } = await supabase
      .from("city")
      .upsert([{ city_name: city }])
      .select("*");
    if (error) {
      throw error;
    }
    city_db = data[0];
  }

  let city_uuid = city_db?.city_id;
  if (!city_uuid) {
    throw new Error("City ID not found");
  }

  let district_db = await getDistrict(supabase, district, city_uuid);
  if (district_db) {
    return district_db;
  }
  const { data: data2, error: error2 } = await supabase
    .from("district")
    .upsert([{ district_name: district, in_city: city_uuid }])
    .select("*");
  if (error2) {
    throw error2;
  }
  return data2;
}

/**
 * Check if a city exists in the database.
 * @param supabase
 * @param city
 * @returns
 */
export async function getCity(
  supabase: SupabaseClient,
  city: string
): Promise<City | null> {
  const { data, error } = await supabase
    .from("city")
    .select("*")
    .eq("city_name", city);
  if (error) {
    throw error;
  }
  if (data.length === 0) {
    return null;
  }
  return data[0];
}


/**
 * Check if a district exists in the database.
 * @param supabase
 * @param district
 * @returns
 */
export async function getDistrict(
  supabase: SupabaseClient,
  district: string,
  city_id: string
): Promise<District | null> {
  const { data, error } = await supabase
    .from("district")
    .select("*")
    .eq("district_name", district)
    .eq("in_city", city_id);
  if (error) {
    throw error;
  }
  if (data.length === 0) {
    return null;
  }
  return data[0];
}