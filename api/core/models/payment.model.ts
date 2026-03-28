export type Currency = 'USD' | 'EUR' | 'GBP';

export interface LoginResponse {
  token: string;
  user: {
    email: string;
    role: string;
  };
}

export interface PaymentRequest {
  customerEmail: string;
  amount: number;
  currency: Currency;
}

export interface PaymentResponse extends PaymentRequest {
  id: string;
  status: 'AUTHORIZED' | 'PARTIALLY_REFUNDED' | 'REFUNDED';
  createdAt: string;
  refundedAmount: number;
}

export interface RefundRequest {
  amount: number;
}

export interface RefundResponse {
  refundId: string;
  paymentId: string;
  amount: number;
  status: 'SUCCEEDED';
}

export interface ApiErrorResponse {
  message: string;
}
