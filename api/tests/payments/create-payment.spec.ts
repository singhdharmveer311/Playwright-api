import { PaymentBuilder } from '../../core/builders/payment.builder';
import { test, expect } from '../../fixtures/api.fixture';
import { PaymentAssertions } from '../../core/assertions/payment.assertions';

test.describe('Payments API', () => {
  test('creates a payment successfully', async ({ paymentsApi, authToken }) => {
    const paymentRequest = new PaymentBuilder().withAmount(3200).withCurrency('EUR').build();

    const response = await paymentsApi.createPayment(paymentRequest, authToken);
    expect(response.status()).toBe(201);

    const payment = await response.json();
    PaymentAssertions.matchesRequest(payment, paymentRequest);
    PaymentAssertions.isAuthorizedPayment(payment);
  });

  test('reuses the same payment for the same idempotency key', async ({ paymentsApi, authToken }) => {
    const paymentRequest = new PaymentBuilder().build();
    const idempotencyKey = `idem-${Date.now()}`;

    const firstResponse = await paymentsApi.createPayment(paymentRequest, authToken, idempotencyKey);
    const secondResponse = await paymentsApi.createPayment(paymentRequest, authToken, idempotencyKey);

    expect(firstResponse.status()).toBe(201);
    expect(secondResponse.status()).toBe(200);

    const firstPayment = await firstResponse.json();
    const secondPayment = await secondResponse.json();

    expect(secondPayment.id).toBe(firstPayment.id);
    expect(secondPayment.createdAt).toBe(firstPayment.createdAt);
  });

  test('rejects a payment with an invalid amount', async ({ paymentsApi, authToken }) => {
    const invalidRequest = new PaymentBuilder().withAmount(0).build();

    const response = await paymentsApi.createPayment(invalidRequest, authToken);
    expect(response.status()).toBe(400);

    await expect(response.json()).resolves.toMatchObject({
      message: 'amount must be a positive integer',
    });
  });
});
