import express, { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

export default router; 