import MovieCard from "@/components/movie/MovieCard";
import { fetchFromTMDB } from "@/lib/tmdb";

export default async function ComingSoonPage() {
  const data = await fetchFromTMDB('/movie/upcoming');
  const movies = data.results || [];

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-3xl font-bold text-text-primary">Coming Soon</h1>
        <p className="text-text-muted">Discover highly anticipated upcoming movie releases.</p>
      </div>

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
    </div>
  );
}
