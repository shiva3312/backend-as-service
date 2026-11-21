# 04. Monetization Engine & Feature Entitlements

## Feature Entitlement Pipeline

When an application client requests access to execute a protected feature, the **Feature Access Engine** resolves access using an 11-step validation chain:

```
[ Request ] ──> 1. Authenticate Request
             ──> 2. Resolve appId & Verify App Status
             ──> 3. Verify Module Enablement
             ──> 4. Verify Feature Enablement
             ──> 5. Check User RBAC/ABAC Permissions
             ──> 6. Evaluate Active Subscriptions
             ──> 7. Evaluate Usage Quotas (Redis Rate Bucket)
             ──> 8. Check Wallet Balance & Reserve Credits
             ──> 9. Execute Feature Operation
             ──> 10. Commit Credit Deduction & Usage Log
             ──> 11. Return Standard Success Response
```

## Wallet Ledger Immutability

The **Wallet System** enforces:
- Minor currency unit integers (e.g. 1000 credits = $10.00).
- Strict idempotency key validation per transaction (`x-idempotency-key`).
- Atomic SQL transactions (`SELECT ... FOR UPDATE` or Prisma `$transaction`).
- Append-only transaction ledger (`WalletTransaction`).
