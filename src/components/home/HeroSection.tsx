"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

interface HeroSectionProps {
  trendingMovie: any;
}

export default function HeroSection({ trendingMovie }: HeroSectionProps) {
  const { user, loading } = useAuthStore();

  // Do not show the Hero section if the user is already logged in
  if (user || loading) return null;

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] flex items-center">
      <div className="absolute inset-0 bg-surface/50 overflow-hidden">
         {trendingMovie?.backdrop_path && (
           <img 
             src={`https://image.tmdb.org/t/p/original${trendingMovie.backdrop_path}`} 
             alt="Hero Backdrop"
             className="w-full h-full object-cover opacity-40"
           />
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/80 to-transparent" />
         <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/50 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10 flex flex-col gap-6 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text-primary drop-shadow-lg">
          {trendingMovie?.title || "Welcome to the Universe of Cinema"}
        </h1>
        <p className="text-lg md:text-xl text-text-muted">
          {trendingMovie?.overview || "Track films you’ve watched. Save those you want to see. Tell your friends what’s good."}
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
  );
}
