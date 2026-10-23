import Link from "next/link";
import MovieCard from "@/components/movie/MovieCard";
import AutoHeroSlider from "@/components/common/AutoHeroSlider";
import { getTrendingMovies } from "@/lib/tmdb";

export default async function TrendingPage({ searchParams }: { searchParams: Promise<{ time?: string }> }) {
  const { time: rawTime } = await searchParams;
  const time = rawTime === "day" ? "day" : "week";
  
  const trendingData = await getTrendingMovies(time);
  const trendingMovies = trendingData.results || [];

  // Select top movies with backdrop for the hero carousel
  const heroMovies = trendingMovies
    .filter((movie: any) => Boolean(movie.backdrop_path))
    .slice(0, 8);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 min-h-screen">
      {/* Auto-Changing Hero Section */}
      {heroMovies.length > 0 && (
        <AutoHeroSlider 
          movies={heroMovies} 
          categoryType="trending"
          autoPlayInterval={6000}
        />
      )}

      {/* Page Title & Filter Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Explore Trending Movies
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Discover the most watched and talked-about movies this {time === "day" ? "day" : "week"}.
          </p>
        </div>
        
        {/* 3D Curved Filter Pills */}
        <div className="flex items-center p-1 rounded-2xl bg-surface border-t border-l border-r border-white/15 border-b border-black/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.35),0_4px_12px_rgba(0,0,0,0.2)] self-start sm:self-auto">
          <Link 
            href="/trending?time=week" 
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              time === "week" 
                ? "text-primary bg-primary/15 border border-primary/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_2px_8px_rgba(0,224,84,0.25)]" 
                : "text-text-muted hover:text-text-primary border border-transparent"
            }`}
          >
            This Week
          </Link>
          <Link 
            href="/trending?time=day" 
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              time === "day" 
                ? "text-primary bg-primary/15 border border-primary/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_2px_8px_rgba(0,224,84,0.25)]" 
                : "text-text-muted hover:text-text-primary border border-transparent"
            }`}
          >
            Trending Today
          </Link>
        </div>
      </div>

      {/* Grid of Movies */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {trendingMovies.map((movie: any) => (
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
