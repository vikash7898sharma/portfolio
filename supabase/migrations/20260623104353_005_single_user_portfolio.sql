-- Single-user portfolio schema (no auth required)

-- Drop user_id constraints and simplify for single-user mode
ALTER TABLE public.portfolios DROP CONSTRAINT IF EXISTS portfolios_user_id_fkey;
ALTER TABLE public.portfolios ALTER COLUMN user_id DROP NOT NULL;

-- Create a default portfolio on first access
INSERT INTO public.portfolios (id, name, title, bio, slug, theme, is_public)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'My Portfolio',
  'Full Stack Developer',
  'Welcome to my portfolio! Click the Builder tab to customize.',
  'my-portfolio',
  'dark',
  true
) ON CONFLICT (id) DO NOTHING;