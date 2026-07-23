import Link from 'next/link';
import { getMoviesByGenre } from '@/lib/tmdb';
import GenreCarousel from '@/components/genres/GenreCarousel';
import { ChevronRight } from 'lucide-react';

interface GenreRowProps {
  genreId: string;
  genreName: string;
}

export default async function GenreRow({ genreId, genreName }: GenreRowProps) {
  const data = await getMoviesByGenre(genreId);
  const movies = data.results || [];

  if (movies.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 py-6 border-b border-border-subtle/50 last:border-0 relative">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold text-text-primary capitalize tracking-tight">
          {genreName}
        </h2>
        <Link 
          href={`/genres/${genreId}`}
          className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <GenreCarousel movies={movies} />
    </div>
  );
}
