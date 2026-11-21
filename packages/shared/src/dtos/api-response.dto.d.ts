export interface ApiResponseMeta {
    requestId?: string;
    timestamp: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    error: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
    } | null;
    meta: ApiResponseMeta;
}
export declare function createSuccessResponse<T>(data: T, requestId?: string): ApiResponse<T>;
