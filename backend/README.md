# OneURL Backend - Link Preview Service

Express server for fetching link preview metadata with rate limiting, validation, and error handling.

## Features

- Input validation with Zod
- Rate limiting (strict: 10/min, general: 100/15min)
- CORS support
- Error handling
- Request logging
- Fallback scraping with Cheerio
- Production-ready error handling

## Development

```bash
bun install
bun run dev
```

## Production

```bash
bun run build
bun run start
```

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Port
PORT=3001

# Frontend URL(s) for CORS
# Development: http://localhost:3000
# Production: https://oneurl.live
# Multiple URLs can be separated by commas
FRONTEND_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

**Production Setup:**
```env
PORT=3001
FRONTEND_URL="https://oneurl.live"
NODE_ENV="production"
```

**Multiple Origins (if needed):**
```env
FRONTEND_URL="https://oneurl.live,https://www.oneurl.live"
```

## API

### GET /api/preview?url={url}

Fetches metadata for a given URL.

**Rate Limits:**
- 10 requests per minute per IP
- 100 requests per 15 minutes per IP

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Page Title",
    "description": "Page description",
    "image": "https://example.com/image.jpg",
    "logo": "https://example.com/favicon.ico",
    "url": "https://example.com"
  }
}
```

