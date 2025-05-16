import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import userModel, { User } from '../models/userModel';

// Generate JWT token
const generateToken = (id: number): string => {
  const payload = { id };
  const secret = String(process.env.JWT_SECRET || 'fallback_secret');
  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  };
  
  // Use as any to bypass the TypeScript error
  return jwt.sign(payload, secret as any, options);
};

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    // Check if user already exists
    const userExists = await userModel.findByEmail(email);
    if (userExists) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    // Create user
    const user = await userModel.create({
      username,
      email,
      password,
    });

    // Generate token
    if (!user.id) {
      res.status(500).json({ message: 'Failed to create user' });
      return;
    }
    
    const token = generateToken(user.id);

    // Return user data with token
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      profile_image: user.profile_image,
      bio: user.bio,
      token,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    // Check if user exists
    const user = await userModel.findByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate token
    if (!user.id) {
      res.status(500).json({ message: 'User ID not found' });
      return;
    }
    
    const token = generateToken(user.id);

    // Return user data with token
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      profile_image: user.profile_image,
      bio: user.bio,
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user profile
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      profile_image: user.profile_image,
      bio: user.bio,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 