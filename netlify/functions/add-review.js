const { Client } = require('pg');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, review, rating } = JSON.parse(event.body || '{}');
  if (!name || !review || !rating) {
    return { statusCode: 400, body: 'Missing name, review, or rating' };
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query(
      'INSERT INTO reviews (name, review, rating) VALUES ($1, $2, $3)',
      [name, review, rating]
    );
    await client.end();
    return { statusCode: 201, body: JSON.stringify({ success: true }) };
  } catch (err) {
    await client.end();
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
