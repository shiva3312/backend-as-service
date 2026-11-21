# Wallet Module AI Rules

## Responsibility
Own wallet balance, credit top-up, deduction, refunds, idempotency, and immutable financial ledger entries.

## Boundaries
- Wallet is the source of truth for transactions.
- Direct modification of wallet records from other modules is strictly forbidden.
- Atomic SQL transactions and minor currency integers are mandatory.
