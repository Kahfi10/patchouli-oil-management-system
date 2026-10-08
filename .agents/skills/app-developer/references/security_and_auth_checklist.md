# Application Security & Authentication Checklist

This reference provides a security hardening checklist adhering to OWASP Top 10 guidelines.

---

## 1. Authentication Architecture

### Dual-Token Architecture (JWT + Refresh Token)
```text
Client                       API Gateway / Auth Service                  DB / Redis
  │                                      │                                    │
  ├─── 1. Login (credentials) ──────────>│                                    │
  │                                      ├─── Validate hash (Argon2id) ──────>│
  │                                      ├─── Generate Access Token (15m)     │
  │                                      ├─── Generate Refresh Token (7d) ───>│ (Save session)
  │<── 2. Return Access Token (body) ────┤                                    │
  │       Set Refresh Token (cookie) ────┤                                    │
  │                                      │                                    │
  ├─── 3. Request API (Bearer token) ───>│ (Verify signature locally)         │
  │<── 4. 200 OK Response ───────────────┤                                    │
  │                                      │                                    │
  ├─── 5. Refresh (cookie sent) ────────>│                                    │
  │                                      ├─── Check revocation list in Redis ─>│
  │                                      ├─── Rotate Refresh Token            │
  │<── 6. New Access Token & Cookie ─────┤                                    │
```

- **Cookie Flags**: `HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh`.

---

## 2. OWASP Top 10 Mitigation Checklist

- [ ] **A01: Broken Access Control**: Verify object-level ownership on every query (e.g. `WHERE id = :id AND tenant_id = :current_tenant_id`). Never trust client-supplied IDs for authorization.
- [ ] **A02: Cryptographic Failures**: Enforce TLS 1.3, AES-256-GCM for encrypted fields at rest, Argon2id/bcrypt for password hashes.
- [ ] **A03: Injection**: Use parameterized queries exclusively. Validate input types and boundaries using schema validation.
- [ ] **A04: Insecure Design**: Enforce rate limits on brute-force sensitive routes (login, OTP, forgot password).
- [ ] **A05: Security Misconfiguration**: Set security headers using Helmet or reverse proxy:
  - `Content-Security-Policy: default-src 'self'`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- [ ] **A07: Identification and Authentication Failures**: Enforce multi-factor authentication (MFA) for privileged accounts; invalidate sessions immediately upon password change.
- [ ] **A09: Security Logging & Monitoring**: Log all authentication failures and administrative actions with user ID, IP address, and timestamp.
