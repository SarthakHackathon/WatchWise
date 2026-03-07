import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mock client used when Supabase env vars are missing/invalid.
// Allows the app to render; auth features will gracefully show errors.
const mockClient = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ error: { message: 'Auth not configured' } }),
    signUp: () => Promise.resolve({ error: { message: 'Auth not configured' } }),
    signInWithOAuth: () => Promise.resolve({ error: { message: 'Auth not configured' } }),
    signOut: () => Promise.resolve(),
  },
};

function createSupabaseClient() {
  try {
    if (!supabaseUrl || !supabaseAnonKey) return mockClient;
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('[WatchWise] Supabase not configured:', e.message);
    return mockClient;
  }
}

export const supabase = createSupabaseClient();
