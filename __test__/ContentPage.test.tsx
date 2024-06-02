import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/';

import Content from "@/app/(main)/content/[id]/page";
import { createClient } from "@/utils/supabase/client";
import fetchMock from 'jest-fetch-mock';

import { waitFor } from "@testing-library/react";

jest.mock("@/utils/supabase/client");
// jest.mock("next/router", () => ({
//   useRouter: jest.fn(),
// }));

jest.mock("@/utils/supabase/client");

// 使用 jest.spyOn 模擬 useRouter
jest.spyOn(require('next/navigation'), 'useRouter').mockImplementation(() => ({
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  push: jest.fn(), // 如果需要模擬 push 方法
}));

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: jest.fn(),
}));

fetchMock.enableMocks();

describe("Content Component", () => {
  let mockRouter;

  beforeEach(() => {
    // mockRouter = { push: jest.fn() };
    // (useRouter as jest.Mock).mockReturnValue(mockRouter);

    fetchMock.resetMocks();
  });

  interface ObjectData {
    address: string;
    avatar_url: string;
    category_id: string;
    category_name: string;
    city_name: string;
    closed: boolean;
    description: string;
    district_name: string;
    in_district: string;
    gmail: string;
    happen_time: string;
    img_url: string;
    object_id: string;
    object_name: string;
    post_time: string;
    type: "lost" | "found";
    user_id: string;
    user_name: string;
  }

  const mockObjectData: ObjectData = {
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
    object_id: "test-object-id",
    object_name: "Lost Phone",
    post_time: "2023-05-26T00:00:00",
    type: "lost",
    user_id: "user123",
    user_name: "User Name",
  };

  const mockComments = [
    {
      comment_id: "1",
      content: "test comment 1",
      post_by: "test user 1",
      post_time: "2023-01-01T00:00:00Z",
      user_name: "commenter 1",
      object_id: "test-object-id",
    },
    {
      comment_id: "2",
      content: "test comment 2",
      post_by: "test user 2",
      post_time: "2023-01-01T00:00:00Z",
      user_name: "commenter 2",
      object_id: "test-object-id",
    },
  ];

  const mockCommentResponse = {
    belongs_to_object: "0ad56c04-0b16-4801-ba32-761b19adea88",
    comment_id: "19f8a12a-5111-407f-ac66-a5af6e65ec92",
    content: "aaaaaa",
    post_by: "480b341a-6586-43f7-a48f-65fff1e30d1e",
    post_time: "2024-05-26T15:59:56.985+00:00",
  };
  

  it("renders loading initially", () => {
    render(<Content params={{ id: "test-object-id" }} />);
    // expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.getByTestId('test-object-id')).toBeInTheDocument();
  });

  it("renders object data and comments after fetch", async () => {
    fetchMock.mockResponses(
      [JSON.stringify(mockObjectData), { status: 200 }],
      [JSON.stringify(mockComments), { status: 200 }]
    );

    const { getByText } = render(
      <Content params={{ id: "test-object-id" }} />
    );

    await waitFor(() => {
      expect(getByText("Lost Phone")).toBeInTheDocument();
      expect(getByText("基隆縣 信義區")).toBeInTheDocument();
      expect(getByText("手機")).toBeInTheDocument();
      expect(getByText("User Name")).toBeInTheDocument();
      expect(getByText("This is a description")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getByText("test comment 1")).toBeInTheDocument();
      expect(getByText("commenter 1")).toBeInTheDocument();
      expect(getByText("test comment 2")).toBeInTheDocument();
      expect(getByText("commenter 2")).toBeInTheDocument();
    });
  });

  it("handles comment submission", async () => {
    fetchMock.mockResponses(
      [JSON.stringify(mockObjectData), { status: 200 }],
      [JSON.stringify(mockComments), { status: 200 }],
      [JSON.stringify(mockCommentResponse), { status: 200 }]
    );

    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
  
    const mockUser = { id: "user123" };
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabase);

    const { getByPlaceholderText, getByText } = render(
      <Content params={{ id: "test-object-id" }} />
    );

    await waitFor(() => {
      expect(screen.getByText("手機")).toBeInTheDocument();
    });

    const textarea = getByPlaceholderText("Type your message here.");
    const button = getByText("Comment");

    fireEvent.change(textarea, { target: { value: "New-test-comment" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        `/api/comment/create?content=New-test-comment&post_by=user123&object_id=test-object-id`,
        { method: "POST" }
      );
    });

    // await waitFor(() => {
    //   expect(screen.getByText("Commented successfully!")).toBeInTheDocument();
    // });
    // expect(alertMock).toHaveBeenCalledWith('Commented successfully!');
    // alertMock.mockRestore();
  });

  it("conditionally renders chat button for authenticated user", async () => {
    fetchMock.mockResponses(
      [JSON.stringify(mockObjectData), { status: 200 }],
      [JSON.stringify(mockComments), { status: 200 }]
    );

    const mockUser = { id: "user123" };
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabase);

    const { getByText } = render(
      <Content params={{ id: "test-object-id" }} />
    );

    await waitFor(() => {
      expect(screen.getByText("手機")).toBeInTheDocument();
    });

    // const chatButton = getByText("Go to chat");
    const chatButton = screen.getByTestId("chat-button");
    fireEvent.click(chatButton);

    // expect(mockRouter.push).toHaveBeenCalledWith(
    //   `/chatroom/test-object-id/user123`
    // );
  });
});
