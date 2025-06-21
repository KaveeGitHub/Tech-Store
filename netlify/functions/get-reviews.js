const { Client } = require('pg');

exports.handler = async function(event, context) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const res = await client.query('SELECT name, review, created_at FROM reviews ORDER BY created_at DESC LIMIT 10');
    await client.end();
    return {
      statusCode: 200,
      body: JSON.stringify(res.rows),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (err) {
    await client.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

