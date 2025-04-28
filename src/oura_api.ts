export async function fetchOuraSummary(env: { OURA_API_KEY: string }) {
  const headers = {
    Authorization: `Bearer ${env.OURA_API_KEY}`,
  };

  const readinessResp = await fetch('https://api.ouraring.com/v2/usercollection/daily_readiness', { headers });
  const readinessData = await readinessResp.json();
  const readiness = readinessData.data?.[0];

  const sleepResp = await fetch('https://api.ouraring.com/v2/usercollection/daily_sleep', { headers });
  const sleepData = await sleepResp.json();
  const sleep = sleepData.data?.[0];

  const activityResp = await fetch('https://api.ouraring.com/v2/usercollection/daily_activity', { headers });
  const activityData = await activityResp.json();
  const activity = activityData.data?.[0];

  return {
    readiness_score: readiness?.score ?? 'N/A',
    sleep_score: sleep?.score ?? 'N/A',
    sleep_duration: sleep ? (sleep.total_sleep_duration / 3600).toFixed(1) : 'N/A',
    activity_score: activity?.score ?? 'N/A',
    total_steps: activity?.steps ?? 'N/A',
  };
}
