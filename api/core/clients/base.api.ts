import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseApi {
  constructor(protected readonly request: APIRequestContext) {}

  protected get(url: string, token?: string): Promise<APIResponse> {
    return this.request.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  protected post(
    url: string,
    body?: unknown,
    options?: { token?: string; headers?: Record<string, string> }
  ): Promise<APIResponse> {
    return this.request.post(url, {
      data: body,
      headers: {
        ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...(options?.headers ?? {}),
      },
    });
  }
}
