import { Resend } from 'resend';

let resendInstance: Resend | null = null;

export function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not defined in environment variables');
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

// For backward compatibility, export a getter
export const resend = {
  get emails() {
    return getResend().emails;
  },
};
