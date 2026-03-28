import { PaymentBuilder } from '../../core/builders/payment.builder';
import { test, expect } from '../../core/fixtures/api.fixture';

test.describe('Refunds API', () => {
  test('refunds a payment without exceeding the original amount', async ({ paymentsApi, authToken }) => {
    const paymentRequest = new PaymentBuilder().withAmount(5000).build();
    const paymentResponse = await paymentsApi.createPayment(paymentRequest, authToken);
    const payment = await paymentResponse.json();

    const refund = await paymentsApi.refundPayment(payment.id, 2000, authToken);

    expect(refund.status).toBe('SUCCEEDED');
    expect(refund.amount).toBe(2000);

    const updatedPayment = await paymentsApi.getPayment(payment.id, authToken);
    expect(updatedPayment.status).toBe('PARTIALLY_REFUNDED');
    expect(updatedPayment.refundedAmount).toBe(2000);
  });

  test('rejects a refund larger than the original payment', async ({ paymentsApi, authToken }) => {
    const paymentRequest = new PaymentBuilder().withAmount(1200).build();
    const paymentResponse = await paymentsApi.createPayment(paymentRequest, authToken);
    const payment = await paymentResponse.json();

    const refundResponse = await paymentsApi.refundPaymentResponse(payment.id, 5000, authToken);

    expect(refundResponse.status()).toBe(409);
    await expect(refundResponse.json()).resolves.toMatchObject({
      message: 'Refund amount exceeds original payment amount',
    });
  });
});
