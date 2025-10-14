import { Hono } from 'hono';
import { supabase } from '../lib/db.js';

const health = new Hono();

health.get('/', async (c) => {
  try {
    // Check Supabase connection
    const { error } = await supabase.from('sessions').select('count').limit(1);
    
    return c.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      supabase: error ? 'error' : 'connected',
    });
  } catch (error) {
    return c.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

export default health;
