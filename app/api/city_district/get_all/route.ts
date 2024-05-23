import { getAllCity, getAllCityDistrictJoin } from "@/lib/city_district/utils";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient();
  //   const cities = await getAllCity(supabase);
  const city_district = await getAllCityDistrictJoin(supabase);
  return NextResponse.json({ city_district });
}
