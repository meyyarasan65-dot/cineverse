import Link from "next/link";
import { Play } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
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
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center">
        {/* Placeholder for Backdrop Image */}
        <div className="absolute inset-0 bg-surface/50 overflow-hidden">
           {trendingMovies[0]?.backdrop_path && (
             <img 
               src={`https://image.tmdb.org/t/p/original${trendingMovies[0].backdrop_path}`} 
               alt="Hero Backdrop"
               className="w-full h-full object-cover opacity-40"
             />
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/80 to-transparent" />
           <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/50 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col gap-6 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-primary drop-shadow-lg">
            {trendingMovies[0]?.title || "Welcome to the Universe of Cinema"}
          </h1>
          <p className="text-lg md:text-xl text-text-muted">
            {trendingMovies[0]?.overview || "Track films you’ve watched. Save those you want to see. Tell your friends what’s good."}
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="/register" className="px-6 py-3 bg-primary text-canvas font-semibold rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center">
              Get Started — It's Free
            </Link>
            <Link href="/trending" className="px-6 py-3 bg-surface border border-border-subtle text-text-primary font-medium rounded-md hover:bg-surface/80 transition-colors flex items-center justify-center">
              Browse Movies
            </Link>
          </div>
        </div>
      </section>

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
