"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

interface HeroSectionProps {
  trendingMovies: any[];
}

export default function HeroSection({ trendingMovies }: HeroSectionProps) {
  const { user, loading } = useAuthStore();

  // Do not show the Hero section if the user is already logged in
  if (user || loading) return null;

  // Use up to 4 backdrops for the collage
  const collageMovies = trendingMovies?.slice(0, 4) || [];

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center text-center">
      <div className="absolute inset-0 bg-surface overflow-hidden">
         {/* Collage Grid */}
         <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 scale-110 blur-sm opacity-50">
           {collageMovies.map((movie: any, idx: number) => (
             movie?.backdrop_path && (
               <img 
                 key={movie.id || idx}
                 src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
                 alt="Hero Backdrop"
                 className="w-full h-full object-cover"
               />
             )
           ))}
         </div>
         {/* Overlays */}
         <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/80 to-canvas/20" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center gap-6 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-primary drop-shadow-lg">
          Your personal movie diary
        </h1>
        <p className="text-lg md:text-xl text-text-muted drop-shadow-md max-w-2xl">
          Track what you've watched, save what you want to see, and tell your friends what's good.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
          <Link href="/register" className="px-8 py-4 bg-primary text-canvas font-bold rounded-full hover:bg-primary/90 transition-transform hover:scale-105 flex items-center justify-center text-lg">
            Start tracking free
          </Link>
          <Link href="/trending" className="px-8 py-4 bg-surface border border-border-strong text-text-primary font-bold rounded-full hover:bg-surface/80 transition-colors flex items-center justify-center text-lg">
            Browse movies
          </Link>
        </div>
      </div>
    </section>
  );
}
