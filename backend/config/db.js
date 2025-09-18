const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Bank',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
});

// Get promise-based pool
const promisePool = pool.promise();

// Test connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ MySQL Connected Successfully');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL Connection Failed:', error.message);
    process.exit(1);
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Create Users table
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('customer', 'banker') DEFAULT 'customer',
        access_token VARCHAR(36) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Accounts table (renamed from Transactions to match requirements)
    await promisePool.execute(`
      CREATE TABLE IF NOT EXISTS Accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        transaction_type ENUM('deposit', 'withdraw') NOT NULL,
        amount DECIMAL(15, 2) NOT NULL,
        balance_after DECIMAL(15, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

module.exports = {
  pool: promisePool,
  testConnection,
  initializeDatabase
};
