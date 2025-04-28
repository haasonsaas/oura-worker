import { fetchOuraSummary } from './oura_api';
import { sendEmail } from './send_email';

export interface Env {
  OURA_API_KEY: string;
  FROM_EMAIL: string;
  TO_EMAIL: string;
  TIMEZONE: string;
}

export default {
  async scheduled(_: unknown, env: Env, ctx: { waitUntil: (promise: Promise<unknown>) => void }) {
    ctx.waitUntil(runDigest(env));
  },

  async fetch(_: Request, env: Env) {
    const content = await buildDigest(env);
    return new Response(`<pre>${content}</pre>`, { headers: { 'content-type': 'text/html' } });
  },
};

async function runDigest(env: Env) {
  const digest = await buildDigest(env);
  await sendEmail(env, '🛌 Your Oura Daily Summary', digest);
}

async function buildDigest(env: Env) {
  const data = await fetchOuraSummary(env);

  return `Good morning! Here's your Oura report:

🛏️ Sleep Score: ${data.sleep_score}
🔥 Readiness Score: ${data.readiness_score}
🏃 Activity Score: ${data.activity_score}

👉 Sleep Duration: ${data.sleep_duration}h
👉 Total Steps: ${data.total_steps}
`;
}
