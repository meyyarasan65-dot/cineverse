import { Suspense } from 'react';
import { getGenres } from '@/lib/tmdb';
import GenreRow from '@/components/genres/GenreRow';
import { Loader2 } from 'lucide-react';

// Skeletons for the row while it loads
function GenreRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-6 border-b border-border-subtle/50 animate-pulse">
      <div className="h-8 w-48 bg-surface rounded-md"></div>
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="shrink-0 w-[160px] sm:w-[180px] md:w-[200px] aspect-[2/3] bg-surface rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}

export default async function GenresPage() {
  const genresData = await getGenres();
  const genres = genresData.genres || [];

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-3xl font-bold text-text-primary">Browse by Genre</h1>
        <p className="text-text-muted">Find movies that match your mood.</p>
      </div>

      <div className="flex flex-col gap-2">
        {genres.map((genre: any) => (
          <Suspense key={genre.id} fallback={<GenreRowSkeleton />}>
            <GenreRow genreId={genre.id.toString()} genreName={genre.name} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
