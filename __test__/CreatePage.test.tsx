import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/';

import Content from "@/app/(main)/create/page";
import { createClient } from "@/utils/supabase/client";
import fetchMock from 'jest-fetch-mock';
import { useRouter } from 'next/navigation';

import { waitFor } from "@testing-library/react";

import '@testing-library/jest-dom';

jest.mock("@/utils/supabase/client");
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(), // 使用 jest.fn() 來模擬 useRouter
}));

const mockCities = [
  { value: 'Taipei', label: 'Taipei' },
  { value: 'Kaohsiung', label: 'Kaohsiung' },
];

const mockDistricts = {
  Taipei: [
    { value: 'Zhongzheng', label: 'Zhongzheng' },
    { value: 'Daan', label: 'Daan' },
  ],
  Kaohsiung: [
    { value: 'Gushan', label: 'Gushan' },
    { value: 'Lingya', label: 'Lingya' },
  ],
};

const mockCategories = {
  Electronics: [
    { value: 'Phone', label: 'Phone' },
    { value: 'Laptop', label: 'Laptop' },
  ],
  Accessories: [
    { value: 'Wallet', label: 'Wallet' },
    { value: 'Bag', label: 'Bag' },
  ],
};

describe('Create', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  };

  (useRouter as jest.Mock).mockReturnValue(mockRouter);

  it('renders without crashing', () => {
    render(<Content params={{id: 'mockId'}}/>);
    expect(screen.getByText('上傳遺失物')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'mockUserId' } } }),
      },
      storage: {
        from: jest.fn().mockReturnThis(),
        upload: jest.fn().mockResolvedValue({ data: { publicUrl: 'mockImageUrl' } }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'mockImageUrl' } }),
      },
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabase);

    fetchMock.mockResponseOnce(JSON.stringify({ object_id: 'mockObjectId' }));

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    render(<Content params={{id: 'mockId'}}/>);

    fireEvent.change(screen.getByPlaceholderText('e.g. 雨傘'), { target: { value: 'Lost Umbrella' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. 台大總圖'), { target: { value: 'NTU Main Library' } });
    fireEvent.change(screen.getByPlaceholderText('Type your message here.'), { target: { value: 'This is a description' } });

    const citySelect = screen.getByText('Select city...');
    if (!citySelect) {
      throw new Error('City select not found');
    }

    const districtSelect = await screen.getByText('Select district...');
    if (!districtSelect) {
      throw new Error('District select not found');
    }

    const mainCategorySelect = screen.getByText('Select main category...');
    if (!mainCategorySelect) {
      throw new Error('Main category select not found');
    }

    const subCategorySelect = screen.getByText('Select sub category...');
    if (!subCategorySelect) {
      throw new Error('Sub category select not found');
    }

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
  });
});
