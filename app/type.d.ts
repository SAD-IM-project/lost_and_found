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
  post_time: Date;
  happen_time: Date;
  address: string;
  img_url?: string;
}

type User = {
  user_id: string;
  user_name: string;
  gmail: string;
  avatar_url?: string;
}

type Message = {
  message_id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  time: Date;
  object_id: string;
}

type ObjectComment = {
  comment_id: string;
  content: string;
  post_by: string;
  post_time: Date;
  object_id: string;
}