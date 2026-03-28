import { APIRequestContext } from '@playwright/test';
import { apiEnv } from '../../config/env';
import { LoginResponse } from '../models/payment.model';
import { BaseApi } from './base.api';

export class AuthApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async login(
    email = apiEnv.qaUser.email,
    password = apiEnv.qaUser.password
  ): Promise<LoginResponse> {
    const response = await this.post('/auth/login', { email, password });
    return response.json();
  }
}
