import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/';
import ObjectCard from './ObjectCard';

interface Object {
    address: string;
    avatar_url: string;
    category_id: string;
    category_name: string;
    city_name: string;
    closed: boolean; // closed: either true or false
    description: string;
    district_name: string;
  
    in_district: string;
  
    gmail: string;
    happen_time: string;
    img_url: string;
    object_id: string;
    object_name: string;
    post_time: string;
    type: "lost" | "found"; // type: either lost or found
    user_id: string;
    user_name: string;
  }

const mockPost: Object = {
  address: "123 Main St",
  avatar_url: "https://example.com/avatar.jpg",
  category_id: "1",
  category_name: "Electronics",
  city_name: "CityName",
  closed: false,
  description: "This is a description",
  district_name: "DistrictName",
  in_district: "1",
  gmail: "example@gmail.com",
  happen_time: "2023-05-26T00:00:00Z",
  img_url: "https://example.com/image.jpg",
  object_id: "1",
  object_name: "Lost Phone",
  post_time: "2023-05-26T00:00:00Z",
  type: "lost",
  user_id: "user123",
  user_name: "User Name",
};

const handlePostClick = jest.fn();

describe('ObjectCard', () => {
  it('renders the ObjectCard with the given props', () => {
    render(<ObjectCard post={mockPost} handlePostClick={handlePostClick} />);

    expect(screen.getByText('Lost Phone')).toBeInTheDocument();
    expect(screen.getByText('lost')).toBeInTheDocument();
    expect(screen.getByText('CityName')).toBeInTheDocument();
    expect(screen.getByText('DistrictName')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('This is a description')).toBeInTheDocument();
    expect(screen.getByText('Lost at: 5/26/2023')).toBeInTheDocument();
    expect(screen.getByText('At: 123 Main St')).toBeInTheDocument();
  });

  it('calls handlePostClick when the card is clicked', () => {
    render(<ObjectCard post={mockPost} handlePostClick={handlePostClick} />);

    fireEvent.click(screen.getByTestId('object-card'));

    expect(handlePostClick).toHaveBeenCalledTimes(1);
    expect(handlePostClick).toHaveBeenCalledWith('1');
  });

  it('renders "no image" when img_url is not provided', () => {
    const postWithoutImage = { ...mockPost, img_url: '' };
    render(<ObjectCard post={postWithoutImage} handlePostClick={handlePostClick} />);

    expect(screen.getByText('no image')).toBeInTheDocument();
  });

  it('renders the image when img_url is provided', () => {
    render(<ObjectCard post={mockPost} handlePostClick={handlePostClick} />);

    const imgElement = screen.getByAltText('Lost Phone的圖片');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src');
    expect(imgElement.getAttribute('src')).toContain('https%3A%2F%2Fexample.com%2Fimage.jpg');
  });
});
