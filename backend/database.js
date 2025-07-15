const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('✅ Database connected successfully');
    release();
  }
});

// Create tables if they don't exist
const createTables = async () => {
  try {
    // Income table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS income (
        id SERIAL PRIMARY KEY,
        project_name VARCHAR(255) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        settlement_date DATE NOT NULL,
        settlement_phase VARCHAR(100) NOT NULL,
        source_person VARCHAR(255) NOT NULL,
        payment_type VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Expense table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS expense (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        expense_tag VARCHAR(100) NOT NULL,
        spent_person VARCHAR(255) NOT NULL,
        payment_type VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
};

// Initialize tables
createTables();

module.exports = pool;