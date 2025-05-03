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

  // Get today's date and yesterday's date in YYYY-MM-DD format
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const startDate = yesterday.toISOString().split('T')[0];
  const endDate = today.toISOString().split('T')[0];

  try {
    console.log('Fetching data from Oura API...');
    console.log('Date range:', startDate, 'to', endDate);
    
    const [readinessData, sleepData, activityData, vo2MaxData] = await Promise.all([
      fetch(`https://api.ouraring.com/v2/usercollection/daily_readiness?start_date=${startDate}&end_date=${endDate}`, { headers })
        .then(async r => {
          if (!r.ok) {
            console.error('Readiness API error:', r.status, await r.text());
            return { data: [] };
          }
          return r.json();
        })
        .catch(e => {
          console.error('Readiness API error:', e);
          return { data: [] };
        }),
      fetch(`https://api.ouraring.com/v2/usercollection/daily_sleep?start_date=${startDate}&end_date=${endDate}`, { headers })
        .then(async r => {
          if (!r.ok) {
            console.error('Sleep API error:', r.status, await r.text());
            return { data: [] };
          }
          return r.json();
        })
        .catch(e => {
          console.error('Sleep API error:', e);
          return { data: [] };
        }),
      fetch(`https://api.ouraring.com/v2/usercollection/daily_activity?start_date=${startDate}&end_date=${endDate}`, { headers })
        .then(async r => {
          if (!r.ok) {
            console.error('Activity API error:', r.status, await r.text());
            return { data: [] };
          }
          return r.json();
        })
        .catch(e => {
          console.error('Activity API error:', e);
          return { data: [] };
        }),
      fetch(`https://api.ouraring.com/v2/usercollection/daily_cardio_recovery?start_date=${startDate}&end_date=${endDate}`, { headers })
        .then(async r => {
          if (!r.ok) {
            console.error('VO2 Max API error:', r.status, await r.text());
            return { data: [] };
          }
          return r.json();
        })
        .catch(e => {
          console.error('VO2 Max API error:', e);
          return { data: [] };
        })
    ]);

    console.log('Raw readiness data:', JSON.stringify(readinessData, null, 2));
    console.log('Raw sleep data:', JSON.stringify(sleepData, null, 2));
    console.log('Raw activity data:', JSON.stringify(activityData, null, 2));
    console.log('Raw VO2 max data:', JSON.stringify(vo2MaxData, null, 2));

    const readiness = readinessData.data?.[0];
    const sleep = sleepData.data?.[0];
    const activity = activityData.data?.[0];
    const vo2Max = vo2MaxData?.data?.[0];

    console.log('Processed readiness:', JSON.stringify(readiness, null, 2));
    console.log('Processed sleep:', JSON.stringify(sleep, null, 2));
    console.log('Processed activity:', JSON.stringify(activity, null, 2));
    console.log('Processed VO2 max:', JSON.stringify(vo2Max, null, 2));

    // Validate and process sleep duration
    const sleepDuration = sleep?.contributors?.total_sleep;
    console.log('Raw sleep duration:', sleepDuration);
    const processedSleepDuration = sleepDuration && !isNaN(sleepDuration) ? 
      (sleepDuration / 10).toFixed(1) : 
      (() => {
        console.error('Invalid sleep duration:', sleepDuration);
        return 'N/A';
      })();

    return {
      readiness_score: readiness?.score && !isNaN(readiness.score) ? readiness.score : 'N/A',
      sleep_score: sleep?.score && !isNaN(sleep.score) ? sleep.score : 'N/A',
      sleep_duration: processedSleepDuration,
      activity_score: activity?.score && !isNaN(activity.score) ? activity.score : 'N/A',
      total_steps: activity?.steps && !isNaN(activity.steps) ? activity.steps : 'N/A',
      vo2_max: vo2Max?.vo2_max && !isNaN(vo2Max.vo2_max) ? vo2Max.vo2_max : undefined,
      hrv: sleep?.average_hrv && !isNaN(sleep.average_hrv) ? sleep.average_hrv : undefined,
      temperature_deviation: sleep?.temperature_deviation && !isNaN(sleep.temperature_deviation) ? sleep.temperature_deviation : undefined,
      sleep_latency: sleep?.latency && !isNaN(sleep.latency) ? sleep.latency : undefined,
      deep_sleep_duration: sleep?.deep_sleep_duration && !isNaN(sleep.deep_sleep_duration) ? 
        Number((sleep.deep_sleep_duration / 3600).toFixed(1)) : undefined,
      rem_sleep_duration: sleep?.rem_sleep_duration && !isNaN(sleep.rem_sleep_duration) ? 
        Number((sleep.rem_sleep_duration / 3600).toFixed(1)) : undefined,
      stress_level: readiness?.stress_balance && !isNaN(readiness.stress_balance) ? readiness.stress_balance : undefined,
      recovery_index: readiness?.recovery_index && !isNaN(readiness.recovery_index) ? readiness.recovery_index : undefined,
    };
  } catch (error) {
    console.error('Error fetching Oura data:', error);
    throw error;
  }
}
