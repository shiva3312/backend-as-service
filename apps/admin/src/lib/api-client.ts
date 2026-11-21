import { ApiResponse } from '@modular-platform/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class ApiClient {
  private static token: string | null = null;
  private static appId: string = 'app_9812a';

  static setToken(token: string | null) {
    this.token = token;
  }

  static getToken(): string | null {
    return this.token;
  }

  static setAppId(appId: string) {
    this.appId = appId;
  }

  static getAppId(): string {
    return this.appId;
  }

  static async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-app-id': this.appId,
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();
      return data as ApiResponse<T>;
    } catch (error: any) {
      return {
        success: false,
        data: null,
        error: {
          code: 'NETWORK_OFFLINE',
          message: error.message || 'API Gateway Offline / Fallback Mode',
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    }
  }
}
