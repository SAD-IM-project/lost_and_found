import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createCityDistrict } from '@/lib/city_district/utils';
import { createClient } from '@/utils/supabase/server';
import { fetchUser } from '@/utils/user_management';

export async function GET(request: NextRequest): Promise<NextResponse> {
	// const cookieStore = cookies();
    const { searchParams } = new URL(request.url); 
	const supabase = createClient();
	const supabaseUser = await fetchUser(supabase);
    
    const city = searchParams.get('city');
    const district = searchParams.get('district');

    if (!city || !district) {
        return NextResponse.json({ result: '請提供城市和區域' });
    }
	try {
		const data = await createCityDistrict(supabase, city, district);
        console.log('data', data);
		return NextResponse.json({ result: '新增成功' }, { status: 200 });
	} catch (error) {
		console.log('error', error);
		return NextResponse.json({ result: '新增失敗' }, { status: 500 });
	}
}
