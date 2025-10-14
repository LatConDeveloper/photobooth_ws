import { Hono } from 'hono';
import { supabase } from '../lib/db.js';
import { z } from 'zod';

const sessions = new Hono();

const createSessionSchema = z.object({
  device_id: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * POST /sessions
 * Creates a new kiosk session for scoping photos and orders.
 */
sessions.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const validated = createSessionSchema.parse(body);

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        id: sessionId,
        device_id: validated.device_id,
        metadata: validated.metadata,
        expires_at: expiresAt.toISOString(),
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;

    return c.json({
      session_id: data.id,
      expires_at: data.expires_at,
    }, 201);
  } catch (error) {
    console.error('[Sessions] Error creating session:', error);
    
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid request', details: error.errors }, 400);
    }
    
    return c.json({ error: 'Failed to create session' }, 500);
  }
});

/**
 * GET /sessions/:id
 * Retrieves session details.
 */
sessions.get('/:id', async (c) => {
  try {
    const sessionId = c.req.param('id');

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !data) {
      return c.json({ error: 'Session not found' }, 404);
    }

    return c.json(data);
  } catch (error) {
    console.error('[Sessions] Error fetching session:', error);
    return c.json({ error: 'Failed to fetch session' }, 500);
  }
});

export default sessions;
