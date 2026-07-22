import Link from 'next/link';
import { getGenres } from '@/lib/tmdb';

export default async function GenresPage() {
  const genresData = await getGenres();
  const genres = genresData.genres || [];

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-3xl font-bold text-text-primary">Browse by Genre</h1>
        <p className="text-text-muted">Find movies that match your mood.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {genres.map((genre: any) => (
          <Link 
            key={genre.id} 
            href={`/genres/${genre.id}`}
            className="flex items-center justify-center p-6 bg-surface border border-border-subtle rounded-lg text-text-primary font-semibold hover:bg-primary hover:text-canvas hover:border-primary transition-colors text-center"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
