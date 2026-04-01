/**
 * Shared test setup and mocks for API tests
 */

import { mockPrismaClient } from '@/lib/__mocks__/prisma';
import { mockResendClient } from '@/lib/__mocks__/resend';

// Re-export mocks for tests
export { mockPrismaClient, mockResendClient };

// Reset all mocks before each test
export function resetMocks() {
  Object.values(mockPrismaClient.subscriber).forEach((mock: any) => {
    if (mock && typeof mock.mockReset === 'function') {
      mock.mockReset();
    }
  });
  Object.values(mockPrismaClient.newsletterDraft).forEach((mock: any) => {
    if (mock && typeof mock.mockReset === 'function') {
      mock.mockReset();
    }
  });
  if (mockResendClient.emails.send && typeof mockResendClient.emails.send.mockReset === 'function') {
    mockResendClient.emails.send.mockReset();
  }
}

// Helper function to create mock request
export function createMockRequest(body: any, method: string = 'POST'): Request {
  return {
    json: async () => body,
    method,
    url: 'http://localhost:3000/api/test',
    headers: new Headers(),
  } as Request;
}

// Helper function to create mock NextRequest
export function createMockNextRequest(
  body: any,
  options: { method?: string; url?: string; searchParams?: Record<string, string> } = {}
): any {
  const { method = 'POST', url = 'http://localhost:3000/api/test', searchParams = {} } = options;

  const urlObj = new URL(url);
  Object.entries(searchParams).forEach(([key, value]) => {
    urlObj.searchParams.set(key, value);
  });

  return {
    json: async () => body,
    method,
    url: urlObj.toString(),
    nextUrl: {
      searchParams: urlObj.searchParams,
    },
    headers: new Headers(),
  };
}

// Sample test data
export const mockSubscriber = {
  id: 'test-subscriber-id',
  email: 'test@example.com',
  subscribedAt: new Date('2024-01-01'),
  active: true,
  unsubscribeToken: 'test-unsubscribe-token',
  updatedAt: new Date('2024-01-01'),
};

export const mockInactiveSubscriber = {
  ...mockSubscriber,
  active: false,
};

export const mockEmailResponse = {
  data: {
    id: 'test-email-id',
    from: 'noreply@aiuxdesign.guide',
    to: 'test@example.com',
    created_at: new Date().toISOString(),
  },
};

export const mockPatterns = [
  {
    id: 'test-pattern-1',
    title: 'Test Pattern 1',
    description: 'Description of test pattern 1',
    slug: 'test-pattern-1',
    category: 'Test Category',
  },
  {
    id: 'test-pattern-2',
    title: 'Test Pattern 2',
    description: 'Description of test pattern 2',
    slug: 'test-pattern-2',
    category: 'Test Category',
  },
];
