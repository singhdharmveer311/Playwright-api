import { test as base } from '@playwright/test';
import { AuthApi } from '../clients/auth.api';
import { PaymentsApi } from '../clients/payments.api';

type ApiFixtures = {
  authApi: AuthApi;
  paymentsApi: PaymentsApi;
  authToken: string;
};

export const test = base.extend<ApiFixtures>({
  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },

  paymentsApi: async ({ request }, use) => {
    await use(new PaymentsApi(request));
  },

  authToken: async ({ authApi }, use) => {
    const loginResponse = await authApi.login();
    await use(loginResponse.token);
  },
});

export { expect } from '@playwright/test';
