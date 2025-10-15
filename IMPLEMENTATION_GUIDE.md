# Quick Reference Guide - Implementing Best Practices

This guide provides ready-to-use code snippets and commands to implement the recommendations from the Best Practices Review.

---

## Table of Contents

1. [Quick Start - Critical Fixes](#quick-start---critical-fixes)
2. [ESLint & Prettier Setup](#eslint--prettier-setup)
3. [Environment Management](#environment-management)
4. [Input Validation Examples](#input-validation-examples)
5. [Logging Implementation](#logging-implementation)
6. [Authentication & Security](#authentication--security)
7. [Testing Setup](#testing-setup)
8. [Error Handling Patterns](#error-handling-patterns)

---

## Quick Start - Critical Fixes

### Step 1: Install Missing Dependencies

```bash
# Backend
cd server
npm install eslint-config-prettier pino pino-pretty @types/pino limiter zod

# Mobile
cd ../app-mobile
npm install react-native-config
```

### Step 2: Create Missing Config Files

Run these commands to create essential configuration files:

```bash
# Create server .eslintrc.js
cat > server/.eslintrc.js << 'EOF'
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
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': ['warn', { allow: ['error', 'warn', 'info'] }],
  },
};
EOF

# Create root .prettierrc.json
cat > .prettierrc.json << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
EOF

# Create .prettierignore
cat > .prettierignore << 'EOF'
node_modules
dist
build
coverage
*.lock
.git
EOF
```

---

## ESLint & Prettier Setup

### Server ESLint Configuration (Complete)

```javascript
// server/.eslintrc.js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  rules: {
    // Type safety
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': ['warn', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
    }],
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    
    // Code quality
    'no-console': ['warn', { allow: ['error', 'warn', 'info'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Async/await
    'require-await': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    
    // Naming conventions
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
    ],
  },
  ignorePatterns: ['dist', 'node_modules', '*.js'],
};
```

### Update package.json Scripts

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\"",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## Environment Management

### Server: Environment Variables with Validation

```typescript
// server/src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('8787'),
  HOST: z.string().default('0.0.0.0'),
  
  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_KEY: z.string().min(1),
  SUPABASE_ANON_KEY: z.string().min(1),
  
  // Payments
  PAYMENTS_PROVIDER: z.enum(['demo', 'stripe', 'square']).default('demo'),
  STRIPE_SECRET: z.string().optional(),
  SQUARE_ACCESS_TOKEN: z.string().optional(),
  
  // Security
  API_KEY: z.string().min(32),
  ALLOWED_ORIGINS: z.string().default('http://localhost:*'),
  
  // Optional
  REDIS_URL: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = loadEnv();
```

### Update server/src/index.ts

```typescript
import 'dotenv/config';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

// Validate environment on startup
logger.info({ env: env.NODE_ENV }, 'Environment loaded successfully');
```

### Mobile: React Native Config Setup

```bash
# Install react-native-config
cd app-mobile
npm install react-native-config
npx pod-install # iOS only
```

Create environment files:

```bash
# .env.development
API_BASE_URL=http://localhost:8787
PAYMENTS_PROVIDER=demo
MAX_RETAKES=2
SCREEN_TIMEOUTS={"Attract":30,"Layout":45,"Capture":60,"Customize":60,"Product":120,"Checkout":180}

# .env.production
API_BASE_URL=https://api.photobooth.com
PAYMENTS_PROVIDER=stripe
MAX_RETAKES=2
SCREEN_TIMEOUTS={"Attract":30,"Layout":45,"Capture":60,"Customize":60,"Product":120,"Checkout":180}
```

Update mobile config:

```typescript
// app-mobile/app/config/env.ts
import Config from 'react-native-config';

export const ENV = {
  API_BASE_URL: Config.API_BASE_URL || 'http://localhost:8787',
  PAYMENTS_PROVIDER: Config.PAYMENTS_PROVIDER || 'demo',
  MAX_RETAKES: parseInt(Config.MAX_RETAKES || '2', 10),
  SCREEN_TIMEOUTS: JSON.parse(
    Config.SCREEN_TIMEOUTS || 
    '{"Attract":30,"Layout":45,"Capture":60,"Customize":60,"Product":120,"Checkout":180}'
  ),
};
```

---

## Input Validation Examples

### Create Validation Schemas

```typescript
// server/src/validators/schemas.ts
import { z } from 'zod';

// Session schemas
export const createSessionSchema = z.object({
  device_id: z.string().min(1).max(255).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const getSessionSchema = z.object({
  id: z.string().min(1),
});

// Photo schemas
export const uploadPhotoSchema = z.object({
  session_id: z.string().min(1),
  layout_id: z.string().min(1),
  template_id: z.string().min(1).optional(),
  shot_number: z.number().int().positive().max(10),
  filters: z.array(z.string()).optional(),
});

// Order schemas
export const createOrderSchema = z.object({
  session_id: z.string().min(1),
  items: z.array(z.object({
    type: z.enum(['digital', 'print']),
    photo_id: z.string().uuid().optional(),
    quantity: z.number().int().positive().max(100),
    unit_price: z.number().int().nonnegative(),
  })).min(1).max(50),
});

// Delivery schemas
export const createDeliverySchema = z.object({
  order_id: z.string().uuid(),
  type: z.enum(['email', 'sms', 'qr', 'airdrop']),
  recipient: z.string().min(1).max(255).refine((val) => {
    // Validate email or phone based on type
    if (val.includes('@')) {
      return z.string().email().safeParse(val).success;
    }
    return true;
  }),
});
```

### Validation Middleware

```typescript
// server/src/middleware/validate.ts
import { Context, Next } from 'hono';
import { z } from 'zod';

export function validate<T extends z.ZodSchema>(schema: T) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const validated = schema.parse(body);
      c.set('validated', validated);
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          {
            error: 'Validation failed',
            details: error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          400
        );
      }
      throw error;
    }
  };
}

// Usage in routes
import { validate } from '../middleware/validate.js';
import { createSessionSchema } from '../validators/schemas.js';

sessions.post('/', validate(createSessionSchema), async (c) => {
  const validated = c.get('validated');
  // Now 'validated' is type-safe
});
```

---

## Logging Implementation

### Setup Pino Logger

```typescript
// server/src/lib/logger.ts
import pino from 'pino';
import { env } from '../config/env.js';

const isDevelopment = env.NODE_ENV === 'development';

export const logger = pino({
  level: env.LOG_LEVEL,
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }),
  base: {
    env: env.NODE_ENV,
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
  // Redact sensitive fields
  redact: {
    paths: ['req.headers.authorization', 'req.headers["x-api-key"]'],
    censor: '[REDACTED]',
  },
});

// Create child loggers for different contexts
export function createLogger(context: string) {
  return logger.child({ context });
}
```

### Use Logger in Application

```typescript
// server/src/index.ts
import { logger } from './lib/logger.js';

// Replace all console.log with logger
logger.info({ port: env.PORT }, 'Server starting');

// In routes
import { createLogger } from '../lib/logger.js';

const log = createLogger('sessions');

sessions.post('/', async (c) => {
  const start = Date.now();
  
  try {
    // ... logic
    log.info({ sessionId, duration: Date.now() - start }, 'Session created');
    return c.json({ session_id: sessionId });
  } catch (error) {
    log.error({ error, duration: Date.now() - start }, 'Failed to create session');
    throw error;
  }
});
```

### Request Logging Middleware

```typescript
// server/src/middleware/logging.ts
import { Context, Next } from 'hono';
import { logger } from '../lib/logger.js';
import crypto from 'crypto';

export async function requestLogger(c: Context, next: Next) {
  const start = Date.now();
  const correlationId = 
    c.req.header('X-Correlation-ID') || 
    crypto.randomUUID();
  
  c.set('correlationId', correlationId);
  c.header('X-Correlation-ID', correlationId);
  
  const log = logger.child({ correlationId });
  
  log.info({
    method: c.req.method,
    path: c.req.path,
  }, 'Request started');
  
  try {
    await next();
  } finally {
    const duration = Date.now() - start;
    log.info({
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration,
    }, 'Request completed');
  }
}

// Usage
app.use('*', requestLogger);
```

---

## Authentication & Security

### API Key Authentication

```typescript
// server/src/middleware/auth.ts
import { Context, Next } from 'hono';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

const log = logger.child({ context: 'auth' });

export async function requireAuth(c: Context, next: Next) {
  const apiKey = c.req.header('X-API-Key');
  
  if (!apiKey) {
    log.warn({ path: c.req.path }, 'Missing API key');
    return c.json({ error: 'Missing API key' }, 401);
  }
  
  if (apiKey !== env.API_KEY) {
    log.warn({ path: c.req.path }, 'Invalid API key');
    return c.json({ error: 'Invalid API key' }, 401);
  }
  
  await next();
}

// Optional: Session-based auth
export async function requireSession(c: Context, next: Next) {
  const sessionId = c.req.header('X-Session-ID');
  
  if (!sessionId) {
    return c.json({ error: 'Missing session ID' }, 401);
  }
  
  // Verify session exists and is active
  const { data: session, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('status', 'active')
    .single();
  
  if (error || !session) {
    return c.json({ error: 'Invalid or expired session' }, 401);
  }
  
  // Check expiration
  if (new Date(session.expires_at) < new Date()) {
    return c.json({ error: 'Session expired' }, 401);
  }
  
  c.set('session', session);
  await next();
}
```

### Rate Limiting

```typescript
// server/src/middleware/rateLimit.ts
import { Context, Next } from 'hono';
import { RateLimiter } from 'limiter';

const limiters = new Map<string, RateLimiter>();

function getLimiter(key: string): RateLimiter {
  if (!limiters.has(key)) {
    limiters.set(key, new RateLimiter({
      tokensPerInterval: 100,
      interval: 'minute',
    }));
  }
  return limiters.get(key)!;
}

export async function rateLimit(c: Context, next: Next) {
  const ip = c.req.header('x-forwarded-for') || 
             c.req.header('x-real-ip') || 
             'unknown';
  
  const limiter = getLimiter(ip);
  const remaining = await limiter.removeTokens(1);
  
  c.header('X-RateLimit-Limit', '100');
  c.header('X-RateLimit-Remaining', Math.max(0, Math.floor(remaining)).toString());
  
  if (remaining < 0) {
    return c.json({ error: 'Too many requests' }, 429);
  }
  
  await next();
}
```

### Improved CORS Configuration

```typescript
// server/src/middleware/cors.ts
import { cors } from 'hono/cors';
import { env } from '../config/env.js';

const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());

export const corsMiddleware = cors({
  origin: (origin) => {
    if (!origin) return null; // Disallow requests with no origin
    
    // Check exact matches
    if (allowedOrigins.includes(origin)) {
      return origin;
    }
    
    // Check localhost patterns (only in development)
    if (env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return origin;
    }
    
    // Check wildcard patterns
    for (const pattern of allowedOrigins) {
      if (pattern.includes('*')) {
        const regex = new RegExp(
          '^' + pattern.replace(/\*/g, '.*').replace(/\./g, '\\.') + '$'
        );
        if (regex.test(origin)) {
          return origin;
        }
      }
    }
    
    return null;
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Session-ID'],
  exposeHeaders: ['X-Correlation-ID', 'X-RateLimit-Remaining'],
  maxAge: 86400, // 24 hours
});
```

### Updated Security Headers

```typescript
// server/src/middleware/security.ts
import { Context, Next } from 'hono';

export async function securityHeaders(c: Context, next: Next) {
  await next();
  
  // Prevent clickjacking
  c.header('X-Frame-Options', 'DENY');
  
  // Prevent MIME sniffing
  c.header('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection
  c.header('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  c.header('Content-Security-Policy', "default-src 'self'");
  
  // Permissions Policy
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}
```

### Apply Security Middleware

```typescript
// server/src/index.ts
import { securityHeaders } from './middleware/security.js';
import { corsMiddleware } from './middleware/cors.js';
import { rateLimit } from './middleware/rateLimit.js';
import { requestLogger } from './middleware/logging.js';

// Apply middleware
app.use('*', securityHeaders);
app.use('*', corsMiddleware);
app.use('*', requestLogger);
app.use('*', rateLimit);

// Protected routes
const api = new Hono();
api.use('*', requireAuth); // All API routes require auth
api.route('/sessions', sessions);
api.route('/catalogs', catalogs);

app.route('/api/v1', api);
```

---

## Testing Setup

### Backend Testing with Jest

```bash
# Install dependencies
cd server
npm install -D jest @types/jest ts-jest supertest @types/supertest
```

Create Jest config:

```javascript
// server/jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
};
```

Create test setup:

```typescript
// server/src/__tests__/setup.ts
import { beforeAll, afterAll, beforeEach } from '@jest/globals';

beforeAll(async () => {
  // Setup test database, mocks, etc.
  process.env.NODE_ENV = 'test';
});

afterAll(async () => {
  // Cleanup
});

beforeEach(() => {
  // Reset mocks
  jest.clearAllMocks();
});
```

### Unit Test Example

```typescript
// server/src/lib/__tests__/queue.test.ts
import { describe, it, expect, beforeEach } from '@jest/globals';
import { SimpleQueue } from '../queue';

describe('SimpleQueue', () => {
  let queue: SimpleQueue;

  beforeEach(() => {
    queue = new SimpleQueue();
  });

  it('should enqueue a job', async () => {
    const jobId = await queue.enqueue('test', { data: 'test' });
    
    expect(jobId).toBeDefined();
    expect(jobId).toContain('test-');
    expect(queue.getStats().total).toBe(1);
  });

  it('should dequeue a job', async () => {
    await queue.enqueue('test', { data: 'test' });
    const job = await queue.dequeue('test');
    
    expect(job).toBeDefined();
    expect(job?.type).toBe('test');
    expect(job?.payload).toEqual({ data: 'test' });
  });

  it('should handle failed jobs with retry', async () => {
    const jobId = await queue.enqueue('test', { data: 'test' }, { maxAttempts: 3 });
    const job = await queue.dequeue('test');
    
    await queue.fail(jobId, new Error('Test error'));
    
    expect(queue.getStats().total).toBe(1); // Still in queue
    expect(job?.attempts).toBe(1);
  });
});
```

### Integration Test Example

```typescript
// server/src/routes/__tests__/sessions.integration.test.ts
import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../../index';

describe('POST /api/v1/sessions', () => {
  it('should create a new session', async () => {
    const response = await request(app)
      .post('/api/v1/sessions')
      .set('X-API-Key', process.env.API_KEY!)
      .send({
        device_id: 'test-device',
      })
      .expect(201);
    
    expect(response.body).toHaveProperty('session_id');
    expect(response.body.session_id).toMatch(/^session_/);
    expect(response.body).toHaveProperty('expires_at');
  });

  it('should require authentication', async () => {
    await request(app)
      .post('/api/v1/sessions')
      .send({})
      .expect(401);
  });

  it('should validate request body', async () => {
    const response = await request(app)
      .post('/api/v1/sessions')
      .set('X-API-Key', process.env.API_KEY!)
      .send({
        device_id: '', // Invalid: empty string
      })
      .expect(400);
    
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Validation failed');
  });
});
```

### Frontend Testing with React Native Testing Library

```bash
cd app-mobile
npm install -D @testing-library/react-native @testing-library/jest-native
```

Update Jest config:

```javascript
// app-mobile/jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
  ],
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/__tests__/**',
    '!app/**/index.ts',
  ],
};
```

Component test example:

```typescript
// app-mobile/app/screens/__tests__/AttractScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AttractScreen } from '../AttractScreen';
import { useStore } from '../../store/useStore';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

describe('AttractScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render tap to start message', () => {
    const { getByText } = render(
      <AttractScreen navigation={mockNavigation as any} />
    );
    
    expect(getByText('TAP TO START')).toBeTruthy();
  });

  it('should navigate to Layout screen on tap', async () => {
    const { getByTestId } = render(
      <AttractScreen navigation={mockNavigation as any} />
    );
    
    fireEvent.press(getByTestId('start-button'));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Layout');
    });
  });

  it('should create session on start', async () => {
    const { getByTestId } = render(
      <AttractScreen navigation={mockNavigation as any} />
    );
    
    fireEvent.press(getByTestId('start-button'));
    
    await waitFor(() => {
      const state = useStore.getState();
      expect(state.sessionId).toBeDefined();
    });
  });
});
```

---

## Error Handling Patterns

### Structured Error Classes

```typescript
// server/src/lib/errors.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super('Too many requests', 429, 'RATE_LIMIT_EXCEEDED');
  }
}
```

### Global Error Handler

```typescript
// server/src/middleware/errorHandler.ts
import { Context } from 'hono';
import { AppError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { z } from 'zod';

export async function errorHandler(err: Error, c: Context) {
  const correlationId = c.get('correlationId') || 'unknown';
  const log = logger.child({ correlationId });

  // Handle AppError
  if (err instanceof AppError) {
    log.warn({ error: err, code: err.code }, 'Application error');
    return c.json(
      {
        error: err.message,
        code: err.code,
        ...(err.details && { details: err.details }),
      },
      err.statusCode
    );
  }

  // Handle Zod validation errors
  if (err instanceof z.ZodError) {
    log.warn({ error: err }, 'Validation error');
    return c.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
      400
    );
  }

  // Log unexpected errors
  log.error({ error: err }, 'Unexpected error');

  // Return generic error to client (don't leak internal details)
  return c.json(
    {
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      correlationId, // Help debugging
    },
    500
  );
}

// Apply to app
app.onError(errorHandler);
```

### Using Custom Errors

```typescript
// server/src/routes/sessions.ts
import { NotFoundError, ValidationError } from '../lib/errors.js';

sessions.get('/:id', async (c) => {
  const sessionId = c.req.param('id');
  
  if (!sessionId || sessionId.length === 0) {
    throw new ValidationError('Session ID is required');
  }

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error || !data) {
    throw new NotFoundError('Session');
  }

  return c.json(data);
});
```

### Mobile App Error Handling

```typescript
// app-mobile/app/utils/errorHandler.ts
import { Alert } from 'react-native';

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleError(error: unknown, context?: string): void {
  console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);

  let message = 'An unexpected error occurred';
  
  if (error instanceof ApiError) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  Alert.alert(
    'Error',
    message,
    [{ text: 'OK' }]
  );
}

// Usage in screens
try {
  await api.createSession(deviceId);
} catch (error) {
  handleError(error, 'Create Session');
}
```

---

## Implementation Checklist

Use this checklist to track your progress:

### Phase 1: Critical Security & Configuration (Week 1)

- [ ] Add ESLint configuration to server
- [ ] Add Prettier configuration to root
- [ ] Create environment validation (server/src/config/env.ts)
- [ ] Add input validation to all endpoints
- [ ] Implement API key authentication
- [ ] Add rate limiting middleware
- [ ] Fix CORS configuration
- [ ] Add security headers
- [ ] Update RLS policies in database

### Phase 2: Code Quality & Testing (Week 2)

- [ ] Implement structured logging with Pino
- [ ] Create custom error classes
- [ ] Add global error handler
- [ ] Setup Jest for backend
- [ ] Write unit tests for utilities
- [ ] Write integration tests for API endpoints
- [ ] Setup React Native Testing Library
- [ ] Write component tests

### Phase 3: Architecture Improvements (Week 3-4)

- [ ] Implement repository pattern
- [ ] Add service layer
- [ ] Create validation middleware
- [ ] Add request logging middleware
- [ ] Implement health check with depth
- [ ] Add API versioning
- [ ] Replace in-memory queue with Redis
- [ ] Add monitoring and metrics

### Phase 4: Production Readiness (Week 5+)

- [ ] Add CI/CD pipeline
- [ ] Implement secrets management
- [ ] Add error tracking (Sentry)
- [ ] Setup APM monitoring
- [ ] Create deployment scripts
- [ ] Add database migration runner
- [ ] Document all APIs
- [ ] Create runbooks for operations

---

## Resources

- **TypeScript:** https://www.typescriptlang.org/docs/
- **Zod:** https://zod.dev/
- **Pino:** https://getpino.io/
- **Jest:** https://jestjs.io/
- **React Native Testing:** https://callstack.github.io/react-native-testing-library/
- **Hono:** https://hono.dev/
- **Supabase:** https://supabase.com/docs

---

**Last Updated:** October 2025
