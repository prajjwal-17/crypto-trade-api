# Crypto Trade API

## Overview

Crypto Trade API is a scalable REST backend built using Node.js, Express, Prisma, and PostgreSQL. It supports JWT authentication, role-based access control (USER / ADMIN), CRUD operations for trade signals, rate limiting, and Redis-backed caching.

The system is designed with modular architecture, validation, request logging, secure password handling, and a Dockerized database setup.

---

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Dockerized)
- JWT Authentication
- Zod Validation
- Swagger (OpenAPI)
- Redis (Caching & Rate Limiting)
- Morgan (HTTP Request Logging)
- Express Rate Limit
- Docker

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd crypto-trade-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start PostgreSQL (Docker)

```bash
docker-compose up -d
```

### 4. Run Prisma Migrations

```bash
npx prisma migrate dev
```

### 5. Start Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

Swagger Docs:

```
http://localhost:5000/api-docs
```

---

## Authentication Flow

1. Register a user account
2. Login to receive a JWT token
3. Include the token in subsequent requests via the `Authorization` header:

```
Authorization: Bearer <token>
```

JWT tokens expire after **1 hour**.

---

## Role-Based Access Control

**USER**
- Create trade signals
- View own signals
- Update and delete own signals

**ADMIN**
- View all signals
- Update and delete any signal

RBAC is enforced via dedicated middleware on all protected routes.

---

## Trade Signal Model

Each signal includes the following fields:

| Field        | Description                        |
|--------------|------------------------------------|
| `asset`      | The traded asset                   |
| `direction`  | `LONG` or `SHORT`                  |
| `entryPrice` | Entry price of the trade           |
| `targetPrice`| Target price of the trade          |
| `stopLoss`   | Stop-loss price                    |
| `status`     | Current signal status              |
| `userId`     | Reference to the signal owner      |

All financial fields use Prisma's `Decimal` type for precision.

---

## Security Practices

- Passwords hashed using `bcrypt`
- JWT authentication with configurable expiration
- Role-based access middleware on protected routes
- Input validation using `Zod` schemas
- Rate limiting applied globally to prevent abuse and brute-force attacks
- HTTP request logging via `Morgan` for observability and debugging
- Dockerized database for environment isolation
- Structured error handling across all endpoints

---

## Rate Limiting and Logging

**Rate Limiting**

API rate limiting is enforced globally using `express-rate-limit` backed by Redis. This prevents abuse, brute-force login attempts, and ensures fair usage across clients. Requests exceeding the limit receive a `429 Too Many Requests` response.

**Request Logging**

All incoming HTTP requests are logged using `Morgan`. This provides visibility into request methods, routes, status codes, and response times, aiding both development debugging and production monitoring.

---

## Scalability Design

The system is designed to scale horizontally:

- Stateless JWT allows multi-instance deployment without shared session state
- Redis is integrated for caching frequent read operations and backing the rate limiter
- Auth and Trade modules can be separated into independent microservices
- NGINX can act as a load balancer to distribute traffic across instances
- Docker ensures consistent environments across development and production

---

## License

MIT
