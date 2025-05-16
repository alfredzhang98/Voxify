import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-16 lg:p-24">
      <div className="z-10 max-w-5xl w-full flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-4">
          Voxify
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-12">
          Discover music beyond language barriers
        </p>
        
        <div className="w-full max-w-2xl mb-12">
          <SearchBar />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
          <FeatureCard 
            title="Translate Lyrics"
            description="Contribute translations and help others understand songs in different languages."
            link="/translate"
            icon="🌐"
          />
          <FeatureCard 
            title="Discover Music"
            description="Find songs and their translations in languages from around the world."
            link="/discover"
            icon="🎵"
          />
          <FeatureCard 
            title="Join Community"
            description="Connect with music lovers and translators from across the globe."
            link="/community"
            icon="👥"
          />
          <FeatureCard 
            title="Get Rewarded"
            description="Earn points and recognition for your valuable translations."
            link="/rewards"
            icon="🏆"
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, description, link, icon }: { 
  title: string; 
  description: string; 
  link: string; 
  icon: string;
}) {
  return (
    <Link 
      href={link}
      className="group rounded-lg border border-gray-300 px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    >
      <h2 className="mb-3 text-2xl font-semibold flex items-center">
        <span className="mr-3 text-3xl">{icon}</span>
        {title}{" "}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          &rarr;
        </span>
      </h2>
      <p className="m-0 max-w-[30ch] text-sm opacity-80">
        {description}
      </p>
    </Link>
  );
}
