const { Client } = require('pg');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, review } = JSON.parse(event.body || '{}');
  if (!name || !review) {
    return { statusCode: 400, body: 'Missing name or review' };
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query('INSERT INTO reviews (name, review) VALUES ($1, $2)', [name, review]);
    await client.end();
    return { statusCode: 201, body: JSON.stringify({ success: true }) };
  } catch (err) {
    await client.end();
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

