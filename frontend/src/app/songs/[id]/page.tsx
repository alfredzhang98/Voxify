'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Song {
  id: number;
  title: string;
  artist: string;
  album?: string;
  language: string;
  original_lyrics: string;
  image_url?: string;
  spotify_id?: string;
  youtube_id?: string;
}

interface Translation {
  id: number;
  language: string;
  translated_lyrics: string;
  translator_username: string;
  upvotes: number;
  downvotes: number;
  is_verified: boolean;
}

export default function SongPage({ params }: { params: { id: string } }) {
  const [song, setSong] = useState<Song | null>(null);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSongData = async () => {
      try {
        setLoading(true);
        // In a real application, this would be an actual API call
        // const response = await fetch(`/api/songs/${params.id}`);
        // const data = await response.json();
        
        // For now, we'll use mock data
        const mockSong: Song = {
          id: parseInt(params.id),
          title: 'Despacito',
          artist: 'Luis Fonsi ft. Daddy Yankee',
          album: 'Vida',
          language: 'Spanish',
          original_lyrics: `Sí, sabes que ya llevo un rato mirándote
Tengo que bailar contigo hoy (DY)
Vi que tu mirada ya estaba llamándome
Muéstrame el camino que yo voy

Oh, tú, tú eres el imán y yo soy el metal
Me voy acercando y voy armando el plan
Solo con pensarlo se acelera el pulso (oh yeah)

Ya, ya me estás gustando más de lo normal
Todos mis sentidos van pidiendo más
Esto hay que tomarlo sin ningún apuro

Despacito
Quiero respirar tu cuello despacito
Deja que te diga cosas al oído
Para que te acuerdes si no estás conmigo

Despacito
Quiero desnudarte a besos despacito
Firmar las paredes de tu laberinto
Y hacer de tu cuerpo todo un manuscrito (sube, sube, sube)
(Sube, sube) Oh`,
          image_url: 'https://via.placeholder.com/300',
          spotify_id: '6habFhsOp2NvshLv26DqMb',
          youtube_id: 'kJQP7kiw5Fk',
        };
        
        const mockTranslations: Translation[] = [
          {
            id: 1,
            language: 'English',
            translated_lyrics: `Yes, you know that I've been looking at you for a while
I have to dance with you today (DY)
I saw that your look was calling me
Show me the way that I'm going

Oh, you, you are the magnet and I'm the metal
I'm getting closer and I'm putting together the plan
Just thinking about it speeds up my pulse (oh yeah)

Already, I'm liking you more than usual
All of my senses are asking for more
This needs to be taken slowly

Slowly
I want to breathe your neck slowly
Let me tell you things in your ear
So that you remember if you're not with me

Slowly
I want to undress you with kisses slowly
Sign the walls of your labyrinth
And make your body a manuscript (go up, go up, go up)
(Go up, go up) Oh`,
            translator_username: 'linguist123',
            upvotes: 245,
            downvotes: 12,
            is_verified: true,
          },
          {
            id: 2,
            language: 'French',
            translated_lyrics: `Oui, tu sais que je te regarde depuis un moment
Je dois danser avec toi aujourd'hui (DY)
J'ai vu que ton regard m'appelait déjà
Montre-moi le chemin que je vais prendre

Oh, toi, tu es l'aimant et je suis le métal
Je m'approche et je prépare le plan
Rien qu'en y pensant, mon pouls s'accélère (oh yeah)

Déjà, tu me plais plus que d'habitude
Tous mes sens en demandent plus
Il faut prendre ça sans se précipiter

Doucement
Je veux respirer ton cou doucement
Laisse-moi te dire des choses à l'oreille
Pour que tu te souviennes si tu n'es pas avec moi

Doucement
Je veux te déshabiller avec des baisers doucement
Signer les murs de ton labyrinthe
Et faire de ton corps tout un manuscrit (monte, monte, monte)
(Monte, monte) Oh`,
            translator_username: 'frenchspeaker',
            upvotes: 87,
            downvotes: 5,
            is_verified: false,
          },
          {
            id: 3,
            language: 'German',
            translated_lyrics: `Ja, du weißt, dass ich dich schon eine Weile beobachte
Ich muss heute mit dir tanzen (DY)
Ich sah, dass dein Blick mich bereits rief
Zeig mir den Weg, den ich gehe

Oh, du, du bist der Magnet und ich bin das Metall
Ich nähere mich und stelle den Plan zusammen
Allein beim Gedanken daran beschleunigt sich mein Puls (oh ja)

Schon jetzt gefällst du mir mehr als normal
Alle meine Sinne verlangen nach mehr
Dies muss ohne Eile genommen werden

Langsam
Ich will deinen Hals langsam atmen
Lass mich dir Dinge ins Ohr sagen
Damit du dich erinnerst, wenn du nicht bei mir bist

Langsam
Ich will dich langsam mit Küssen ausziehen
Die Wände deines Labyrinths signieren
Und aus deinem Körper ein ganzes Manuskript machen (hoch, hoch, hoch)
(Hoch, hoch) Oh`,
            translator_username: 'deutschlerner',
            upvotes: 42,
            downvotes: 3,
            is_verified: false,
          },
        ];
        
        setSong(mockSong);
        setTranslations(mockTranslations);
        setSelectedLanguage(mockTranslations[0].language);
        setError('');
      } catch (err) {
        console.error('Error fetching song data:', err);
        setError('Failed to load song data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSongData();
  }, [params.id]);

  const selectedTranslation = translations.find(t => t.language === selectedLanguage);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error || 'Song not found'}</p>
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Search
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Song Info */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {song.image_url && (
              <img
                src={song.image_url}
                alt={`${song.title} by ${song.artist}`}
                className="w-full h-auto"
              />
            )}
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-2">{song.title}</h1>
              <p className="text-gray-700 mb-4">{song.artist}</p>
              
              {song.album && (
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Album:</span> {song.album}
                </p>
              )}
              
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Original Language:</span> {song.language}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {song.spotify_id && (
                  <a
                    href={`https://open.spotify.com/track/${song.spotify_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm flex items-center"
                  >
                    <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                    Spotify
                  </a>
                )}
                
                {song.youtube_id && (
                  <a
                    href={`https://www.youtube.com/watch?v=${song.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm flex items-center"
                  >
                    <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    YouTube
                  </a>
                )}
              </div>
              
              <div className="mt-6">
                <Link
                  href={`/translate/${song.id}`}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-md"
                >
                  Add Translation
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lyrics and Translations */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="border-b">
              <div className="flex">
                <button
                  className={`px-6 py-3 text-sm font-medium ${
                    !selectedLanguage ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                  }`}
                  onClick={() => setSelectedLanguage(null)}
                >
                  Original ({song.language})
                </button>
                
                {translations.map((translation) => (
                  <button
                    key={translation.id}
                    className={`px-6 py-3 text-sm font-medium ${
                      selectedLanguage === translation.language
                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-700'
                    }`}
                    onClick={() => setSelectedLanguage(translation.language)}
                  >
                    {translation.language}
                    {translation.is_verified && (
                      <span className="ml-1 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6">
              {!selectedLanguage ? (
                <pre className="whitespace-pre-wrap font-sans">{song.original_lyrics}</pre>
              ) : selectedTranslation ? (
                <>
                  <pre className="whitespace-pre-wrap font-sans">{selectedTranslation.translated_lyrics}</pre>
                  
                  <div className="mt-6 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Translated by <span className="font-medium">{selectedTranslation.translator_username}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center text-gray-600 hover:text-blue-600">
                          <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{selectedTranslation.upvotes}</span>
                        </button>
                        
                        <button className="flex items-center text-gray-600 hover:text-red-600">
                          <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 16.586V13z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{selectedTranslation.downvotes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-600">No translation available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 