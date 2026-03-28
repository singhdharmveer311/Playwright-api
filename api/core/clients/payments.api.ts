import { APIRequestContext, APIResponse } from '@playwright/test';
import {
  PaymentRequest,
  PaymentResponse,
  RefundResponse,
} from '../models/payment.model';
import { BaseApi } from './base.api';

export class PaymentsApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  createPayment(
    payload: PaymentRequest,
    token: string,
    idempotencyKey?: string
  ): Promise<APIResponse> {
    return this.post('/payments', payload, {
      token,
      headers: idempotencyKey ? { 'x-idempotency-key': idempotencyKey } : undefined,
    });
  }

  async getPayment(paymentId: string, token: string): Promise<PaymentResponse> {
    const response = await this.get(`/payments/${paymentId}`, token);
    return response.json();
  }

  async refundPayment(paymentId: string, amount: number, token: string): Promise<RefundResponse> {
    const response = await this.post(`/payments/${paymentId}/refunds`, { amount }, { token });
    return response.json();
  }

  refundPaymentResponse(paymentId: string, amount: number, token: string): Promise<APIResponse> {
    return this.post(`/payments/${paymentId}/refunds`, { amount }, { token });
  }
}
