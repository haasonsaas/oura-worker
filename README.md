# Oura Day After Worker

A Cloudflare Worker that sends daily Oura Ring health metrics via email. This service runs automatically at 8 AM PT (15:00 UTC) to provide you with a summary of your previous day's health data.

## Features

- Daily automated email delivery of Oura Ring metrics
- Includes Sleep Score, Readiness Score, and Activity Score
- Shows detailed metrics like sleep duration and total steps
- Runs on Cloudflare Workers for reliable execution
- Configurable timezone support

## Prerequisites

- Cloudflare account
- Oura Ring account with API access
- Email service (configured in Cloudflare Workers)

## Setup Instructions

1. Clone this repository:
   ```bash
   git clone https://github.com/haasonsaas/oura-worker.git
   cd oura-worker
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create your wrangler.toml:
   ```bash
   cp wrangler.toml.example wrangler.toml
   ```

4. Configure wrangler.toml:
   - Replace `<YOUR_CLOUDFLARE_ACCOUNT_ID>` with your Cloudflare account ID
   - You can find your account ID in the Cloudflare dashboard
   - Adjust the cron schedule if needed (default is 8 AM PT / 15:00 UTC)
   - Set your preferred timezone in the `[vars]` section

5. Set up your secrets in Cloudflare:
   ```bash
   bunx wrangler secret put OURA_API_KEY
   bunx wrangler secret put FROM_EMAIL
   bunx wrangler secret put TO_EMAIL
   ```

6. Deploy the worker:
   ```bash
   bunx wrangler deploy
   ```

## Testing

You can test the worker in two ways:

1. View the digest in your browser:
   ```
   https://<your-worker>.workers.dev
   ```

2. Trigger the email manually:
   ```bash
   curl "https://<your-worker>.workers.dev/__scheduled?cron=*+*+*+*+*"
   ```

## Monitoring

To view logs in real-time:
```bash
bunx wrangler tail
```

## Environment Variables

- `OURA_API_KEY`: Your Oura Ring API key
- `FROM_EMAIL`: The email address that will send the daily reports
- `TO_EMAIL`: The email address that will receive the daily reports
- `TIMEZONE`: Your preferred timezone (default: "America/Los_Angeles")

## License

MIT

## Contributing

Feel free to open issues or submit pull requests for any improvements or bug fixes. 