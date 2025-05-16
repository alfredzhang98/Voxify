import { Request, Response } from 'express';
import songModel, { Song, Translation } from '../models/songModel';

// Create a new song
export const createSong = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, artist, album, release_date, language, original_lyrics } = req.body;

    // Validate required fields
    if (!title || !artist || !language || !original_lyrics) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    const songData: Song = {
      title,
      artist,
      album,
      release_date,
      language,
      original_lyrics,
      spotify_id: req.body.spotify_id,
      apple_music_id: req.body.apple_music_id,
      youtube_id: req.body.youtube_id,
      image_url: req.body.image_url,
    };

    const song = await songModel.create(songData);

    res.status(201).json(song);
  } catch (error: any) {
    console.error('Create song error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get song by ID
export const getSongById = async (req: Request, res: Response): Promise<void> => {
  try {
    const songId = parseInt(req.params.id);
    
    if (isNaN(songId)) {
      res.status(400).json({ message: 'Invalid song ID' });
      return;
    }
    
    const song = await songModel.findById(songId);
    
    if (!song) {
      res.status(404).json({ message: 'Song not found' });
      return;
    }
    
    // Get translations for the song as well
    const translations = await songModel.getTranslations(songId);
    
    res.status(200).json({
      ...song,
      translations,
    });
  } catch (error: any) {
    console.error('Get song error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search songs
export const searchSongs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, artist, language } = req.query;
    
    const searchParams: {
      title?: string;
      artist?: string;
      language?: string;
    } = {};
    
    if (title && typeof title === 'string') {
      searchParams.title = title;
    }
    
    if (artist && typeof artist === 'string') {
      searchParams.artist = artist;
    }
    
    if (language && typeof language === 'string') {
      searchParams.language = language;
    }
    
    const songs = await songModel.search(searchParams);
    
    res.status(200).json(songs);
  } catch (error: any) {
    console.error('Search songs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new translation
export const createTranslation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { song_id, language, translated_lyrics } = req.body;
    const user_id = req.user.id;  // From auth middleware
    
    // Validate required fields
    if (!song_id || !language || !translated_lyrics) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }
    
    // Check if song exists
    const song = await songModel.findById(song_id);
    if (!song) {
      res.status(404).json({ message: 'Song not found' });
      return;
    }
    
    const translationData: Translation = {
      song_id,
      user_id,
      language,
      translated_lyrics,
      // Admin users can create verified translations
      is_verified: req.user.is_admin ? req.body.is_verified : false,
    };
    
    const translation = await songModel.createTranslation(translationData);
    
    res.status(201).json(translation);
  } catch (error: any) {
    console.error('Create translation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Vote on a translation
export const voteTranslation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { translation_id, vote_type } = req.body;
    const user_id = req.user.id;  // From auth middleware
    
    // Validate required fields
    if (!translation_id || !vote_type || !['upvote', 'downvote'].includes(vote_type)) {
      res.status(400).json({ 
        message: 'Please provide a valid translation ID and vote type (upvote or downvote)' 
      });
      return;
    }
    
    const result = await songModel.voteTranslation(
      translation_id,
      user_id,
      vote_type as 'upvote' | 'downvote'
    );
    
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Vote translation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 