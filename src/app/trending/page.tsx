import MovieCard from "@/components/movie/MovieCard";
import { getTrendingMovies } from "@/lib/tmdb";

export default async function TrendingPage() {
  const trendingData = await getTrendingMovies('week');
  const trendingMovies = trendingData.results || [];

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-3xl font-bold text-text-primary">Trending Movies</h1>
        <p className="text-text-muted">Discover the most popular movies this week.</p>
      </div>
      
      {/* Filters/Toggle Placeholder */}
      <div className="flex gap-4 mb-8 border-b border-border-subtle pb-4">
        <button className="text-primary font-semibold border-b-2 border-primary pb-4 -mb-[17px]">This Week</button>
        <button className="text-text-muted font-semibold hover:text-text-primary transition-colors pb-4">Today</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {trendingMovies.map((movie: any) => (
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
