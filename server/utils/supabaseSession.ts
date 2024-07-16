import { createClient } from '@supabase/supabase-js';

const config = useRuntimeConfig();
const supabaseClient = createClient(`${config.public.supabaseUrl}`, `${config.supabaseServiceKey}`, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default supabaseClient;