---
name: app-developer
description: >-
  Comprehensive application development, full-stack software architecture, and system engineering guide.
  Use this skill whenever designing or implementing software applications, backend services, REST/GraphQL/gRPC APIs,
  database schemas and migrations, state management, authentication & authorization, automated testing (unit/integration/E2E),
  Docker containerization, CI/CD pipelines, and application performance tuning.
---

# Application Developer & Software Engineering Skill

This skill provides an end-to-end engineering methodology for building robust, scalable, secure, and maintainable software applications across backend, frontend, and distributed architectures.

---

## 1. Application Architecture & Domain Design

Maintain clean separation of concerns using **Layered / Clean Architecture** or **Feature-Sliced Design**:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Presentation Layer (API Controllers, Web UI, CLI)        │
│    └── Request validation, serialization, HTTP status codes │
├─────────────────────────────────────────────────────────────┤
│ 2. Application Layer (Use Cases, Services, Orchestration)   │
│    └── Business logic workflows, transactions, domain events│
├─────────────────────────────────────────────────────────────┤
│ 3. Domain Layer (Entities, Value Objects, Domain Rules)     │
│    └── Pure business rules, zero external framework leaks   │
├─────────────────────────────────────────────────────────────┤
│ 4. Infrastructure Layer (Database, Cache, Third-Party APIs) │
│    └── Repositories, ORM entities, message brokers, HTTP cls│
└─────────────────────────────────────────────────────────────┘
```

### Core Architecture Rules:
- **Dependency Inversion Principle (DIP)**: High-level use cases must depend on abstractions (interfaces/ports), not concrete infrastructure implementations.
- **Fail-Fast Input Validation**: Validate all inbound payloads at boundary gateways using strict schema validators ([`Zod`](https://zod.dev), [`Pydantic`](https://docs.pydantic.dev), or [`Joi`]).
- **12-Factor Compliance**: Store all configuration in environment variables (`.env` files parsed with strict schema validation on startup).

For in-depth architectural patterns, see [`references/architecture_patterns.md`](./references/architecture_patterns.md).

---

## 2. API Design & Engineering Standards

### A. RESTful Standards & HTTP Semantics
- Use plural nouns for resources: `/api/v1/users`, `/api/v1/orders/{orderId}/items`.
- Respect HTTP verbs:
  - `GET`: Safe, idempotent, cached where appropriate.
  - `POST`: Non-idempotent resource creation.
  - `PUT`: Complete idempotent resource replacement.
  - `PATCH`: Partial resource update.
  - `DELETE`: Idempotent resource removal.
- Standardized API Response Envelopes:
```json
{
  "success": true,
  "data": { "id": "usr_9918", "name": "Alex" },
  "error": null,
  "meta": { "page": 1, "pageSize": 20, "total": 120 }
}
```
- RFC 7807 Problem Details for HTTP APIs on error states (`status`, `title`, `detail`, `instance`, `errors`).

### B. Real-Time & High-Throughput Protocols
- **WebSockets / Server-Sent Events (SSE)**: Use SSE for unidirectional live streams (notifications, LLM token streaming); WebSockets for bidirectional duplex channels (chat, collaborative editing).
- **gRPC / Protocol Buffers**: Adopt for inter-microservice internal RPC communication to minimize transport overhead and enforce strict interface definition languages (IDLs).

See [`references/api_and_data_engineering.md`](./references/api_and_data_engineering.md) for complete endpoint schemas and pagination patterns.

---

## 3. Database Modeling, Data Integrity & Migrations

### A. Data Modeling Best Practices
- **Primary Keys**: Use UUIDv7 or ULID for distributed systems requiring chronological sorting; use Auto-increment BIGINT only for internal single-node tables.
- **Foreign Key Constraints & Indexes**: Explicitly index all foreign keys, status filters, and composite query fields.
- **Audit Trails**: Every domain table must have `created_at` (TIMESTAMPTZ), `updated_at` (TIMESTAMPTZ), and optional `deleted_at` (soft delete index filter).

### B. Migration Safety (Zero-Downtime)
1. **Never drop columns immediately**: Use the **Expand and Contract pattern**:
   - Phase 1: Add new column (nullable or with default).
   - Phase 2: Dual-write to old and new columns.
   - Phase 3: Backfill historical records.
   - Phase 4: Read from new column only.
   - Phase 5: Drop legacy column.
2. Always wrap migrations in transactional blocks where supported (e.g., PostgreSQL DDL transactions).

---

## 4. Authentication, Authorization & Security Hardening

Implement defense-in-depth adhering to OWASP Top 10 guidelines:

| Domain | Standard Implementation |
| :--- | :--- |
| **Authentication** | Argon2id or bcrypt (cost factor $\ge 12$) for passwords. Short-lived JWT (15 min) in memory + rotating Refresh Token in `HttpOnly`, `Secure`, `SameSite=Strict` cookie. |
| **Authorization** | Role-Based Access Control (RBAC) combined with Attribute-Based Access Control (ABAC) policies. |
| **Injection Defense** | Parameterized queries via ORMs (Prisma, Drizzle, SQLAlchemy) or prepared statements. Never concatenate user strings into SQL. |
| **Cross-Site Scripting (XSS)**| Content Security Policy (CSP) headers, sanitized output, avoid `dangerouslySetInnerHTML` / `v-html`. |
| **Rate Limiting** | Sliding window rate limiting on public and auth endpoints (`express-rate-limit`, Redis token bucket). |
| **CORS** | Explicit allow-list for origins; never use `Access-Control-Allow-Origin: *` in authenticated production APIs. |

See [`references/security_and_auth_checklist.md`](./references/security_and_auth_checklist.md) for security headers and token rotation flows.

---

## 5. Automated Testing Strategy

Follow the testing pyramid to guarantee reliability without slowing development:

```text
      /\
     /  \     5% End-to-End (Playwright / Cypress)
    /----\
   /      \   20% Integration (Supertest, Testcontainers, MSW)
  /--------\
 /          \ 75% Unit Tests (Vitest, Jest, PyTest)
