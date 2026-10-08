# Software Architecture & System Design Patterns

This guide formalizes enterprise software architecture design patterns for scalable, maintainable application development.

---

## 1. Clean Architecture & Hexagonal (Ports & Adapters)

Clean Architecture enforces the **Inversion of Control (IoC)**, ensuring that core business entities and use cases are isolated from frameworks, databases, and external libraries.

### Folder Structure Blueprint
```text
src/
├── domain/                      # Enterprise Business Rules
│   ├── entities/               # User, Order, Product
│   ├── value-objects/          # Email, Money, UUID
│   └── exceptions/             # DomainException, InsufficientFundsException
├── application/                 # Application Business Rules (Use Cases)
│   ├── use-cases/              # CreateUserUseCase, ProcessOrderUseCase
│   ├── ports/
│   │   ├── in/                 # Primary ports (Use Case interfaces)
│   │   └── out/                # Secondary ports (Repository interfaces, Notifier interfaces)
│   └── dtos/                   # CreateUserCommand, OrderResponseDTO
├── infrastructure/              # Frameworks, Drivers & External Services
│   ├── database/
│   │   ├── prisma/             # Schema & migrations
│   │   └── repositories/       # PrismaUserRepository implements UserRepositoryPort
│   ├── external-services/      # StripePaymentGateway implements PaymentPort
│   └── cache/                  # RedisCacheService
└── presentation/                # Adapters & Entrypoints
    ├── http/
    │   ├── controllers/        # UserController, OrderController
    │   ├── middlewares/        # AuthMiddleware, ErrorHandler
    │   └── routes/             # userRoutes, orderRoutes
    └── dtos/                   # HTTP Request/Response validation schemas (Zod/Pydantic)
```

---

## 2. Feature-Sliced Design (FSD) for Frontend & Modular Apps

When developing modular applications (Next.js, React, Vue), organize by functional slice rather than technical type:

```text
src/
├── app/            # App setup, providers, routing, global styles
├── pages/          # Full page views composed of widgets and features
├── widgets/        # Self-contained composite UI blocks (Header, Sidebar, OrderFeed)
├── features/       # User interaction actions (AddToCart, AuthByEmail, SearchFilter)
├── entities/       # Domain representations (UserCard, ProductItem, OrderRow)
└── shared/         # Reusable low-level utilities, UI kit, API clients (Button, Input, apiClient)
```

**FSD Rules**:
1. Lower layers cannot import from higher layers (`shared` cannot import from `features` or `widgets`).
2. Slices in the same layer cannot import from sibling slices directly—they must communicate through higher layers or shared state contracts.

---

## 3. Asynchronous Messaging & Event-Driven Patterns

For decoupling long-running jobs (emails, billing processing, analytics ingestion):
- **Outbox Pattern**: Write the domain entity change and an outbox event into the *same database transaction*. A background worker reads the outbox table and dispatches events to Kafka / RabbitMQ / SQS to guarantee at-least-once delivery without distributed 2PC locking.
- **Idempotency Keys**: Accept `Idempotency-Key` headers in mutating HTTP endpoints (e.g., payments). Store the processed key in Redis with a 24-hour TTL and return the cached response for replayed requests.
