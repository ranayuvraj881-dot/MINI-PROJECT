import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 
  'https://gfkunutisfqnaggampxm.supabase.co';

const SUPABASE_ANON_KEY = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdma3VudXRpc2ZxbmFnZ2FtcHhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NjkzODMsImV4cCI6MjEwODI0NTM4M30.253xIU_0ZO_f43BBY_F9qrPmLTykAyky_1CiyQqpYEc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export async function checkSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const { error } = await supabase.from('subjects').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      return { connected: false, message: error.message };
    }
    return {
      connected: true,
      message: 'Supabase cloud project gfkunutisfqnaggampxm connected and operational',
    };
  } catch (err: any) {
    return { connected: false, message: err.message || 'Connection check failed' };
  }
}
