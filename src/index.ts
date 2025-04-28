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

🏃‍♂️ Activity & Fitness
------------------------
Activity Score: ${data.activity_score}
Total Steps: ${data.total_steps}
${data.vo2_max ? `VO2 Max: ${data.vo2_max}` : ''}

😴 Sleep Quality
------------------------
Sleep Score: ${data.sleep_score}
Total Sleep: ${data.sleep_duration}h
${data.deep_sleep_duration ? `Deep Sleep: ${data.deep_sleep_duration}h` : ''}
${data.rem_sleep_duration ? `REM Sleep: ${data.rem_sleep_duration}h` : ''}
${data.sleep_latency ? `Time to Fall Asleep: ${Math.round(data.sleep_latency / 60)}min` : ''}

💪 Recovery & Readiness
------------------------
Readiness Score: ${data.readiness_score}
${data.hrv ? `Heart Rate Variability: ${data.hrv}` : ''}
${data.temperature_deviation ? `Temperature Deviation: ${data.temperature_deviation}°C` : ''}
${data.stress_level ? `Stress Balance: ${data.stress_level}` : ''}
${data.recovery_index ? `Recovery Index: ${data.recovery_index}` : ''}
`;
  } catch (error) {
    console.error('Error in buildDigest:', error);
    throw error;
  }
}
