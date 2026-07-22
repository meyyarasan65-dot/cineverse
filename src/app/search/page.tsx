import MovieCard from "@/components/movie/MovieCard";
import { fetchFromTMDB } from "@/lib/tmdb";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q;
  
  let movies = [];
  if (query) {
    const data = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&include_adult=false`);
    movies = data.results || [];
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-3xl font-bold text-text-primary">
          {query ? `Search Results for "${query}"` : "Search Movies"}
        </h1>
        <p className="text-text-muted">
          {query ? `Found ${movies.length} movies matching your query.` : "Enter a search term in the navigation bar to find movies."}
        </p>
      </div>

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie: any) => (
            <MovieCard 
              key={movie.id} 
              id={movie.id}
              title={movie.title || movie.name}
              posterPath={movie.poster_path}
              releaseYear={movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}
              rating={movie.vote_average}
            />
          ))}
        </div>
      ) : query ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-border-subtle rounded-xl bg-surface">
          <h2 className="text-xl font-semibold text-text-primary mb-2">No results found</h2>
          <p className="text-text-muted">We couldn't find any movies matching "{query}". Try a different term.</p>
        </div>
      ) : null}
    </div>
  );
}