/____________\
```

- **Unit Tests**: Test pure business logic, utility functions, and domain entities in isolation.
- **Integration Tests**: Test repositories against ephemeral test databases (Docker Testcontainers or isolated SQLite in-memory), test API routes with full middleware stacks.
- **E2E Tests**: Test critical user flows (Sign up $\rightarrow$ Checkout $\rightarrow$ Payment confirmation).

Run [`scripts/verify_app_health.py`](./scripts/verify_app_health.py) to audit test coverage and dependency hygiene.

---

## 6. Containerization, DevOps & Observability

### A. Production Multi-Stage Dockerfile Blueprint
```dockerfile
# Stage 1: Dependencies & Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --production

# Stage 2: Minimal Distroless / Alpine Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 appuser
USER appuser
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/healthz || exit 1
CMD ["node", "dist/index.js"]
```

### B. Healthchecks & Telemetry
- Expose `/healthz` (liveness probe) and `/readyz` (readiness probe checking DB/Redis connectivity).
- Log in structured JSON format with contextual trace IDs (`trace_id`, `request_id`, `timestamp`, `level`, `message`).
- Centralize error reporting with exception tracking (Sentry / OpenTelemetry).

---

## 7. Developer Execution Checklist

When tasked with building or refactoring an application:

1. **Requirements & Boundary Clarification**: Identify actors, data flow, throughput expectations, and constraints.
2. **Data & Contract Schema First**: Define DB schema (entities, constraints) and API contracts (TypeScript types, Zod schemas, or OpenAPI specs) before writing logic.
3. **Core Use-Case Implementation**: Implement business services, ensuring pure business logic is decoupled from frameworks.
4. **Integration & Infrastructure Wiring**: Connect ORM/DB repositories, external integrations, and middleware.
5. **Security & Validation Layer**: Add authentication guards, input validation schemas, rate limiting, and sanitization.
6. **Automated Test Coverage**: Write unit tests for business logic and integration tests for route boundaries.
7. **Containerization & CI Verification**: Verify local Docker build runs cleanly and passes health checks.
