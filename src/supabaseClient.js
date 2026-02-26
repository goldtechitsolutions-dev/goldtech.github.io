import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qmhwsyzbokrpblwnzdsl.supabase.co'
const supabaseAnonKey = 'sb_publishable_iwy0xRGpchWWKgmgP-yr_Q_OkwtlNQ-'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
