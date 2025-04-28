import { expect, test, mock } from "bun:test";
import { sendEmail } from './send_email';

const mockEnv = {
  RESEND_API_KEY: 'test-api-key',
  FROM_EMAIL: 'test@example.com',
  TO_EMAIL: 'recipient@example.com'
};

test('should send email with correct from and to addresses', async () => {
  const subject = 'Test Subject';
  const text = 'Test Message';

  const mockFetch = mock(async () => ({
    ok: true,
    status: 200,
    text: () => Promise.resolve('{"id": "123"}')
  }));
  global.fetch = mockFetch;

  await sendEmail(mockEnv, subject, text);

  expect(mockFetch).toHaveBeenCalledWith('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer test-api-key',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      html: '<pre>Test Message</pre>'
    })
  });
});

test('should throw error when API call fails', async () => {
  const mockFetch = mock(async () => ({
    ok: false,
    status: 400,
    text: () => Promise.resolve('{"error": "Bad Request"}')
  }));
  global.fetch = mockFetch;

  await expect(sendEmail(mockEnv, 'Test', 'Message'))
    .rejects
    .toThrow('Mail send failed: 400 {"error": "Bad Request"}');
}); 