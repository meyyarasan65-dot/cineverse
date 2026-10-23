import MovieCard from "@/components/movie/MovieCard";
import AutoHeroSlider from "@/components/common/AutoHeroSlider";
import { fetchFromTMDB } from "@/lib/tmdb";
import { Calendar, Clock } from "lucide-react";

export default async function ComingSoonPage() {
  const today = new Date().toISOString().split("T")[0];
  const data = await fetchFromTMDB(
    `/discover/movie?primary_release_date.gte=${today}&sort_by=popularity.desc`
  );
  const movies = data.results || [];

  // Filter top upcoming movies with backdrop for the hero carousel
  const heroMovies = movies
    .filter((movie: any) => Boolean(movie.backdrop_path))
    .slice(0, 8);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 min-h-screen">
      {/* Auto-Changing Hero Section for Coming Soon */}
      {heroMovies.length > 0 && (
        <AutoHeroSlider 
          movies={heroMovies} 
          categoryType="coming-soon"
          autoPlayInterval={6000}
        />
      )}

      {/* Page Title & Context */}
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Anticipated Upcoming Releases
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Clock className="w-3.5 h-3.5" />
            In Theaters Soon
          </span>
        </div>
        <p className="text-sm text-text-muted">
          Track release countdowns and discover the most anticipated blockbuster debuts.
        </p>
      </div>

      {/* Grid of Upcoming Movies */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {movies.map((movie: any) => (
          <MovieCard 
            key={movie.id} 
            id={movie.id}
            title={movie.title || movie.name}
            posterPath={movie.poster_path}
            releaseYear={movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]}
            rating={movie.vote_average}
          />
        ))}
      </div>
    </div>
  );
}
