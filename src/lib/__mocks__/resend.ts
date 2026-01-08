import { jest } from '@jest/globals';

// Type for email send response
interface EmailResponse {
  data: {
    id: string;
    from: string;
    to: string;
    created_at: string;
  } | null;
  error?: Error;
}

// Type for batch send response
interface BatchEmailResponse {
  data: Array<{ id: string }> | null;
  error?: Error;
}

export const mockResendClient = {
  emails: {
    send: jest.fn<() => Promise<EmailResponse>>().mockResolvedValue({
      data: {
        id: 'test-email-id',
        from: 'noreply@aiuxdesign.guide',
        to: 'test@example.com',
        created_at: new Date().toISOString(),
      },
    }),
  },
  batch: {
    send: jest.fn<(emails: unknown[]) => Promise<BatchEmailResponse>>().mockImplementation(
      (emails: unknown[]) => Promise.resolve({
        data: (emails as unknown[]).map((_, i) => ({ id: `batch-email-${i}` })),
      })
    ),
  },
};

export const resend = {
  get emails() {
    return mockResendClient.emails;
  },
  get batch() {
    return mockResendClient.batch;
  },
};

export const getResend = jest.fn(() => mockResendClient);
