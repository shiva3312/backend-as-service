# 07. API Design & Standards

## API Guidelines

1. **REST Conventions**: Endpoints use standard HTTP verbs (`GET`, `POST`, `PATCH`, `DELETE`).
2. **Versioning**: All API routes are prefixed with `/v1/`.
3. **Response Wrappers**:
   ```json
   {
     "success": true,
     "data": { ... },
     "error": null,
     "meta": {
       "requestId": "req-123456",
       "timestamp": "2025-01-01T00:00:00.000Z"
     }
   }
   ```
4. **Standard Error Schema**:
   ```json
   {
     "success": false,
     "data": null,
     "error": {
       "code": "INSUFFICIENT_WALLET_BALANCE",
       "message": "Required 5 credits, user balance is 2 credits",
       "details": []
     },
     "meta": {
       "requestId": "req-123456",
       "timestamp": "2025-01-01T00:00:00.000Z"
     }
   }
   ```
5. **OpenAPI / Swagger**: Auto-generated live documentation accessible at `/docs`.
