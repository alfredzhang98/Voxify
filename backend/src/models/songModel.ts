import pool from '../config/db';

export interface Song {
  id?: number;
  title: string;
  artist: string;
  album?: string;
  release_date?: string;
  language: string;
  original_lyrics: string;
  spotify_id?: string;
  apple_music_id?: string;
  youtube_id?: string;
  image_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Translation {
  id?: number;
  song_id: number;
  user_id: number;
  language: string;
  translated_lyrics: string;
  is_verified?: boolean;
  upvotes?: number;
  downvotes?: number;
  created_at?: Date;
  updated_at?: Date;
}

class SongModel {
  // Create a new song
  async create(songData: Song): Promise<Song> {
    const { 
      title, artist, album, release_date, language,
      original_lyrics, spotify_id, apple_music_id, youtube_id, image_url 
    } = songData;
    
    const query = `
      INSERT INTO songs (
        title, artist, album, release_date, language,
        original_lyrics, spotify_id, apple_music_id, youtube_id, image_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const values = [
      title, artist, album || null, release_date || null, language,
      original_lyrics, spotify_id || null, apple_music_id || null,
      youtube_id || null, image_url || null
    ];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  // Get song by ID
  async findById(id: number): Promise<Song | null> {
    const query = `
      SELECT * FROM songs WHERE id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  
  // Search songs
  async search(params: {
    title?: string;
    artist?: string;
    language?: string;
  }): Promise<Song[]> {
    const { title, artist, language } = params;
    
    let query = `SELECT * FROM songs WHERE 1 = 1`;
    const values: string[] = [];
    let paramCounter = 1;
    
    if (title) {
      query += ` AND title ILIKE $${paramCounter}`;
      values.push(`%${title}%`);
      paramCounter++;
    }
    
    if (artist) {
      query += ` AND artist ILIKE $${paramCounter}`;
      values.push(`%${artist}%`);
      paramCounter++;
    }
    
    if (language) {
      query += ` AND language = $${paramCounter}`;
      values.push(language);
      paramCounter++;
    }
    
    query += ` ORDER BY title ASC LIMIT 50`;
    
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
  
  // Create a new translation
  async createTranslation(translationData: Translation): Promise<Translation> {
    const { 
      song_id, user_id, language, translated_lyrics, 
      is_verified = false
    } = translationData;
    
    const query = `
      INSERT INTO translations (
        song_id, user_id, language, translated_lyrics, is_verified,
        upvotes, downvotes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      song_id, user_id, language, translated_lyrics, is_verified,
      0, 0  // Initial upvotes and downvotes
    ];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  // Get translations for a song
  async getTranslations(songId: number): Promise<Translation[]> {
    const query = `
      SELECT t.*, u.username as translator_username
      FROM translations t
      JOIN users u ON t.user_id = u.id
      WHERE t.song_id = $1
      ORDER BY t.upvotes DESC, t.created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [songId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
  
  // Vote on a translation
  async voteTranslation(
    translationId: number,
    userId: number,
    voteType: 'upvote' | 'downvote'
  ): Promise<{ success: boolean }> {
    try {
      // Start transaction
      await pool.query('BEGIN');
      
      // Check if user already voted
      const checkQuery = `
        SELECT * FROM translation_votes
        WHERE translation_id = $1 AND user_id = $2
      `;
      
      const checkResult = await pool.query(checkQuery, [translationId, userId]);
      const existingVote = checkResult.rows[0];
      
      // Handle existing vote cases
      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote if same type
          await pool.query(
            `DELETE FROM translation_votes WHERE id = $1`,
            [existingVote.id]
          );
          
          // Update count
          await pool.query(
            `UPDATE translations SET ${voteType}s = ${voteType}s - 1 WHERE id = $1`,
            [translationId]
          );
        } else {
          // Change vote type
          await pool.query(
            `UPDATE translation_votes SET vote_type = $1 WHERE id = $2`,
            [voteType, existingVote.id]
          );
          
          // Update counts (decrement previous, increment new)
          const oppositeType = voteType === 'upvote' ? 'downvote' : 'upvote';
          await pool.query(
            `UPDATE translations 
             SET ${voteType}s = ${voteType}s + 1,
                 ${oppositeType}s = ${oppositeType}s - 1
             WHERE id = $1`,
            [translationId]
          );
        }
      } else {
        // Create new vote
        await pool.query(
          `INSERT INTO translation_votes (translation_id, user_id, vote_type)
           VALUES ($1, $2, $3)`,
          [translationId, userId, voteType]
        );
        
        // Update count
        await pool.query(
          `UPDATE translations SET ${voteType}s = ${voteType}s + 1 WHERE id = $1`,
          [translationId]
        );
      }
      
      // Commit transaction
      await pool.query('COMMIT');
      
      return { success: true };
    } catch (error) {
      // Rollback in case of error
      await pool.query('ROLLBACK');
      throw error;
    }
  }
}

export default new SongModel(); 