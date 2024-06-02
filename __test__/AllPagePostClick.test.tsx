import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/';
import ObjectCard from '@/components/ObjectCard';

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
  address: "在我家",
  avatar_url: "https://example.com/avatar.jpg",
  category_id: "1",
  category_name: "手機",
  city_name: "基隆縣",
  closed: false,
  description: "This is a description",
  district_name: "信義區",
  in_district: "1",
  gmail: "example@gmail.com",
  happen_time: "2023-05-26T00:00:00",
  img_url: "https://example.com/image.jpg",
  object_id: "1",
  object_name: "Lost Phone",
  post_time: "2023-05-26T00:00:00",
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
    expect(screen.getByText('基隆縣')).toBeInTheDocument();
    expect(screen.getByText('信義區')).toBeInTheDocument();
    expect(screen.getByText('手機')).toBeInTheDocument();
    expect(screen.getByText('This is a description')).toBeInTheDocument();
    expect(screen.getByText('Lost at: 2023/5/26')).toBeInTheDocument();
    expect(screen.getByText('At: 在我家')).toBeInTheDocument();
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
