import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-kalara.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.demo-placeholder';

export const isSupabaseConfigured = () => {
  return (
    Boolean(import.meta.env.VITE_SUPABASE_URL) &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co' &&
    Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY) &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your-anon-key-here'
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
