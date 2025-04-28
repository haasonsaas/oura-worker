import { fetchOuraSummary } from './oura_api';
import { sendEmail } from './send_email';

export interface Env {
  OURA_API_KEY: string;
  RESEND_API_KEY: string;
  FROM_EMAIL: string;
  TO_EMAIL: string;
  TIMEZONE: string;
}

export default {
  async scheduled(_: unknown, env: Env, ctx: { waitUntil: (promise: Promise<unknown>) => void }) {
    try {
      console.log('Starting scheduled task...');
      ctx.waitUntil(runDigest(env));
    } catch (error) {
      console.error('Error in scheduled task:', error);
      throw error;
    }
  },

  async fetch(_: Request, env: Env) {
    try {
      console.log('Starting manual trigger...');
      const content = await buildDigest(env);
      await sendEmail(env, '🛌 Your Oura Daily Summary', content);
      console.log('Email sent successfully');
      return new Response(`<pre>${content}</pre>`, { headers: { 'content-type': 'text/html' } });
    } catch (error) {
      console.error('Error in fetch handler:', error);
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
};

async function runDigest(env: Env) {
  try {
    console.log('Building digest...');
    const digest = await buildDigest(env);
    console.log('Sending email...');
    await sendEmail(env, '🛌 Your Oura Daily Summary', digest);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error in runDigest:', error);
    throw error;
  }
}

async function buildDigest(env: Env) {
  try {
    console.log('Fetching Oura summary...');
    const data = await fetchOuraSummary(env);
    console.log('Oura data received:', data);

    return `Good morning! Here's your Oura report:

🛏️ Sleep Score: ${data.sleep_score}
🔥 Readiness Score: ${data.readiness_score}
🏃 Activity Score: ${data.activity_score}

👉 Sleep Duration: ${data.sleep_duration}h
👉 Total Steps: ${data.total_steps}
`;
  } catch (error) {
    console.error('Error in buildDigest:', error);
    throw error;
  }
}
