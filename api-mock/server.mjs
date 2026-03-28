import http from 'node:http';
import { randomUUID } from 'node:crypto';

const PORT = 4300;
const VALID_TOKEN = 'mock-token-tester';
const VALID_USER = {
  email: 'tester@payments.local',
  password: 'password123',
  role: 'qa-engineer',
};

const payments = new Map();
const idempotencyCache = new Map();

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function parseJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function isAuthorized(req) {
  return req.headers.authorization === `Bearer ${VALID_TOKEN}`;
}

function validatePayment(payload) {
  if (!payload.customerEmail || typeof payload.customerEmail !== 'string') {
    return 'customerEmail is required';
  }

  if (!Number.isInteger(payload.amount) || payload.amount <= 0) {
    return 'amount must be a positive integer';
  }

  if (!['USD', 'EUR', 'GBP'].includes(payload.currency)) {
    return 'currency must be one of USD, EUR, GBP';
  }

  return null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { status: 'ok' });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/auth/login') {
    try {
      const body = await parseJson(req);
      if (
        body.email === VALID_USER.email &&
        body.password === VALID_USER.password
      ) {
        sendJson(res, 200, {
          token: VALID_TOKEN,
          user: {
            email: VALID_USER.email,
            role: VALID_USER.role,
          },
        });
        return;
      }

      sendJson(res, 401, { message: 'Invalid credentials' });
    } catch (error) {
      sendJson(res, 400, { message: error.message });
    }
    return;
  }

  if (!isAuthorized(req)) {
    sendJson(res, 401, { message: 'Unauthorized' });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/payments') {
    try {
      const body = await parseJson(req);
      const validationError = validatePayment(body);
      if (validationError) {
        sendJson(res, 400, { message: validationError });
        return;
      }

      const idempotencyKey = req.headers['x-idempotency-key'];
      if (typeof idempotencyKey === 'string' && idempotencyCache.has(idempotencyKey)) {
        sendJson(res, 200, idempotencyCache.get(idempotencyKey));
        return;
      }

      const payment = {
        id: `pay_${randomUUID().slice(0, 8)}`,
        customerEmail: body.customerEmail,
        amount: body.amount,
        currency: body.currency,
        status: 'AUTHORIZED',
        createdAt: new Date().toISOString(),
        refundedAmount: 0,
      };

      payments.set(payment.id, payment);
      if (typeof idempotencyKey === 'string') {
        idempotencyCache.set(idempotencyKey, payment);
      }

      sendJson(res, 201, payment);
    } catch (error) {
      sendJson(res, 400, { message: error.message });
    }
    return;
  }

  if (req.method === 'GET' && url.pathname.startsWith('/payments/')) {
    const paymentId = url.pathname.split('/')[2];
    const payment = payments.get(paymentId);

    if (!payment) {
      sendJson(res, 404, { message: 'Payment not found' });
      return;
    }

    sendJson(res, 200, payment);
    return;
  }

  if (
    req.method === 'POST' &&
    url.pathname.startsWith('/payments/') &&
    url.pathname.endsWith('/refunds')
  ) {
    const paymentId = url.pathname.split('/')[2];
    const payment = payments.get(paymentId);

    if (!payment) {
      sendJson(res, 404, { message: 'Payment not found' });
      return;
    }

    try {
      const body = await parseJson(req);
      const refundAmount = body.amount;

      if (!Number.isInteger(refundAmount) || refundAmount <= 0) {
        sendJson(res, 400, { message: 'refund amount must be a positive integer' });
        return;
      }

      if (payment.refundedAmount + refundAmount > payment.amount) {
        sendJson(res, 409, { message: 'Refund amount exceeds original payment amount' });
        return;
      }

      payment.refundedAmount += refundAmount;
      payment.status =
        payment.refundedAmount === payment.amount ? 'REFUNDED' : 'PARTIALLY_REFUNDED';

      sendJson(res, 201, {
        refundId: `refund_${randomUUID().slice(0, 8)}`,
        paymentId,
        amount: refundAmount,
        status: 'SUCCEEDED',
      });
    } catch (error) {
      sendJson(res, 400, { message: error.message });
    }
    return;
  }

  sendJson(res, 404, { message: 'Route not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Mock API listening on http://127.0.0.1:${PORT}`);
});
