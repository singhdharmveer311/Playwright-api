# Playwright API Starter

Source
https://udemy.com/course/playwright-api-testing-mastery-with-typescript

This repo is a beginner-first Playwright API testing starter. It gives you a small but real framework structure, a local mock payment API, and a teaching path so you can learn API automation from zero instead of copying patterns blindly.

## Start Here

1. Install dependencies:

```bash
npm install
```

2. Run the API suite:

```bash
npm run test:api
```

3. Learn in this order:

- [docs/01-http-api-testing-basics.md](/Users/user/projects/Playwright-api/docs/01-http-api-testing-basics.md)
- [docs/api-framework-learning-plan.md](/Users/user/projects/Playwright-api/docs/api-framework-learning-plan.md)
- [api-mock/server.mjs](/Users/user/projects/Playwright-api/api-mock/server.mjs)
- [api/core/models/payment.model.ts](/Users/user/projects/Playwright-api/api/core/models/payment.model.ts)
- [api/tests/payments/create-payment.spec.ts](/Users/user/projects/Playwright-api/api/tests/payments/create-payment.spec.ts)

## What This Repo Contains

- `api-mock/`
   - local API you can test without external systems

- `api/core/models`
   - request and response types

- `api/core/builders`
   - reusable payload creation

- `api/core/clients`
   - API abstraction over raw requests

- `api/core/fixtures`
   - shared setup for tests

- `api/core/assertions`
   - reusable business checks

- `api/tests`
   - sample happy-path and negative-path tests

## Framework Flow

The intended request flow in this repo is:

`test -> fixture -> API client -> mock API -> assertion`

That is the core mental model you need before scaling the framework.

## Commands

- `npm run mock:api`
   - starts the local mock API

- `npm run test:api`
   - runs the Playwright API suite

- `npm run test:api:payments`
   - runs only the payment specs

- `npm run test:api:debug`
   - runs the suite in Playwright debug mode

## Recommended Learning Rule

Do not try to memorize all files at once. Read one layer at a time and explain each file back in your own words:

1. What problem does this layer solve?
2. What would break if this layer did not exist?
3. Why is this better than writing everything directly inside the test?
