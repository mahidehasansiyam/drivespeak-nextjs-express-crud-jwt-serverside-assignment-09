# DriveSpeak — Server Side

An **Express 5** REST API that powers the DriveSpeak car rental marketplace. Connects to **MongoDB Atlas** and verifies JWTs issued by the Next.js client using **jose-cjs**.

## Purpose

Serve car listing and booking data to the Next.js frontend via REST endpoints. Authenticate requests by verifying Better-Auth JWTs against the client's JWKS endpoint. Deployable as a Vercel serverless function.

## How It Works

- **Startup** — connects to MongoDB, sets up CORS (allow all origins), and registers all route handlers.
- **Auth verification** — the `verifyToken` middleware (line 32 of `index.js`) extracts the `Bearer` token from the `Authorization` header, fetches the client's JWKS endpoint at `{CLIENT_URL}/api/auth/jwks` using `createRemoteJWKSet`, and verifies the token with `jwtVerify`. Only `GET /allcars`, `GET /allcars/:email`, `POST /allbookings`, `GET /allbookings/:email` use this middleware.
- **Collections** — `cardata` stores car listings; `bookingData` stores booking records. Better-Auth manages its own collections (`users`, `sessions`, `accounts`, etc.) in the same database.
- **Search/filter** — `GET /api/cars?search=&type=&seats=` does a case-insensitive regex search on car name, and filters by type and seat count. Returns `{ success, data }`.
- **Deployment** — `vercel.json` routes all HTTP methods to `index.js` via `@vercel/node`.

## Technologies

| Tech | Version |
|------|---------|
| Express | 5.2.1 |
| MongoDB | 7.2.0 |
| jose-cjs | 6.2.3 |
| cors | 2.8.6 |
| dotenv | 17.4.2 |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Home response |
| GET | `/fewcars` | No | First 6 cars |
| **GET** | **`/allcars`** | **Yes** | **All cars** |
| **GET** | **`/allcars/:email`** | **Yes** | **Cars by user email** |
| POST | `/newcar` | No | Add a new car |
| PATCH | `/allcars/:id` | No | Increment booking count |
| PATCH | `/allcars/:email/:id` | No | Update a car |
| DELETE | `/allcars/:email/:id` | No | Delete a car |
| **POST** | **`/allbookings`** | **Yes** | **Create a booking** |
| **GET** | **`/allbookings/:email`** | **Yes** | **Bookings by email** |
| DELETE | `/allbookings/:email/:id` | No | Delete a booking |
| GET | `/api/cars` | No | Search/filter cars |

## Commands

```bash
node index.js  # Start on port 7000 (no npm dev script)
npm test       # Placeholder (no tests configured)
```

## Environment

Copy the existing `.env` at project root. Key variables:

- `PORT` — Server port (`7000`)
- `MONGODB_URI` — MongoDB Atlas connection string
- `CLIENT_URL` — Next.js app URL (`http://localhost:3000`) used for JWKS fetch

## Deployment

Configured for Vercel via `vercel.json`. The `@vercel/node` builder wraps `index.js` as a serverless function. All HTTP methods are routed to it.
