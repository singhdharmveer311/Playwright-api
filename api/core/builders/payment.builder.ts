import { PaymentRequest } from '../models/payment.model';

export class PaymentBuilder {
  private readonly data: PaymentRequest = {
    customerEmail: `qa.${Date.now()}@payments.local`,
    amount: 2500,
    currency: 'USD',
  };

  withCustomerEmail(customerEmail: string): this {
    this.data.customerEmail = customerEmail;
    return this;
  }

  withAmount(amount: number): this {
    this.data.amount = amount;
    return this;
  }

  withCurrency(currency: PaymentRequest['currency']): this {
    this.data.currency = currency;
    return this;
  }

  build(): PaymentRequest {
    return { ...this.data };
  }
}
