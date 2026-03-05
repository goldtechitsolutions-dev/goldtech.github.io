import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hnygqubocyzrnqqmbpeg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhueWdxdWJvY3l6cm5xcW1icGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODY1NTUsImV4cCI6MjA4NzY2MjU1NX0.2tATlgjAQ_y4i9PE-nArtMtaa0L3DVRnsGtdmKbVrH4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log("Checking Supabase Connection...");

    // Check if the system-company-profile record exists
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', 'system-company-profile');

    if (error) {
        console.error("Database query failed:", error);
    } else {
        console.log(`Found ${data.length} records for 'system-company-profile'.`);
        if (data.length > 0) {
            console.log("Data content:", data[0].content);
        } else {
            console.log("The record DOES NOT EXIST in the database yet.");
        }
    }
}
test();
