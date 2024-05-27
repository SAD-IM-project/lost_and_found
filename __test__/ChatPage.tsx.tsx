// __tests__/ChatPage.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatPage from '@/components/ChatPage'; // Adjust the path as necessary
import { createClient } from '@/utils/supabase/client';

// Mocking Supabase client
jest.mock('@/utils/supabase/client', () => {
  const auth = {
    getUser: jest.fn().mockResolvedValue({
      data: { user: { id: 'user123' } },
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
  test('renders loading initially', async () => {
    render(<ChatPage channelid="channel123" receiver_id="receiver123" />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
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
