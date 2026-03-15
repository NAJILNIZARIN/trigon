const { Client } = require('pg');
const connectionString = 'postgresql://postgres:Jermycat%40123@db.wremhnzyftbguqmbylia.supabase.co:6543/postgres?pgbouncer=true';

const client = new Client({
  connectionString: connectionString,
});

async function test() {
  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('Connected successfully!');
    const res = await client.query('SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = \'public\';');
    console.log('Tables in public schema:', res.rows.map(r => r.tablename));
    await client.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

test();
