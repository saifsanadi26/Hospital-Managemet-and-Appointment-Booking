const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get promise-based connection
const promisePool = pool.promise();

// Test connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ MySQL Database Connected Successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database Connection Error:', error.message);
    console.error('⚠️  Please setup the database using setup-database.sql');
    console.error('   The server will continue but features requiring database will not work.');
  }
};

module.exports = { pool: promisePool, testConnection };
