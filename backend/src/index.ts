import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Basic routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Voxify API' });
});

app.get('/api/songs/search', (req: Request, res: Response) => {
  const mockSongs = [
    {
      id: 1,
      title: 'Despacito',
      artist: 'Luis Fonsi ft. Daddy Yankee',
      language: 'Spanish',
      image_url: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      title: 'Gangnam Style',
      artist: 'PSY',
      language: 'Korean',
      image_url: 'https://via.placeholder.com/150'
    }
  ];
  
  res.json(mockSongs);
});

app.get('/api/songs/:id', (req: Request, res: Response) => {
  const songId = parseInt(req.params.id);
  
  const mockSong = {
    id: songId,
    title: 'Despacito',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    album: 'Vida',
    language: 'Spanish',
    original_lyrics: 'Despacito lyrics here...',
    image_url: 'https://via.placeholder.com/300',
    translations: [
      {
        id: 1,
        language: 'English',
        translated_lyrics: 'Slowly lyrics here...',
        translator_username: 'user123',
        upvotes: 42,
        downvotes: 3,
        is_verified: true
      }
    ]
  };
  
  res.json(mockSong);
});

// Error handling middleware
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 