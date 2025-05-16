'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

interface Song {
  id: number;
  title: string;
  artist: string;
  language: string;
  image_url?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSongs = async () => {
      if (!query) {
        setSongs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // In a real application, this would be an actual API call
        // const response = await fetch(`/api/songs/search?q=${encodeURIComponent(query)}`);
        // const data = await response.json();
        
        // For now, we'll use mock data
        const mockData: Song[] = [
          {
            id: 1,
            title: 'Despacito',
            artist: 'Luis Fonsi ft. Daddy Yankee',
            language: 'Spanish',
            image_url: 'https://via.placeholder.com/150',
          },
          {
            id: 2,
            title: 'Gangnam Style',
            artist: 'PSY',
            language: 'Korean',
            image_url: 'https://via.placeholder.com/150',
          },
          {
            id: 3,
            title: 'La Vie En Rose',
            artist: 'Édith Piaf',
            language: 'French',
            image_url: 'https://via.placeholder.com/150',
          },
          {
            id: 4,
            title: '99 Luftballons',
            artist: 'Nena',
            language: 'German',
            image_url: 'https://via.placeholder.com/150',
          },
        ].filter(song => 
          song.title.toLowerCase().includes(query.toLowerCase()) || 
          song.artist.toLowerCase().includes(query.toLowerCase())
        );
        
        setSongs(mockData);
        setError('');
      } catch (err) {
        console.error('Error searching songs:', err);
        setError('Failed to search songs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar />
      </div>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {query ? `Search results for "${query}"` : 'Search for songs'}
        </h1>
        <p className="text-gray-600">
          {songs.length} {songs.length === 1 ? 'result' : 'results'} found
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : songs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">No songs found</p>
          <p className="text-gray-500">Try searching for a different song or artist</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((song) => (
            <Link key={song.id} href={`/songs/${song.id}`}>
              <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-40 bg-gray-200 relative">
                  {song.image_url ? (
                    <img
                      src={song.image_url}
                      alt={`${song.title} by ${song.artist}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{song.title}</h3>
                  <p className="text-gray-600 mb-2">{song.artist}</p>
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                    {song.language}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 