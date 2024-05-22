type City = {
  city_id: string;
  city_name: string;
};

type District = {
  district_id: string;
  district_name: string;
  in_city: string;
};

type DistrictWithCity = {
  district_id: string;
  district_name: string;
  city_name: string;
};

type Category = {
  category_id: string;
  category_name: string;
  sub_of?: string;
};

type LostObject = {
  object_id: string;
  object_name: string;
  type: 'lost' | 'found';
  description: string;
  closed: boolean;
  post_by: string;
  category_id: string;
  in_district: string;
  post_date: Date;
}

type User = {
  user_id: string;
  user_name: string;
  gmail: string;
  avatar_url?: string;
}