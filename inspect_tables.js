import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hnygqubocyzrnqqmbpeg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhueWdxdWJvY3l6cm5xcW1icGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODY1NTUsImV4cCI6MjA4NzY2MjU1NX0.2tATlgjAQ_y4i9PE-nArtMtaa0L3DVRnsGtdmKbVrH4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTables() {
    console.log('--- gt_leaves ---');
    const { data: leaves, error: leavesError } = await supabase.from('gt_leaves').select('*').limit(1);
    if (leaves && leaves.length > 0) {
        console.log('Columns:', Object.keys(leaves[0]));
    } else {
        console.log('No data or error:', leavesError);
    }

    console.log('\n--- gt_chat_logs ---');
    const { data: logs, error: logsError } = await supabase.from('gt_chat_logs').select('*').limit(1);
    if (logs && logs.length > 0) {
        console.log('Columns:', Object.keys(logs[0]));
    } else {
        console.log('No data or error:', logsError);
    }
}

inspectTables();
