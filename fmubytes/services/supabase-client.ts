import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY!;

// Conditionally use AsyncStorage only on iOS or Android
//const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // storage: isNative ? AsyncStorage : undefined,     Would use asyncStorage in prod
    storage: undefined,
    detectSessionInUrl: false,
  },
});