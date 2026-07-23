import Link from "next/link";
import { Play } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import HeroSection from "@/components/home/HeroSection";
import { getTrendingMovies, fetchFromTMDB } from "@/lib/tmdb";

export default async function Home() {
  const [trendingData, upcomingData] = await Promise.all([
    getTrendingMovies('week'),
    fetchFromTMDB('/movie/upcoming')
  ]);
  
  const trendingMovies = trendingData.results?.slice(0, 6) || [];
  const upcomingMovies = upcomingData.results?.slice(0, 6) || [];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <HeroSection trendingMovie={trendingMovies[0]} />

      {/* Trending Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold border-l-4 border-primary pl-3">Trending This Week</h2>
          <Link href="/trending" className="text-sm text-text-muted hover:text-primary transition-colors">View All</Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
      </section>

      {/* Coming Soon Section */}
      <section className="container mx-auto px-4 py-8 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold border-l-4 border-primary pl-3">Coming Soon</h2>
          <Link href="/coming-soon" className="text-sm text-text-muted hover:text-primary transition-colors">View All</Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {upcomingMovies.map((movie: any) => (
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
      </section>
    </div>
  );
}
