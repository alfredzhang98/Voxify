import express, { Router } from 'express';
import { 
  createSong, 
  getSongById, 
  searchSongs, 
  createTranslation, 
  voteTranslation 
} from '../controllers/songController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Public routes
router.get('/search', searchSongs);
router.get('/:id', getSongById);

// Protected routes
router.post('/', protect, createSong);
router.post('/translation', protect, createTranslation);
router.post('/translation/vote', protect, voteTranslation);

export default router; 