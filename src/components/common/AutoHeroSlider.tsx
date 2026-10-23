"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Play, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Calendar, 
  Flame, 
  Sparkles, 
  Clock,
  Pause,
  ArrowRight
} from "lucide-react";

export interface HeroMovie {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  popularity?: number;
}

interface AutoHeroSliderProps {
  movies: HeroMovie[];
  categoryType: "trending" | "genres" | "coming-soon";
  genresMap?: Record<number, string>;
  titleBadge?: string;
  autoPlayInterval?: number;
}

// Fallback genre mappings if not provided
const DEFAULT_GENRES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export default function AutoHeroSlider({
  movies = [],
  categoryType,
  genresMap = DEFAULT_GENRES,
  titleBadge,
  autoPlayInterval = 6000,
}: AutoHeroSliderProps) {
  // Filter movies that have a backdrop image
  const validMovies = movies.filter((m) => Boolean(m.backdrop_path));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const movieCount = validMovies.length;
  const currentMovie = validMovies[currentIndex] || validMovies[0];

  // Helper to change slide
  const nextSlide = useCallback(() => {
    if (movieCount <= 1) return;
    setDirection("next");
    setCurrentIndex((prev) => (prev + 1) % movieCount);
  }, [movieCount]);

  const prevSlide = useCallback(() => {
    if (movieCount <= 1) return;
    setDirection("prev");
    setCurrentIndex((prev) => (prev - 1 + movieCount) % movieCount);
  }, [movieCount]);

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? "next" : "prev");
    setCurrentIndex(index);
  };

  // Auto-play interval timer
  useEffect(() => {
    if (isPaused || movieCount <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, autoPlayInterval, movieCount, nextSlide]);

  if (!currentMovie) {
    return null;
  }

  // Format release date and countdown
  const releaseDateStr = currentMovie.release_date || currentMovie.first_air_date;
  const releaseYear = releaseDateStr ? releaseDateStr.split("-")[0] : null;

  let releaseCountdown: string | null = null;
  let formattedReleaseDate: string | null = null;
  if (releaseDateStr) {
    const rDate = new Date(releaseDateStr);
    formattedReleaseDate = rDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const now = new Date();
    const diffTime = rDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      releaseCountdown = diffDays === 1 ? "Releasing tomorrow" : `In ${diffDays} days`;
    } else if (diffDays === 0) {
      releaseCountdown = "Releasing today!";
    }
  }

  // Genre names for current movie
  const movieGenres = (currentMovie.genre_ids || [])
    .map((id) => genresMap[id] || DEFAULT_GENRES[id])
    .filter(Boolean)
    .slice(0, 3);

  // Compute category-specific badge
  const renderBadge = () => {
    if (titleBadge) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-primary/20 text-primary border border-primary/40 backdrop-blur-md shadow-[0_0_12px_rgba(0,224,84,0.25)]">
          {titleBadge}
        </span>
      );
    }

    if (categoryType === "trending") {
      return (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-red-500/20 to-orange-500/20 text-orange-400 border border-orange-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(249,115,22,0.25)]">
          <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse fill-orange-400" />
          <span>Trending Spotlight #{currentIndex + 1}</span>
        </div>
      );
    }

    if (categoryType === "genres") {
      return (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.25)]">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>Featured Across Genres</span>
        </div>
      );
    }

    if (categoryType === "coming-soon") {
      return (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.25)]">
          <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Upcoming Release • {releaseCountdown || "Coming Soon"}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="relative w-full group select-none mb-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 3D Curved Main Frame Container */}
      <div className="relative w-full h-[520px] sm:h-[580px] md:h-[640px] rounded-3xl md:rounded-[32px] overflow-hidden bg-surface border-t border-l border-r border-white/20 dark:border-white/15 border-b-2 border-black/40 dark:border-black/60 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),0_10px_20px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-2px_4px_rgba(0,0,0,0.4)]">
        
        {/* Top Rim 3D Specular Highlight Line */}
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent z-30 pointer-events-none" />

        {/* Backdrop Images with Crossfade */}
        {validMovies.map((movie, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={movie.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title || movie.name || "Movie Backdrop"}
                className={`w-full h-full object-cover object-center transform transition-transform duration-[8000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />
            </div>
          );
        })}

        {/* Cinematic Vignette and Gradient Masks */}
        {/* Deep Left Vignette for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/85 md:via-canvas/75 to-transparent z-20 pointer-events-none w-full md:w-[75%]" />
        
        {/* Full Bottom-to-Top Canvas Fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/40 to-black/30 z-20 pointer-events-none" />
        
        {/* Subtle Radial Ambient Spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-20 pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-30 h-full flex flex-col justify-end md:justify-center p-6 sm:p-10 md:p-14 max-w-3xl">
          
          {/* Top Badge & Tags */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {renderBadge()}

            {/* Quality pill */}
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-white/10 text-text-primary border border-white/15 backdrop-blur-md">
              4K Ultra HD
            </span>

            {/* Star Rating */}
            {currentMovie.vote_average !== undefined && currentMovie.vote_average > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-canvas/60 text-amber-400 border border-amber-500/30 backdrop-blur-md shadow-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{currentMovie.vote_average.toFixed(1)}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] mb-3 line-clamp-2">
            {currentMovie.title || currentMovie.name}
          </h1>

          {/* Meta Details Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-text-muted mb-4 font-medium">
            {releaseYear && (
              <span className="flex items-center gap-1 text-text-primary font-semibold">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {formattedReleaseDate || releaseYear}
              </span>
            )}

            {movieGenres.length > 0 && (
              <>
                <span className="hidden sm:inline text-white/30">•</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {movieGenres.map((genre) => (
                    <span
                      key={genre}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface/80 border border-white/10 text-text-muted backdrop-blur-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Synopsis */}
          {currentMovie.overview && (
            <p className="text-sm sm:text-base text-text-muted/90 line-clamp-2 sm:line-clamp-3 leading-relaxed mb-8 max-w-2xl drop-shadow-sm">
              {currentMovie.overview}
            </p>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href={`/movie/${currentMovie.id}`}
              className="px-6 py-3.5 bg-gradient-to-r from-primary to-[#00b843] text-canvas font-bold text-sm sm:text-base rounded-2xl shadow-[0_6px_20px_rgba(0,224,84,0.4),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-2px_2px_rgba(0,0,0,0.3)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2.5"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-canvas" />
              <span>Explore Movie</span>
            </Link>

            <Link
              href={`/movie/${currentMovie.id}`}
              className="px-5 py-3.5 bg-surface/70 hover:bg-surface border-t border-l border-r border-white/20 border-b-2 border-black/30 text-text-primary font-semibold text-sm sm:text-base rounded-2xl backdrop-blur-xl shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-primary/40 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-text-muted" />
              <span>More Details</span>
            </Link>
          </div>
        </div>

        {/* Bottom Right Floating Carousel Navigation & Thumbnails */}
        <div className="absolute bottom-6 right-6 z-30 hidden sm:flex items-center gap-3">
          
          {/* Slide Indicator Dots / Mini Pills */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-surface/80 backdrop-blur-xl border border-white/10 shadow-lg">
            {validMovies.slice(0, 7).map((m, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={m.id}
                  onClick={() => goToSlide(idx)}
                  className={`relative h-2 rounded-full transition-all duration-300 ${
                    isActive 
                      ? "w-8 bg-primary shadow-[0_0_10px_rgba(0,224,84,0.5)]" 
                      : "w-2 bg-white/25 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  {isActive && !isPaused && (
                    <span 
                      key={currentIndex}
                      className="absolute inset-0 bg-white/40 rounded-full animate-[progress_6s_linear]" 
                      style={{ animationDuration: `${autoPlayInterval}ms` }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevSlide}
              aria-label="Previous Movie"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-surface/80 hover:bg-surface text-text-primary border border-white/15 backdrop-blur-xl shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Movie"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-surface/80 hover:bg-surface text-text-primary border border-white/15 backdrop-blur-xl shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Mini Arrows (at the top right so they don't cover bottom buttons) */}
        <div className="sm:hidden absolute top-4 right-4 z-30 flex items-center gap-1.5">
          <button
            onClick={prevSlide}
            aria-label="Previous"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-surface/80 backdrop-blur-md text-text-primary border border-white/10 active:scale-90 transition-transform"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-surface/80 backdrop-blur-md text-text-primary border border-white/10 active:scale-90 transition-transform"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Global Progress Bar along the bottom of the container */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
          <div
            key={currentIndex}
            className={`h-full bg-primary transition-all shadow-[0_0_8px_rgba(0,224,84,0.6)] ${
              isPaused ? "opacity-40" : "animate-[sliderProgress_linear_forwards]"
            }`}
            style={{
              animationDuration: `${autoPlayInterval}ms`,
            }}
          />
        </div>

      </div>
    </div>
  );
}
