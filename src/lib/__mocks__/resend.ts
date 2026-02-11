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

export const mockResendClient = {
  emails: {
    send: jest.fn<() => Promise<EmailResponse>>().mockResolvedValue({
      data: {
        id: 'test-email-id',
        from: 'imran@aiuxdesign.guide',
        to: 'test@example.com',
        created_at: new Date().toISOString(),
      },
    }),
  },
};

export const resend = {
  get emails() {
    return mockResendClient.emails;
  },
};

export const getResend = jest.fn(() => mockResendClient);
