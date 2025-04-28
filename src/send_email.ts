export interface EmailEnv {
  RESEND_API_KEY: string;
  FROM_EMAIL: string;
  TO_EMAIL?: string;
}

export async function sendEmail(env: EmailEnv, subject: string, text: string) {
  console.log('Attempting to send email...');
  console.log('From:', env.FROM_EMAIL);
  console.log('To:', env.TO_EMAIL);
  console.log('Subject:', subject);

  const payload = {
    from: env.FROM_EMAIL,
    to: env.TO_EMAIL || 'jonathan@0xhaas.com',
    subject,
    html: `<pre>${text}</pre>`,
  };

  console.log('Sending payload:', JSON.stringify(payload, null, 2));

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(payload),
  });

  const body = await resp.text();
  console.log('Response status:', resp.status);
  console.log('Response body:', body);

  if (!resp.ok) {
    throw new Error(`Mail send failed: ${resp.status} ${body}`);
  }
}
