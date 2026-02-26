import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hnygqubocyzrnqqmbpeg.supabase.co'
const supabaseAnonKey = 'sb_publishable_WuremQxxRgwdXltd1I_sFw_Pk0Nx6N_'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
