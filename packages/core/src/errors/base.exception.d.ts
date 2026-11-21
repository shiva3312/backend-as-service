import { HttpException, HttpStatus } from '@nestjs/common';
export declare abstract class BaseException extends HttpException {
    readonly details: Record<string, unknown>;
    readonly code: string;
    readonly timestamp: string;
    constructor(message: string, code: string, status?: HttpStatus, details?: Record<string, unknown>);
}
export declare class UnauthorizedTenantException extends BaseException {
    constructor(message?: string);
}
export declare class FeatureDisabledException extends BaseException {
    constructor(featureName: string);
}
export declare class InsufficientBalanceException extends BaseException {
    constructor(required: number, current: number);
}
