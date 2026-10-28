import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in Client Components (in the browser).
 * Handles reactive auth state and cookie persistence automatically.
 */
export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gfutfamtbajaevglnykt.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_mkPcmOxApujDU84SnKgg2Q_yUl_9Rga";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
