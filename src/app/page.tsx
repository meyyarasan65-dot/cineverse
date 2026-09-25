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
  
  const trendingMovies = trendingData.results?.slice(0, 10) || [];
  
  const today = new Date().toISOString().split('T')[0];
  let upcomingMovies = (upcomingData.results || [])
    .filter((movie: any) => !trendingMovies.some((t: any) => t.id === movie.id));
    
  const futureMovies = upcomingMovies.filter((movie: any) => movie.release_date && movie.release_date > today);
  
  // TMDB upcoming often returns recently released movies. 
  // If there are no strictly future movies in the first page, fallback to the standard upcoming list.
  if (futureMovies.length >= 4) {
    upcomingMovies = futureMovies;
  }
  
  upcomingMovies = upcomingMovies.slice(0, 10);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <HeroSection trendingMovies={trendingMovies} />

      {/* Trending Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold border-l-4 border-primary pl-3">Trending This Week</h2>
          <Link href="/trending" className="text-sm text-text-muted hover:text-primary transition-colors">View All</Link>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
          {trendingMovies.map((movie: any) => (
            <div key={movie.id} className="snap-start w-[140px] md:w-[200px] flex-shrink-0">
              <MovieCard 
                id={movie.id}
                title={movie.title || movie.name}
                posterPath={movie.poster_path}
                releaseYear={movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}
                rating={movie.vote_average}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="container mx-auto px-4 py-8 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold border-l-4 border-primary pl-3">Releasing Soon</h2>
          <Link href="/coming-soon" className="text-sm text-text-muted hover:text-primary transition-colors">View All</Link>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
          {upcomingMovies.map((movie: any) => (
            <div key={movie.id} className="snap-start w-[140px] md:w-[200px] flex-shrink-0">
              <MovieCard 
                id={movie.id}
                title={movie.title || movie.name}
                posterPath={movie.poster_path}
                releaseYear={movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}
                rating={movie.vote_average}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
