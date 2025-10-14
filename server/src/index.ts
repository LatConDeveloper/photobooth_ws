import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import health from './routes/health.js';
import catalogs from './routes/catalogs.js';
import sessions from './routes/sessions.js';

const app = new Hono();

// Middleware
app.use('*', logger());

app.use(
  '*',
  cors({
    origin: (origin) => {
      const allowed = process.env.ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:8081',
        'http://localhost:19000',
        'http://localhost:19006',
      ];

      if (!origin) return null;

      // Allow localhost on any port
      if (origin.includes('localhost')) return origin;

      // Check against allowed origins (supports wildcards)
      for (const pattern of allowed) {
        if (pattern === '*' || pattern === origin) return origin;
        if (pattern.includes('*')) {
          const regex = new RegExp(pattern.replace('*', '.*'));
          if (regex.test(origin)) return origin;
        }
      }

      return null;
    },
    credentials: true,
  })
);

// Routes
app.route('/health', health);
app.route('/catalogs', catalogs);
app.route('/sessions', sessions);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    name: 'PhotoBooth API',
    version: '1.0.0',
    status: 'running',
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('[Server Error]', err);
  return c.json(
    {
      error: 'Internal server error',
      message: err.message,
    },
    500
  );
});

// Start server
const port = parseInt(process.env.PORT || '8787');
const hostname = process.env.HOST || '0.0.0.0';

console.log(`🚀 PhotoBooth server starting on ${hostname}:${port}...`);
console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`💳 Payment provider: ${process.env.PAYMENTS_PROVIDER || 'demo'}`);

// Start Node.js server
serve({
  fetch: app.fetch,
  port,
  hostname,
}, (info: { port: number; address: string }) => {
  console.log(`✅ Server running at http://${hostname}:${info.port}`);
  console.log(`📱 Access from network: http://192.168.1.21:${info.port}`);
});
