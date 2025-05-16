import pool from '../config/db';
import bcrypt from 'bcrypt';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  profile_image?: string;
  bio?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  profile_image?: string;
  bio?: string;
  created_at: Date;
  updated_at: Date;
}

class UserModel {
  // Create a new user
  async create(userData: User): Promise<UserResponse> {
    const { username, email, password, profile_image, bio } = userData;
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const query = `
      INSERT INTO users (username, email, password, profile_image, bio)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email, profile_image, bio, created_at, updated_at
    `;
    
    const values = [username, email, hashedPassword, profile_image || null, bio || null];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  // Get user by ID
  async findById(id: number): Promise<UserResponse | null> {
    const query = `
      SELECT id, username, email, profile_image, bio, created_at, updated_at
      FROM users WHERE id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  
  // Get user by email
  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT *
      FROM users WHERE email = $1
    `;
    
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  
  // Update user
  async update(id: number, userData: Partial<User>): Promise<UserResponse | null> {
    // Construct dynamic query for update
    const allowedFields = ['username', 'email', 'profile_image', 'bio'];
    const updates: string[] = [];
    const values: any[] = [];
    
    let paramCounter = 1;
    
    Object.keys(userData).forEach(key => {
      if (allowedFields.includes(key) && userData[key as keyof Partial<User>] !== undefined) {
        updates.push(`${key} = $${paramCounter}`);
        values.push(userData[key as keyof Partial<User>]);
        paramCounter++;
      }
    });
    
    // If no valid fields to update
    if (updates.length === 0) {
      return this.findById(id);
    }
    
    values.push(id);
    
    const query = `
      UPDATE users
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCounter}
      RETURNING id, username, email, profile_image, bio, created_at, updated_at
    `;
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  
  // Delete user
  async delete(id: number): Promise<boolean> {
    const query = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rowCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserModel(); 