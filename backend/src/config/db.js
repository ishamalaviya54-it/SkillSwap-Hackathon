import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'skillswap_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    return rows.length > 0;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    return false;
  }
}

export async function query(sql, params = []) {
  return pool.execute(sql, params);
}

export default pool;
