import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hnygqubocyzrnqqmbpeg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhueWdxdWJvY3l6cm5xcW1icGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODY1NTUsImV4cCI6MjA4NzY2MjU1NX0.2tATlgjAQ_y4i9PE-nArtMtaa0L3DVRnsGtdmKbVrH4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log("Checking columns for the 'queries' table...");
    // We can force an error to get the schema from the PostgREST hint,
    // or insert a dummy row and select everything.
    // Alternatively, just query one row.
    const { data, error } = await supabase
        .from('queries')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error fetching queries:", error);
        return;
    }

    if (data && data.length > 0) {
        console.log("Columns present in 'queries' table:", Object.keys(data[0]));
    } else {
        console.log("No data found to infer columns from.");
    }
}

checkSchema();
