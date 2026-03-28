# Lesson 1: HTTP and API Testing Basics

This is the first lesson you should study before touching framework structure.

The goal is simple: understand what an API request is, what an API response is, and how that maps to the code in this repo.

## What Is API Testing?

API testing means sending HTTP requests to an application and checking the responses.

You are validating things like:

- status codes
- response body data
- headers
- authentication behavior
- business rules

In this repo, Playwright is used as the HTTP client and assertion tool. It is not only a UI automation tool.

## Anatomy of an HTTP Request

A request has these main parts:

- method
  - what action you want to perform
- URL
  - which endpoint you are calling
- headers
  - metadata such as auth token or content type
- body
  - the JSON payload sent to the API

Example from this repo:

```http
POST /payments
Authorization: Bearer mock-token-tester
x-idempotency-key: idem-123

{
  "customerEmail": "qa@example.com",
  "amount": 2500,
  "currency": "USD"
}
```

## Anatomy of an HTTP Response

A response has these main parts:

- status code
  - high-level result of the request
- headers
  - metadata about the response
- body
  - JSON returned by the API

Example successful payment response:

```json
{
  "id": "pay_ab12cd34",
  "customerEmail": "qa@example.com",
  "amount": 2500,
  "currency": "USD",
  "status": "AUTHORIZED",
  "createdAt": "2026-03-27T05:00:00.000Z",
  "refundedAmount": 0
}
```

## HTTP Methods Used in This Repo

- `GET`
  - read data
- `POST`
  - create data or trigger an action

Repo examples:

- `GET /health`
  - basic system check
- `POST /auth/login`
  - login and receive a token
- `POST /payments`
  - create a payment
- `GET /payments/:id`
  - fetch a payment
- `POST /payments/:id/refunds`
  - create a refund

## Status Codes You Need to Learn First

- `200`
  - request succeeded
- `201`
  - resource created successfully
- `400`
  - bad request, usually invalid payload
- `401`
  - unauthorized
- `404`
  - resource not found
- `409`
  - conflict with business rules

Examples in this repo:

- payment created: `201`
- reused idempotency key: `200`
- invalid payment amount: `400`
- missing or bad token: `401`
- payment not found: `404`
- refund exceeds payment amount: `409`

## Authentication in This Repo

Protected endpoints require a bearer token in the `Authorization` header.

Flow:

1. call `POST /auth/login`
2. get back a token
3. send `Authorization: Bearer <token>` on protected requests

This is why the fixture logs in first and provides `authToken` to tests.

## Idempotency in This Repo

Idempotency means repeating the same request safely without creating duplicate records.

Here, the payment API checks `x-idempotency-key`.

- first request with a new key returns `201`
- second request with the same key returns the same payment and `200`

This is an important real-world API testing concept.

## How the Repo Maps to HTTP Concepts

- [api-mock/server.mjs](/Users/user/projects/Playwright-api/api-mock/server.mjs)
  - the API contract and business rules
- [api/core/models/payment.model.ts](/Users/user/projects/Playwright-api/api/core/models/payment.model.ts)
  - TypeScript shapes for request and response data
- [api/core/clients/base.api.ts](/Users/user/projects/Playwright-api/api/core/clients/base.api.ts)
  - thin wrapper over Playwright request methods
- [api/core/clients/payments.api.ts](/Users/user/projects/Playwright-api/api/core/clients/payments.api.ts)
  - endpoint-specific client methods
- [api/core/fixtures/api.fixture.ts](/Users/user/projects/Playwright-api/api/core/fixtures/api.fixture.ts)
  - shared test setup, including login
- [api/tests/payments/create-payment.spec.ts](/Users/user/projects/Playwright-api/api/tests/payments/create-payment.spec.ts)
  - actual tests that exercise the API

## What to Read Next

Read these files in this exact order:

1. [api-mock/server.mjs](/Users/user/projects/Playwright-api/api-mock/server.mjs)
2. [api/core/models/payment.model.ts](/Users/user/projects/Playwright-api/api/core/models/payment.model.ts)
3. [api/tests/payments/create-payment.spec.ts](/Users/user/projects/Playwright-api/api/tests/payments/create-payment.spec.ts)

## Mini Homework

Before moving to the framework plan, answer these questions yourself:

1. Which endpoint creates a payment?
2. Why does `POST /payments` need a token?
3. Why does invalid amount return `400`?
4. Why does the second request with the same idempotency key return `200` instead of `201`?
