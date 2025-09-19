const mysql = require('mysql2');
require('dotenv').config();

// Aiven MySQL Configuration
const DB_HOST = process.env.DB_HOST ;
const DB_PORT = process.env.DB_PORT ;
const DB_USER = process.env.DB_USER ;
const DB_PASSWORD = process.env.DB_PASSWORD ;
const DB_NAME = process.env.DB_NAME;
const DB_SSL = process.env.DB_SSL === 'true';

// SSL Configuration for Aiven
const sslConfig = DB_SSL ? {
  ssl: {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false' ? false : true
  }
} : {};

// Create connection pool for Aiven MySQL
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  acquireTimeout: parseInt(process.env.DB_ACQUIRE_TIMEOUT) || 60000,
  timeout: parseInt(process.env.DB_TIMEOUT) || 60000,
  ...sslConfig
});

// Get promise-based pool
const promisePool = pool.promise();

// Test connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Aiven MySQL Connected Successfully');
    console.log(`📊 Connected to: ${DB_HOST}:${DB_PORT}/${DB_NAME}`);
    connection.release();
  } catch (error) {
    console.error('❌ Aiven MySQL Connection Failed:', error.message);
    console.error('🔧 Check your .env file configuration');
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
