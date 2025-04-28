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

## Environment Variables

The following environment variables need to be set in your Cloudflare Workers configuration:

- `OURA_API_KEY`: Your Oura Ring API key
- `FROM_EMAIL`: The email address to send from
- `TO_EMAIL`: The recipient email address
- `TIMEZONE`: Your preferred timezone (default: "America/Los_Angeles")

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `wrangler.toml` with your Cloudflare account ID
4. Deploy to Cloudflare Workers:
   ```bash
   npx wrangler deploy
   ```

## Development

The project is written in TypeScript and uses Cloudflare Workers. The main components are:

- `src/index.ts`: Main worker logic and request handling
- `src/oura_api.ts`: Oura Ring API integration
- `src/send_email.ts`: Email sending functionality

## Configuration

The worker is configured to run daily at 8 AM PT (15:00 UTC). You can modify the schedule in `wrangler.toml`:

```toml
[triggers]
crons = ["0 15 * * *"] # 8am PT (15 UTC)
```

## Manual Testing

You can test the worker by making a GET request to your worker's URL. This will return the digest in HTML format.

## License

MIT

## Contributing

Feel free to open issues or submit pull requests for any improvements or bug fixes. 