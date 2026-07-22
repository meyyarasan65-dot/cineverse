import Link from 'next/link';
import { Film } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-canvas text-center px-4">
      <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center text-text-muted mb-6">
        <Film className="w-12 h-12" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-text-muted max-w-md mb-8">
        Oops! The movie or page you're looking for seems to have vanished from our universe. 
        It might have been deleted, or the URL might be incorrect.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/" 
          className="px-6 py-3 bg-primary text-canvas font-semibold rounded-md hover:bg-primary/90 transition-colors"
        >
          Go Home
        </Link>
        <Link 
          href="/trending" 
          className="px-6 py-3 bg-surface border border-border-subtle text-text-primary font-medium rounded-md hover:border-primary transition-colors"
        >
          Browse Trending
        </Link>
      </div>
    </div>
  );
}
