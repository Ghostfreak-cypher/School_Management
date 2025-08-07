const mysql = require("mysql2/promise");
require("dotenv").config();

// Database configuration
const dbUrl = new URL(
  process.env.DB_URL || "mysql://root:@localhost:3306/school_management"
);

const dbConfig = {
  host: dbUrl.hostname,
  port: dbUrl.port || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1), // removes the leading '/'
  waitForConnections: true,
  connectionLimit: 10,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database and create schools table
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();

    // Create database if it doesn't exist
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`
    );
    await connection.query(`USE ${dbConfig.database}`);

    // Create schools table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(500) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
      )
    `;

    await connection.query(createTableQuery);
    console.log("Database and schools table initialized successfully");

    connection.release();
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

module.exports = {
  pool,
  initializeDatabase,
};
