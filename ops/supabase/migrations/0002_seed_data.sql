-- Seed data for PhotoBooth MVP testing

-- Insert sample layouts
INSERT INTO layouts (id, name, description, shots, price, enabled, display_order) VALUES
  ('layout-classic-2x2', '2x2 Classic', 'Four photos in a classic 2x2 grid', 4, 500, true, 1),
  ('layout-3-strip', '3-Strip', 'Three vertical photos in a strip', 3, 400, true, 2),
  ('layout-single', 'Single Portrait', 'One large portrait photo', 1, 300, true, 3),
  ('layout-4-strip', '4-Strip', 'Four vertical photos in a strip', 4, 500, true, 4)
ON CONFLICT (id) DO NOTHING;

-- Insert sample templates
INSERT INTO templates (id, name, description, category, enabled, display_order) VALUES
  ('template-none', 'No Template', 'Plain photo without overlay', 'frame', true, 0),
  ('template-classic-frame', 'Classic Frame', 'Simple black border frame', 'frame', true, 1),
  ('template-party-confetti', 'Party Confetti', 'Colorful confetti overlay', 'overlay', true, 2),
  ('template-vintage', 'Vintage Frame', 'Retro style photo frame', 'frame', true, 3),
  ('template-hearts', 'Hearts Overlay', 'Romantic hearts decoration', 'overlay', true, 4),
  ('template-bw', 'Black & White', 'Classic black and white filter', 'filter', true, 5),
  ('template-sepia', 'Sepia Tone', 'Warm vintage sepia filter', 'filter', true, 6),
  ('template-cool', 'Cool Tone', 'Cool blue-tinted filter', 'filter', true, 7)
ON CONFLICT (id) DO NOTHING;

-- Note: In production, add actual overlay_url and thumbnail_url values
-- pointing to images in Supabase Storage
