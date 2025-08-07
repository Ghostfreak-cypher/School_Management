const mysql = require("mysql2/promise");
require("dotenv").config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "school_management",
  port: process.env.DB_PORT || 3306,
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
