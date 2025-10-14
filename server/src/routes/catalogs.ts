import { Hono } from 'hono';
import { supabase } from '../lib/db.js';

const catalogs = new Hono();

/**
 * GET /catalogs/layouts
 * Returns available photo layouts with pricing and shot count.
 */
catalogs.get('/layouts', async (c) => {
  try {
    const { data, error } = await supabase
      .from('layouts')
      .select('*')
      .eq('enabled', true)
      .order('display_order', { ascending: true });

    // If Supabase error or no data, return mock data
    if (error || !data || data.length === 0) {
      console.log('[Catalogs] Using mock layouts data');
      return c.json([
        {
          id: 'layout-1',
          name: '2x2 Classic',
          description: 'Four photos in a classic 2x2 grid',
          shots: 4,
          price: 500, // cents
          enabled: true,
          thumbnail_url: null,
        },
        {
          id: 'layout-2',
          name: '3-Strip',
          description: 'Three vertical photos',
          shots: 3,
          price: 400,
          enabled: true,
          thumbnail_url: null,
        },
        {
          id: 'layout-3',
          name: 'Single Portrait',
          description: 'One large portrait photo',
          shots: 1,
          price: 300,
          enabled: true,
          thumbnail_url: null,
        },
      ]);
    }

    return c.json(data);
  } catch (error) {
    console.error('[Catalogs] Error fetching layouts:', error);
    return c.json({ error: 'Failed to fetch layouts' }, 500);
  }
});

/**
 * GET /catalogs/templates
 * Returns available templates (overlays/frames) for photos.
 */
catalogs.get('/templates', async (c) => {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('enabled', true)
      .order('display_order', { ascending: true });

    // If Supabase error or no data, return mock data
    if (error || !data || data.length === 0) {
      console.log('[Catalogs] Using mock templates data');
      return c.json([
        {
          id: 'template-1',
          name: 'Classic Frame',
          description: 'Simple black border',
          category: 'frame',
          overlay_url: null,
          thumbnail_url: null,
          enabled: true,
        },
        {
          id: 'template-2',
          name: 'Party Confetti',
          description: 'Colorful confetti overlay',
          category: 'overlay',
          overlay_url: null,
          thumbnail_url: null,
          enabled: true,
        },
        {
          id: 'template-3',
          name: 'Vintage',
          description: 'Retro photo frame',
          category: 'frame',
          overlay_url: null,
          thumbnail_url: null,
          enabled: true,
        },
      ]);
    }

    return c.json(data);
  } catch (error) {
    console.error('[Catalogs] Error fetching templates:', error);
    return c.json({ error: 'Failed to fetch templates' }, 500);
  }
});

export default catalogs;
