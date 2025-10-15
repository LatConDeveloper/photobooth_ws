# PhotoBooth Repository - Best Practices Review

**Date:** October 2025  
**Reviewer:** Code Analysis Agent  
**Scope:** Full-stack PhotoBooth application review

---

## Executive Summary

This document provides a comprehensive review of the PhotoBooth repository, identifying good and bad practices, and recommending improvements based on industry best practices and design patterns.

**Overall Assessment:**
- ✅ Good foundation with modern tech stack
- ⚠️ Several critical areas need improvement for production readiness
- 📈 Strong potential with proper implementation of best practices

---

## Table of Contents

1. [Good Practices](#good-practices)
2. [Bad Practices & Issues](#bad-practices--issues)
3. [Critical Security Concerns](#critical-security-concerns)
4. [Recommended Best Practices](#recommended-best-practices)
5. [Design Patterns to Implement](#design-patterns-to-implement)
6. [Architecture Improvements](#architecture-improvements)
7. [Action Items Priority Matrix](#action-items-priority-matrix)

---

## Good Practices

### ✅ Architecture & Structure

1. **Clear Separation of Concerns**
   - Backend (Hono + Supabase) and Frontend (React Native) are properly separated
   - Monorepo structure with distinct `/server` and `/app-mobile` directories
   - Clear routing structure in backend

2. **Type Safety**
   - TypeScript enabled across both backend and frontend
   - Strict mode enabled in `tsconfig.json` files
   - Type definitions for models and state management

3. **Documentation**
   - Multiple documentation files (README.md, instructions.md, user_stories.md)
   - Clear setup instructions and architecture decisions documented
   - API documentation in server README

4. **State Management**
   - Zustand for global state - lightweight and effective choice
   - Centralized state with clear actions pattern
   - Proper separation of concerns in store structure

5. **Database Design**
   - Well-structured SQL migrations with version control
   - Proper use of foreign keys and constraints
   - Indexes on frequently queried columns
   - Row Level Security (RLS) enabled
   - Trigger functions for `updated_at` columns

6. **Code Organization**
   - Modular route handlers in backend
   - Custom hooks for reusable logic (useIdleTimer)
   - Service layer pattern (api.ts for API calls)

7. **Environment Configuration**
   - `.env.example` files provided
   - Environment variables for configuration
   - Different configs for dev/prod

### ✅ Development Practices

8. **Version Control**
   - Proper `.gitignore` files to exclude sensitive data
   - Conventional commit message format mentioned in docs

9. **Error Handling**
   - Try-catch blocks in route handlers
   - Error interceptors in axios client
   - Fallback to mock data when DB unavailable

10. **Accessibility Considerations**
    - 44pt minimum touch target mentioned in docs
    - Accessible navigation structure

---

## Bad Practices & Issues

### ❌ Critical Issues

1. **No ESLint Configuration in Backend**
   - Server has ESLint defined in package.json but missing `.eslintrc.js`
   - Cannot enforce code quality standards
   - `npm run lint` fails because eslint is not installed globally

2. **Missing Test Infrastructure**
   - Only one placeholder test file in mobile app
   - No backend tests at all
   - No integration tests
   - No API contract tests
   - No end-to-end tests (despite docs mentioning Detox/Maestro)

3. **Hardcoded Configuration Values**
   ```typescript
   // app-mobile/app/config/env.ts
   API_BASE_URL: process.env.API_BASE_URL || 'http://192.168.1.21:3000',
   ```
   - Hardcoded IP address will break for other developers
   - No proper environment variable management (should use react-native-config)

4. **Security Vulnerabilities**
   - Hardcoded admin PIN in comments: `Default is 1234`
   - Service role key used in backend (bypasses RLS)
   - RLS policies too permissive (USING (true) WITH CHECK (true))
   - No API authentication/authorization layer
   - No rate limiting mentioned or implemented
   - CORS allows all localhost ports with wildcard

5. **Error Handling Issues**
   ```typescript
   // Logs but doesn't properly handle errors
   console.error('[API] Response error:', error.response?.data || error.message);
   return Promise.reject(error);
   ```
   - Generic error messages returned to client
   - No structured error response format
   - No error tracking/monitoring integration

6. **Missing Input Validation**
   - Limited use of Zod schema validation
   - Only sessions.ts uses validation, other endpoints don't
   - No request body size limits mentioned
   - No file upload size validation in storage.ts

7. **Inconsistent Code Style**
   - Missing Prettier configuration file in server
   - No unified code formatting across project
   - Mixed console.log and proper logging

8. **Database Connection Management**
   ```typescript
   // server/src/lib/db.ts
   if (!supabaseUrl || !supabaseServiceKey) {
     console.warn('⚠️  Using placeholder Supabase credentials...');
   }
   ```
   - App continues with invalid credentials
   - Should fail fast on startup with proper error

9. **In-Memory Queue Implementation**
   ```typescript
   // server/src/lib/queue.ts
   class SimpleQueue {
     private jobs: Map<string, QueueJob> = new Map();
   ```
   - Not persistent, loses all jobs on restart
   - Not scalable for production
   - No distributed support for multiple instances

10. **API Client Issues**
    - No retry logic for failed requests
    - No request deduplication
    - No caching strategy
    - Hard timeout of 30 seconds might be too aggressive for some operations

### ⚠️ Code Quality Issues

11. **Missing Error Boundaries**
    - React Native app has no error boundaries
    - App will crash on unhandled component errors

12. **No Logging Strategy**
    - Using console.log/console.error throughout
    - No structured logging
    - No log levels
    - No log aggregation for production

13. **Incomplete Payment Provider Implementation**
    ```typescript
    // server/src/lib/payments/stripe.ts
    async createIntent(...): Promise<PaymentIntent> {
      // TODO: Implement with Stripe SDK
      throw new Error('Stripe provider not yet implemented');
    }
    ```
    - Stripe and Square providers are stubs
    - Only demo provider works

14. **No API Versioning**
    - Routes don't include version (e.g., /v1/sessions)
    - Breaking changes would affect all clients

15. **Missing Response Pagination**
    - No pagination for list endpoints
    - Could cause performance issues with large datasets

16. **Type Safety Gaps**
    ```typescript
    metadata?: Record<string, any>  // Using 'any'
    properties: any = {}            // Using 'any'
    ```
    - Several uses of `any` type defeating TypeScript benefits

17. **No Health Check Depth**
    - Health endpoint only checks basic DB connectivity
    - Doesn't check queue, storage, payment providers, etc.

18. **Missing Code Comments**
    - Complex logic not explained
    - Business rules not documented in code
    - No JSDoc for public APIs

19. **No Dependency Injection**
    - Direct imports of singletons (supabase, queue)
    - Makes testing difficult
    - Tight coupling

20. **No CI/CD Configuration**
    - No GitHub Actions workflows
    - No automated testing on PR
    - No automated deployment pipeline

### 🔧 Technical Debt

21. **Backup Directory Committed**
    - `app-mobile-backup/` directory committed to repo
    - Should be excluded from version control

22. **Multiple Documentation Files**
    - Too many overlapping docs: ARCHITECTURE.md, BACKEND_CONFIGURADO.md, PASOS_FINALES.md, PROGRESS.md, etc.
    - Should consolidate and organize better

23. **Shell Scripts Without Error Handling**
    ```bash
    #!/bin/bash
    # No error handling, will continue on failures
    ```

24. **No Performance Monitoring**
    - No APM integration
    - No performance metrics collection
    - No slow query detection

25. **Missing Docker Configuration**
    - Docs mention `/ops/docker` but doesn't exist
    - Would help with consistent dev environments

---

## Critical Security Concerns

### 🔐 High Priority Security Issues

1. **Authentication & Authorization**
   - **Issue:** No authentication layer for API endpoints
   - **Risk:** Anyone can create sessions, access data
   - **Fix:** Implement API key authentication or JWT tokens

2. **RLS Policy Weaknesses**
   ```sql
   CREATE POLICY "Session access for photos"
     ON photos FOR ALL
     USING (true)  -- Allows access to ALL records
     WITH CHECK (true);
   ```
   - **Issue:** RLS policies allow unrestricted access
   - **Risk:** Data can be accessed/modified without proper authorization
   - **Fix:** Implement proper session-based policies

3. **Sensitive Data Exposure**
   - **Issue:** Stack traces and error details exposed to clients
   - **Risk:** Information disclosure
   - **Fix:** Return generic errors to clients, log details server-side

4. **No Request Rate Limiting**
   - **Issue:** No protection against abuse
   - **Risk:** DoS attacks, API abuse
   - **Fix:** Implement rate limiting middleware

5. **CORS Configuration**
   ```typescript
   if (origin.includes('localhost')) return origin;
   ```
   - **Issue:** Too permissive, allows any localhost origin
   - **Risk:** Cross-origin attacks from compromised localhost apps
   - **Fix:** Whitelist specific ports/domains

6. **No Input Sanitization**
   - **Issue:** User input not sanitized before storage
   - **Risk:** XSS, SQL injection (if raw queries used)
   - **Fix:** Implement input sanitization and validation

7. **Service Role Key in Backend**
   - **Issue:** Using service role key bypasses all RLS
   - **Risk:** If backend compromised, full database access
   - **Fix:** Use anon key where possible, implement proper auth

8. **No Secrets Management**
   - **Issue:** .env files must be manually created
   - **Risk:** Secrets committed by accident
   - **Fix:** Use secrets management service (AWS Secrets Manager, etc.)

9. **Missing Security Headers**
   - **Issue:** No security headers configured
   - **Risk:** Various web security vulnerabilities
   - **Fix:** Add helmet middleware or equivalent

10. **No Audit Logging**
    - **Issue:** No audit trail for sensitive operations
    - **Risk:** Cannot track unauthorized access or changes
    - **Fix:** Implement comprehensive audit logging

---

## Recommended Best Practices

### 📋 Immediate Actions

#### 1. Add Backend ESLint Configuration

**Create `.eslintrc.js` in server directory:**

```javascript
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'no-console': ['warn', { allow: ['error', 'warn'] }],
  },
};
```

#### 2. Add Prettier Configuration

**Create `.prettierrc.json` in root:**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

#### 3. Implement Proper Environment Management

**For mobile app, install and configure react-native-config:**

```bash
npm install react-native-config
```

**Create `.env` files for different environments:**
- `.env.development`
- `.env.staging`
- `.env.production`

#### 4. Add Input Validation

**Create shared validation schemas:**

```typescript
// server/src/lib/validation.ts
import { z } from 'zod';

export const createSessionSchema = z.object({
  device_id: z.string().min(1).max(255).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const uploadPhotoSchema = z.object({
  session_id: z.string().min(1),
  layout_id: z.string().min(1),
  shot_number: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  session_id: z.string().min(1),
  items: z.array(z.object({
    type: z.enum(['digital', 'print']),
    quantity: z.number().int().positive(),
    unit_price: z.number().int().nonnegative(),
  })).min(1),
});
```

#### 5. Implement Structured Logging

**Install and configure a logger:**

```bash
npm install pino pino-pretty
```

```typescript
// server/src/lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
});
```

#### 6. Add API Authentication Middleware

```typescript
// server/src/middleware/auth.ts
import { Context, Next } from 'hono';

export async function requireAuth(c: Context, next: Next) {
  const apiKey = c.req.header('X-API-Key');
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  await next();
}
```

#### 7. Implement Rate Limiting

```typescript
// server/src/middleware/rateLimit.ts
import { RateLimiter } from 'limiter';

const limiter = new RateLimiter({
  tokensPerInterval: 100,
  interval: 'minute',
});

export async function rateLimit(c: Context, next: Next) {
  const remaining = await limiter.removeTokens(1);
  
  if (remaining < 0) {
    return c.json({ error: 'Too many requests' }, 429);
  }
  
  await next();
}
```

#### 8. Add Error Boundaries

```typescript
// app-mobile/app/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Button } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong</Text>
          <Button 
            title="Restart App" 
            onPress={() => this.setState({ hasError: false })} 
          />
        </View>
      );
    }

    return this.props.children;
  }
}
```

#### 9. Implement Proper Health Checks

```typescript
// server/src/routes/health.ts
interface HealthCheckResult {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  services: {
    database: 'ok' | 'error';
    storage: 'ok' | 'error';
    queue: 'ok' | 'error';
  };
  version: string;
}

health.get('/', async (c) => {
  const checks: HealthCheckResult = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'ok',
      storage: 'ok',
      queue: 'ok',
    },
    version: '1.0.0',
  };

  // Check database
  try {
    await supabase.from('sessions').select('count').limit(1);
  } catch (error) {
    checks.services.database = 'error';
    checks.status = 'error';
  }

  // Check storage
  try {
    await supabase.storage.from('photos').list('', { limit: 1 });
  } catch (error) {
    checks.services.storage = 'error';
    checks.status = 'degraded';
  }

  // Check queue
  const queueStats = queue.getStats();
  if (queueStats.total > 1000) {
    checks.status = 'degraded';
  }

  const statusCode = checks.status === 'ok' ? 200 : checks.status === 'degraded' ? 200 : 503;
  return c.json(checks, statusCode);
});
```

#### 10. Add API Versioning

```typescript
// server/src/index.ts
const v1 = new Hono();
v1.route('/health', health);
v1.route('/catalogs', catalogs);
v1.route('/sessions', sessions);

app.route('/v1', v1);
```

---

## Design Patterns to Implement

### 1. Repository Pattern

**Benefits:**
- Abstracts data access logic
- Makes testing easier
- Centralizes data access logic
- Easier to switch data sources

**Implementation:**

```typescript
// server/src/repositories/SessionRepository.ts
export interface ISessionRepository {
  create(session: CreateSessionDTO): Promise<Session>;
  findById(id: string): Promise<Session | null>;
  update(id: string, data: Partial<Session>): Promise<Session>;
  delete(id: string): Promise<void>;
}

export class SupabaseSessionRepository implements ISessionRepository {
  constructor(private db: SupabaseClient) {}

  async create(session: CreateSessionDTO): Promise<Session> {
    const { data, error } = await this.db
      .from('sessions')
      .insert(session)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // ... other methods
}
```

### 2. Factory Pattern (Already Partially Implemented)

**Current state:** Payment providers use factory pattern  
**Improvement needed:** Make it more robust

```typescript
// server/src/lib/payments/factory.ts
export class PaymentProviderFactory {
  private static providers: Map<string, PaymentsProvider> = new Map();

  static create(provider: string): PaymentsProvider {
    if (this.providers.has(provider)) {
      return this.providers.get(provider)!;
    }

    let instance: PaymentsProvider;
    
    switch (provider) {
      case 'stripe':
        instance = new StripePaymentsProvider(
          process.env.STRIPE_SECRET || ''
        );
        break;
      case 'square':
        instance = new SquarePaymentsProvider(
          process.env.SQUARE_ACCESS_TOKEN || ''
        );
        break;
      case 'demo':
      default:
        instance = new DemoPaymentsProvider();
    }

    this.providers.set(provider, instance);
    return instance;
  }
}
```

### 3. Strategy Pattern for Image Processing

**Use case:** Different photo processing strategies

```typescript
// server/src/lib/processing/strategies.ts
export interface ProcessingStrategy {
  process(image: Buffer, options: ProcessingOptions): Promise<Buffer>;
}

export class FilterStrategy implements ProcessingStrategy {
  async process(image: Buffer, options: ProcessingOptions): Promise<Buffer> {
    // Apply filters
  }
}

export class OverlayStrategy implements ProcessingStrategy {
  async process(image: Buffer, options: ProcessingOptions): Promise<Buffer> {
    // Apply overlay
  }
}

export class PhotoProcessor {
  private strategies: ProcessingStrategy[] = [];

  addStrategy(strategy: ProcessingStrategy) {
    this.strategies.push(strategy);
    return this;
  }

  async process(image: Buffer, options: ProcessingOptions): Promise<Buffer> {
    let result = image;
    for (const strategy of this.strategies) {
      result = await strategy.process(result, options);
    }
    return result;
  }
}
```

### 4. Observer Pattern for Event System

**Use case:** Track user actions, analytics

```typescript
// server/src/lib/events/EventEmitter.ts
export class EventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }
}

// Usage
events.on('session.created', async (session) => {
  await analytics.track('Session Created', { sessionId: session.id });
});
```

### 5. Decorator Pattern for Middleware

**Use case:** Add cross-cutting concerns

```typescript
// server/src/middleware/decorators.ts
export function withLogging(handler: Function) {
  return async (c: Context) => {
    const start = Date.now();
    const result = await handler(c);
    const duration = Date.now() - start;
    logger.info({ path: c.req.path, duration }, 'Request completed');
    return result;
  };
}

export function withValidation(schema: z.ZodSchema) {
  return async (handler: Function) => {
    return async (c: Context) => {
      const body = await c.req.json();
      const validated = schema.parse(body);
      c.set('validated', validated);
      return handler(c);
    };
  };
}
```

### 6. Builder Pattern for Complex Objects

**Use case:** Building order objects

```typescript
// app-mobile/app/builders/OrderBuilder.ts
export class OrderBuilder {
  private order: Partial<Order> = {};

  setSessionId(sessionId: string) {
    this.order.session_id = sessionId;
    return this;
  }

  addItem(item: OrderItem) {
    this.order.items = [...(this.order.items || []), item];
    return this;
  }

  setDeliveryInfo(info: DeliveryInfo) {
    this.order.delivery = info;
    return this;
  }

  calculateTotals() {
    const subtotal = this.order.items?.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    ) || 0;
    const tax = Math.round(subtotal * 0.08);
    this.order.subtotal = subtotal;
    this.order.tax = tax;
    this.order.total = subtotal + tax;
    return this;
  }

  build(): Order {
    if (!this.order.session_id || !this.order.items?.length) {
      throw new Error('Invalid order: missing required fields');
    }
    return this.order as Order;
  }
}
```

### 7. Singleton Pattern (Already Used, But Improve)

**Current state:** Used for API client, queue  
**Improvement:** Make it testable

```typescript
// server/src/lib/db.ts
export class DatabaseClient {
  private static instance: DatabaseClient;
  private client: SupabaseClient;

  private constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }

  static getInstance(): DatabaseClient {
    if (!this.instance) {
      this.instance = new DatabaseClient();
    }
    return this.instance;
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  // For testing
  static reset() {
    this.instance = null as any;
  }
}
```

### 8. Chain of Responsibility for Request Processing

**Use case:** Middleware chain

```typescript
// server/src/middleware/chain.ts
export interface Middleware {
  handle(request: Request, next: () => Promise<Response>): Promise<Response>;
}

export class AuthMiddleware implements Middleware {
  async handle(request: Request, next: () => Promise<Response>) {
    // Check auth
    if (!isAuthenticated(request)) {
      return new Response('Unauthorized', { status: 401 });
    }
    return next();
  }
}

export class LoggingMiddleware implements Middleware {
  async handle(request: Request, next: () => Promise<Response>) {
    const start = Date.now();
    const response = await next();
    logger.info({ duration: Date.now() - start });
    return response;
  }
}
```

---

## Architecture Improvements

### 1. Implement Clean Architecture / Hexagonal Architecture

**Current structure:**
```
server/src/
  routes/
  lib/
  index.ts
```

**Improved structure:**
```
server/src/
  domain/              # Business logic, entities
    entities/
    repositories/      # Interfaces
    services/          # Business logic
  application/         # Use cases
    commands/
    queries/
  infrastructure/      # External dependencies
    database/
    storage/
    payments/
    queue/
  presentation/        # API layer
    routes/
    middleware/
    validators/
  index.ts
```

**Benefits:**
- Better separation of concerns
- Easier to test
- More maintainable
- Independent of frameworks

### 2. Implement CQRS (Command Query Responsibility Segregation)

**Separate read and write operations:**

```typescript
// Commands (writes)
export class CreateSessionCommand {
  constructor(public deviceId?: string) {}
}

export class CreateSessionHandler {
  async execute(command: CreateSessionCommand): Promise<Session> {
    // Create session
  }
}

// Queries (reads)
export class GetSessionQuery {
  constructor(public sessionId: string) {}
}

export class GetSessionHandler {
  async execute(query: GetSessionQuery): Promise<Session> {
    // Get session
  }
}
```

**Benefits:**
- Optimized read/write paths
- Better scalability
- Easier to cache queries

### 3. Add Service Layer

**Current:** Routes directly access database  
**Better:** Routes → Services → Repositories

```typescript
// server/src/domain/services/SessionService.ts
export class SessionService {
  constructor(
    private sessionRepo: ISessionRepository,
    private eventBus: IEventBus
  ) {}

  async createSession(deviceId?: string): Promise<Session> {
    const sessionId = this.generateSessionId();
    const expiresAt = this.calculateExpiry();
    
    const session = await this.sessionRepo.create({
      id: sessionId,
      device_id: deviceId,
      expires_at: expiresAt,
      status: 'active',
    });

    await this.eventBus.emit('session.created', session);
    
    return session;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${crypto.randomUUID()}`;
  }

  private calculateExpiry(): Date {
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
}
```

### 4. Implement API Gateway Pattern

**For microservices future:**
- Single entry point
- Authentication/authorization
- Rate limiting
- Request/response transformation
- Caching

### 5. Add Background Job Processing

**Replace in-memory queue with proper solution:**

```typescript
// Using BullMQ or similar
import { Queue, Worker } from 'bullmq';

const photoProcessingQueue = new Queue('photo-processing', {
  connection: redisConnection,
});

const worker = new Worker('photo-processing', async (job) => {
  const { photoId, filters } = job.data;
  await processPhoto(photoId, filters);
}, {
  connection: redisConnection,
});
```

### 6. Implement Event Sourcing (for critical operations)

**Store all state changes as events:**

```typescript
export interface Event {
  id: string;
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  payload: unknown;
  timestamp: Date;
  version: number;
}

// Example: Order events
interface OrderCreated extends Event {
  eventType: 'OrderCreated';
  payload: { sessionId: string; items: OrderItem[] };
}

interface OrderPaid extends Event {
  eventType: 'OrderPaid';
  payload: { paymentId: string; amount: number };
}
```

**Benefits:**
- Complete audit trail
- Can rebuild state from events
- Time travel debugging
- Analytics

### 7. Add API Gateway for Mobile

**Benefits:**
- Backend for Frontend (BFF) pattern
- Aggregate multiple API calls
- Transform responses for mobile needs
- Reduce mobile network calls

---

## Action Items Priority Matrix

### 🔴 Critical (Do Immediately)

| Priority | Item | Impact | Effort | Timeline |
|----------|------|--------|--------|----------|
| P0 | Fix RLS policies - implement proper session validation | High | Medium | 1-2 days |
| P0 | Add API authentication/authorization | High | Medium | 2-3 days |
| P0 | Add rate limiting | High | Low | 1 day |
| P0 | Remove hardcoded credentials and IPs | High | Low | 1 day |
| P0 | Fix CORS configuration | Medium | Low | 1 day |
| P0 | Add input validation to all endpoints | High | Medium | 2-3 days |

### 🟡 High Priority (Do This Sprint)

| Priority | Item | Impact | Effort | Timeline |
|----------|------|--------|--------|----------|
| P1 | Add ESLint configuration for server | Medium | Low | 1 day |
| P1 | Implement structured logging | Medium | Low | 1-2 days |
| P1 | Add error boundaries in mobile app | Medium | Low | 1 day |
| P1 | Create comprehensive test suite | High | High | 1-2 weeks |
| P1 | Replace in-memory queue with Redis/BullMQ | High | Medium | 3-4 days |
| P1 | Add proper environment management | Medium | Medium | 2-3 days |
| P1 | Implement health checks with depth | Medium | Low | 1 day |

### 🟢 Medium Priority (Do Next Sprint)

| Priority | Item | Impact | Effort | Timeline |
|----------|------|--------|--------|----------|
| P2 | Add API versioning | Medium | Low | 1 day |
| P2 | Implement repository pattern | Medium | High | 1 week |
| P2 | Add pagination to list endpoints | Medium | Low | 1-2 days |
| P2 | Implement proper error handling strategy | Medium | Medium | 2-3 days |
| P2 | Add Prettier configuration | Low | Low | 1 day |
| P2 | Remove backup directory from repo | Low | Low | 1 hour |
| P2 | Consolidate documentation | Low | Medium | 2-3 days |

### 🔵 Low Priority (Nice to Have)

| Priority | Item | Impact | Effort | Timeline |
|----------|------|--------|--------|----------|
| P3 | Implement CQRS pattern | Medium | High | 2 weeks |
| P3 | Add event sourcing | Low | High | 2-3 weeks |
| P3 | Implement clean architecture | Medium | High | 3-4 weeks |
| P3 | Add Docker configuration | Medium | Medium | 1 week |
| P3 | Implement CI/CD pipeline | Medium | Medium | 1 week |
| P3 | Add APM/monitoring | Medium | Medium | 1 week |

---

## Testing Strategy Recommendations

### Backend Testing

1. **Unit Tests**
   ```typescript
   // Example: SessionService.test.ts
   describe('SessionService', () => {
     let service: SessionService;
     let mockRepo: jest.Mocked<ISessionRepository>;

     beforeEach(() => {
       mockRepo = {
         create: jest.fn(),
         findById: jest.fn(),
       };
       service = new SessionService(mockRepo, mockEventBus);
     });

     it('should create session with expiry', async () => {
       const session = await service.createSession('device-123');
       expect(mockRepo.create).toHaveBeenCalledWith(
         expect.objectContaining({
           device_id: 'device-123',
           status: 'active',
         })
       );
     });
   });
   ```

2. **Integration Tests**
   ```typescript
   // Example: sessions.integration.test.ts
   describe('POST /sessions', () => {
     it('should create new session', async () => {
       const response = await request(app)
         .post('/v1/sessions')
         .send({ device_id: 'test-device' })
         .expect(201);
       
       expect(response.body).toHaveProperty('session_id');
       expect(response.body).toHaveProperty('expires_at');
     });
   });
   ```

3. **Contract Tests**
   - Use Pact or similar for API contract testing
   - Ensure frontend and backend stay in sync

### Frontend Testing

1. **Component Tests**
   ```typescript
   // Example: AttractScreen.test.tsx
   describe('AttractScreen', () => {
     it('should show tap to start message', () => {
       const { getByText } = render(<AttractScreen />);
       expect(getByText('TAP TO START')).toBeTruthy();
     });

     it('should navigate on tap', async () => {
       const navigate = jest.fn();
       const { getByTestId } = render(
         <AttractScreen navigation={{ navigate }} />
       );
       
       fireEvent.press(getByTestId('start-button'));
       expect(navigate).toHaveBeenCalledWith('Layout');
     });
   });
   ```

2. **E2E Tests**
   ```typescript
   // Using Detox
   describe('PhotoBooth Flow', () => {
     beforeEach(async () => {
       await device.reloadReactNative();
     });

     it('should complete full flow', async () => {
       await element(by.id('start-button')).tap();
       await expect(element(by.id('layout-screen'))).toBeVisible();
       
       await element(by.id('layout-1')).tap();
       await expect(element(by.id('capture-screen'))).toBeVisible();
       
       // Continue flow...
     });
   });
   ```

### Test Coverage Goals

- **Backend:** Aim for 80%+ coverage
- **Frontend:** Aim for 70%+ coverage
- **Critical paths:** 100% coverage (payment, data persistence)

---

## Performance Optimization Recommendations

### 1. Database Optimization

```sql
-- Add composite indexes for common queries
CREATE INDEX idx_photos_session_layout 
  ON photos(session_id, layout_id);

CREATE INDEX idx_orders_session_status 
  ON orders(session_id, status);

-- Add partial indexes for better performance
CREATE INDEX idx_active_sessions 
  ON sessions(created_at) 
  WHERE status = 'active';
```

### 2. API Response Caching

```typescript
// Add caching middleware
import { cache } from 'hono/cache';

catalogs.get('/layouts', 
  cache({
    cacheName: 'layouts',
    cacheControl: 'max-age=3600', // 1 hour
  }),
  async (c) => {
    // Handler
  }
);
```

### 3. Image Optimization

- Compress images before upload
- Generate thumbnails asynchronously
- Use CDN for serving images
- Implement lazy loading in mobile app

### 4. Mobile App Performance

```typescript
// Use React.memo for expensive components
export const LayoutCard = React.memo(({ layout }: Props) => {
  // Component code
});

// Use useMemo for expensive calculations
const filteredLayouts = useMemo(
  () => layouts.filter(l => l.enabled),
  [layouts]
);

// Use useCallback for event handlers
const handlePress = useCallback(() => {
  navigation.navigate('Capture');
}, [navigation]);
```

### 5. Implement Connection Pooling

```typescript
// For database connections
const supabase = createClient(url, key, {
  db: {
    schema: 'public',
  },
  global: {
    headers: { 'x-application-name': 'photobooth' },
  },
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
```

---

## Monitoring & Observability

### 1. Implement Structured Logging

```typescript
// Use correlation IDs
app.use('*', async (c, next) => {
  const correlationId = c.req.header('X-Correlation-ID') || crypto.randomUUID();
  c.set('correlationId', correlationId);
  
  logger.child({ correlationId }).info('Request started');
  await next();
});
```

### 2. Add Metrics Collection

```typescript
// server/src/lib/metrics.ts
import { Counter, Histogram } from 'prom-client';

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

export const sessionsCreated = new Counter({
  name: 'sessions_created_total',
  help: 'Total number of sessions created',
});
```

### 3. Add Error Tracking

```typescript
// Integrate Sentry or similar
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.onError((err, c) => {
  Sentry.captureException(err);
  return c.json({ error: 'Internal server error' }, 500);
});
```

### 4. Add Health Monitoring

- Set up uptime monitoring (UptimeRobot, etc.)
- Alert on failed health checks
- Monitor queue depth
- Track database connection pool

---

## Security Checklist

- [ ] Implement API authentication
- [ ] Fix RLS policies with proper session validation
- [ ] Add rate limiting
- [ ] Implement request validation on all endpoints
- [ ] Add CSRF protection
- [ ] Implement security headers (helmet)
- [ ] Sanitize user input
- [ ] Use parameterized queries (already done via Supabase)
- [ ] Implement audit logging
- [ ] Add secrets management
- [ ] Enable HTTPS only in production
- [ ] Implement proper CORS configuration
- [ ] Add file upload validation and scanning
- [ ] Implement session timeout and rotation
- [ ] Add brute force protection on PIN entry
- [ ] Encrypt sensitive data at rest
- [ ] Implement secure password hashing (if adding user auth)
- [ ] Add Content Security Policy
- [ ] Implement SQL injection protection
- [ ] Add XSS protection

---

## Deployment Best Practices

### 1. Environment Configuration

```yaml
# Example: docker-compose.yml
version: '3.8'
services:
  server:
    build: ./server
    environment:
      - NODE_ENV=production
      - PORT=8787
    env_file:
      - .env.production
    restart: unless-stopped
    
  redis:
    image: redis:7-alpine
    restart: unless-stopped
```

### 2. CI/CD Pipeline

```yaml
# Example: .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd server && npm ci
          cd ../app-mobile && npm ci
      
      - name: Lint
        run: |
          cd server && npm run lint
          cd ../app-mobile && npm run lint
      
      - name: Test
        run: |
          cd server && npm test
          cd ../app-mobile && npm test
      
      - name: Build
        run: |
          cd server && npm run build
```

### 3. Database Migrations

```typescript
// Use migration tool
import { migrate } from '@supabase/migrations';

// Run migrations on deploy
await migrate(supabase, {
  migrationsPath: './ops/supabase/migrations',
});
```

### 4. Blue-Green Deployment

- Deploy new version alongside old
- Test new version
- Switch traffic gradually
- Keep old version ready for rollback

---

## Conclusion

### Summary of Findings

**Strengths:**
- Solid technology choices (TypeScript, React Native, Hono, Supabase)
- Good project structure foundation
- Comprehensive documentation
- Modern state management approach

**Critical Issues:**
- Security vulnerabilities (RLS, authentication, rate limiting)
- Missing test infrastructure
- Configuration management issues
- Production readiness concerns

**Recommended Focus Areas:**
1. **Security First:** Fix authentication, RLS policies, and input validation
2. **Quality Assurance:** Implement comprehensive testing
3. **Production Readiness:** Add monitoring, logging, and error handling
4. **Code Quality:** Add linting, formatting, and type safety improvements
5. **Architecture:** Implement design patterns and clean architecture principles

### Next Steps

1. **Week 1-2:** Address critical security issues (P0 items)
2. **Week 3-4:** Implement testing infrastructure and add tests
3. **Week 5-6:** Refactor for design patterns and architecture improvements
4. **Week 7-8:** Add monitoring, logging, and production hardening
5. **Week 9+:** Ongoing improvements and optimization

### Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Native Best Practices](https://reactnative.dev/docs/performance)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [API Security Checklist](https://github.com/shieldfy/API-Security-Checklist)

---

**Document Version:** 1.0  
**Last Updated:** October 2025  
**Reviewers:** AI Code Analysis Agent
