# API & Data Engineering Guidelines

Guidelines for designing high-performance, fault-tolerant APIs and database persistence layers.

---

## 1. RESTful API Design Specification

### Resource URLs & Semantic Verbs
- Prefer `/api/v1/organizations/{orgId}/projects/{projectId}`.
- Query Parameters for Filtering, Sorting, and Pagination:
  - `?page=1&limit=25` (Offset pagination for small datasets)
  - `?cursor=eyJpZCI6MTAxfQ==&limit=25` (Cursor pagination for real-time / infinite scroll feeds)
  - `?sort=-created_at,title` (Descending by date, ascending by title)
  - `?filter[status]=active&filter[category]=fintech`

### RFC 7807 Error Response Format
All `4xx` and `5xx` responses must conform to RFC 7807:
```json
{
  "type": "https://api.example.com/errors/validation-error",
  "title": "Unprocessable Entity",
  "status": 422,
  "detail": "The payload failed schema validation.",
  "instance": "/api/v1/users",
  "invalid_params": [
    {
      "name": "email",
      "reason": "Must be a valid email address"
    }
  ],
  "timestamp": "2026-10-12T04:45:00Z"
}
```

---

## 2. Database Indexing & Query Optimization

### Index Types & Usage
- **B-Tree**: Default. Ideal for equality (`=`), range queries (`<`, `<=`, `>`, `>=`), and `BETWEEN`.
- **Composite Indexes**: Follow the **Leftmost Prefix Rule**. If an index is `(status, created_at)`, queries filtering by `status` or `status AND created_at` utilize the index, but queries filtering *only* by `created_at` will not.
- **Partial Indexes**: For sparse states, e.g. `CREATE INDEX idx_unprocessed_orders ON orders (created_at) WHERE status = 'pending';` saves disk and memory.
- **Covering Indexes (`INCLUDE`)**: Include frequently read columns in the index payload to avoid table heap lookups entirely.

### Connection Pooling & Transactions
- Never create a new database connection per HTTP request; use connection poolers like PgBouncer or native ORM pool managers (`max: 20`, `idleTimeoutMillis: 30000`).
- Keep transactions as short as possible. Do not make external HTTP network calls inside an open SQL transaction.
