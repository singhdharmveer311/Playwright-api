import { expect } from '@playwright/test';
import { PaymentRequest, PaymentResponse } from '../models/payment.model';

export class PaymentAssertions {
  static matchesRequest(response: PaymentResponse, request: PaymentRequest): void {
    expect(response.customerEmail).toBe(request.customerEmail);
    expect(response.amount).toBe(request.amount);
    expect(response.currency).toBe(request.currency);
  }

  static isAuthorizedPayment(response: PaymentResponse): void {
    expect(response.id).toMatch(/^pay_/);
    expect(response.status).toBe('AUTHORIZED');
    expect(response.createdAt).toBeTruthy();
    expect(response.refundedAmount).toBe(0);
  }
}
