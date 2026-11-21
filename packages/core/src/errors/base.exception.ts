import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class BaseException extends HttpException {
  public readonly code: string;
  public readonly timestamp: string;

  constructor(
    message: string,
    code: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(
      {
        success: false,
        data: null,
        error: {
          code,
          message,
          details,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      },
      status,
    );
    this.code = code;
    this.timestamp = new Date().toISOString();
  }
}

export class UnauthorizedTenantException extends BaseException {
  constructor(message = 'Unauthorized tenant/application access') {
    super(message, 'UNAUTHORIZED_TENANT_ACCESS', HttpStatus.FORBIDDEN);
  }
}

export class FeatureDisabledException extends BaseException {
  constructor(featureName: string) {
    super(`Feature '${featureName}' is disabled for this application`, 'FEATURE_DISABLED', HttpStatus.FORBIDDEN);
  }
}

export class InsufficientBalanceException extends BaseException {
  constructor(required: number, current: number) {
    super(
      `Insufficient wallet credits. Required: ${required}, Available: ${current}`,
      'INSUFFICIENT_WALLET_BALANCE',
      HttpStatus.PAYMENT_REQUIRED,
      { required, current },
    );
  }
}
