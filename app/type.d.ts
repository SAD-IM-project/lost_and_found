type City = {
  city_id: string;
  city_name: string;
};

type District = {
  district_id: string;
  district_name: string;
  in_city: string;
};

type Category = {
  category_id: string;
  category_name: string;
  sub_of?: string;
};