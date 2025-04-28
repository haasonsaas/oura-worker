interface OuraSummary {
  readiness_score: string | number;
  sleep_score: string | number;
  sleep_duration: string | number;
  activity_score: string | number;
  total_steps: string | number;
  vo2_max?: number;
  hrv?: number;
  temperature_deviation?: number;
  sleep_latency?: number;
  deep_sleep_duration?: number;
  rem_sleep_duration?: number;
  stress_level?: number;
  recovery_index?: number;
}

export async function fetchOuraSummary(env: { OURA_API_KEY: string }): Promise<OuraSummary> {
  const headers = {
    Authorization: `Bearer ${env.OURA_API_KEY}`,
  };

  const [readinessData, sleepData, activityData, vo2MaxData] = await Promise.all([
    fetch('https://api.ouraring.com/v2/usercollection/daily_readiness', { headers }).then(r => r.json()),
    fetch('https://api.ouraring.com/v2/usercollection/daily_sleep', { headers }).then(r => r.json()),
    fetch('https://api.ouraring.com/v2/usercollection/daily_activity', { headers }).then(r => r.json()),
    fetch('https://api.ouraring.com/v2/usercollection/daily_cardio_recovery', { headers }).then(r => r.json()).catch(() => null)
  ]);

  console.log('Raw sleep data:', JSON.stringify(sleepData, null, 2));
  const readiness = readinessData.data?.[0];
  const sleep = sleepData.data?.[0];
  console.log('Sleep object:', JSON.stringify(sleep, null, 2));
  console.log('Sleep duration:', sleep?.contributors?.total_sleep);
  const activity = activityData.data?.[0];
  const vo2Max = vo2MaxData?.data?.[0];

  return {
    readiness_score: readiness?.score ?? 'N/A',
    sleep_score: sleep?.score ?? 'N/A',
    sleep_duration: sleep?.contributors?.total_sleep ? 
      (sleep.contributors.total_sleep / 10).toFixed(1) : 
      (() => {
        console.error('Invalid sleep duration:', sleep?.contributors?.total_sleep);
        return 'N/A';
      })(),
    activity_score: activity?.score ?? 'N/A',
    total_steps: activity?.steps ?? 'N/A',
    vo2_max: vo2Max?.vo2_max ?? undefined,
    hrv: sleep?.average_hrv ?? undefined,
    temperature_deviation: sleep?.temperature_deviation ?? undefined,
    sleep_latency: sleep?.latency ?? undefined,
    deep_sleep_duration: sleep?.deep_sleep_duration ? Number((sleep.deep_sleep_duration / 3600).toFixed(1)) : undefined,
    rem_sleep_duration: sleep?.rem_sleep_duration ? Number((sleep.rem_sleep_duration / 3600).toFixed(1)) : undefined,
    stress_level: readiness?.stress_balance ?? undefined,
    recovery_index: readiness?.recovery_index ?? undefined,
  };
}
