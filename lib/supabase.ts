
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cqncpeshwvmzeuiyhoag.supabase.co';
// Use the key provided by user if env var is missing
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'sb_publishable_VAs2UXpIaqI6obNcvA0sRg_srvUN98k';

export const supabase = createClient(supabaseUrl, supabaseKey);
