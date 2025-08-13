import pool from './src/db/index.js';

try {
  console.log('Testing database connection...');
  const result = await pool.query('SELECT * FROM users');
  console.log('Users in database:');
  console.table(result.rows);
} catch (error) {
  console.error('Database error:', error.message);
} finally {
  await pool.end();
  process.exit(0);
}
