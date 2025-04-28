export interface EmailEnv {
  FROM_EMAIL: string;
  TO_EMAIL: string;
}

export async function sendEmail(env: EmailEnv, subject: string, text: string) {
  const payload = {
    personalizations: [
      { to: [{ email: env.TO_EMAIL }] },
    ],
    from: { 
      email: env.FROM_EMAIL,
      name: "Oura Daily Report"
    },
    subject,
    content: [
      { type: 'text/plain', value: text },
    ],
  };

  const resp = await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Mail send failed: ${resp.status} ${body}`);
  }
}
