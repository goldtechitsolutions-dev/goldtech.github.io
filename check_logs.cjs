const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hnygqubocyzrnqqmbpeg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhueWdxdWJvY3l6cm5xcW1icGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODY1NTUsImV4cCI6MjA4NzY2MjU1NX0.2tATlgjAQ_y4i9PE-nArtMtaa0L3DVRnsGtdmKbVrH4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkLogs() {
    console.log('Checking gt_chat_logs table...');
    const { data, error } = await supabase
        .from('gt_chat_logs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching logs:', error);
        return;
    }

    console.log(`Found ${data.length} logs.`);
    if (data.length > 0) {
        console.log('Latest 3 logs:');
        console.log(JSON.stringify(data.slice(0, 3), null, 2));
    } else {
        console.log('Table is empty.');
    }
}

checkLogs();
