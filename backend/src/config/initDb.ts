import fs from 'fs';
import path from 'path';
import pool from './db';

// Function to initialize the database
const initializeDatabase = async () => {
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    await pool.query(schema);
    
    console.log('Database schema initialized successfully');
    
    // Create admin user if it doesn't exist
    const adminExists = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      ['admin@voxify.com']
    );
    
    if (adminExists.rowCount === 0) {
      // Import bcrypt for password hashing
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await pool.query(
        `INSERT INTO users (username, email, password, is_admin)
         VALUES ($1, $2, $3, $4)`,
        ['admin', 'admin@voxify.com', hashedPassword, true]
      );
      
      console.log('Admin user created');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

export default initializeDatabase; 