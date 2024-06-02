// __tests__/ChatPage.test.tsx
import React, {useRef} from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatPage from '@/components/ChatPage'; // Adjust the path as necessary
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn(),
}));

// Mocking Supabase client
jest.mock('@/utils/supabase/client', () => {
  const me = {
    "id": "user_123",
    "email": "ansonwu0604@gmail.com",
    "app_metadata": {
        "provider": "google",
        "providers": [
            "google"
        ]
    },
    "user_metadata": {
        "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJlaGBFoxfnNhS2XfZlKLu5Qlx2j5Kyp2H5Ny65JPJVWyER3NDG=s96-c",
        "email": "ansonwu0604@gmail.com",
        "full_name": "吳亞宸",
        "name": "吳亞宸",
        "picture": "https://lh3.googleusercontent.com/a/ACg8ocJlaGBFoxfnNhS2XfZlKLu5Qlx2j5Kyp2H5Ny65JPJVWyER3NDG=s96-c",
    },
  }

  const auth = {
    getUser: jest.fn().mockResolvedValue({
      data: { user: me },
    }),
  };

  const channel = jest.fn().mockReturnValue({
    on: jest.fn().mockReturnValue({
      subscribe: jest.fn(),
    }),
  });

  const removeChannel = jest.fn();

  return {
    createClient: jest.fn().mockReturnValue({
      auth,
      channel,
      removeChannel,
    }),
  };
});

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch API
global.fetch = jest.fn().mockImplementation((url) => {
  if (url.includes('/api/message/get')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        data: [
          { receiver_id: 'user123', content: 'hello', object_id: 'channel123' },
          { receiver_id: 'receiver123', content: 'hi', object_id: 'channel123' },
        ],
      }),
    });
  }
  return Promise.resolve({
    json: () => Promise.resolve({}),
  });
});

describe('ChatPage', () => {

  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  };

  const mockRef = {
    current: {
      scrollIntoView: jest.fn(),
    },
  };

  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  (useRef as jest.Mock).mockReturnValue(mockRef);

  test('renders loading initially', async () => {
    render(<ChatPage channelid="channel123" receiver_id="receiver123" />);

    expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
  });

  test('renders messages after fetching', async () => {
    
    render(<ChatPage channelid="channel123" receiver_id="receiver123" />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('hi')).toBeInTheDocument();
  });

  test('handles input change and form submission', async () => {
    render(<ChatPage channelid="channel123" receiver_id="receiver123" />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Send message');
    fireEvent.change(input, { target: { textContent: 'new message' } });
    // fix the prblem
    expect(input.textContent).toBe('new message');


    const form = input.closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('new message')).toBeInTheDocument();
    });
  });
});
