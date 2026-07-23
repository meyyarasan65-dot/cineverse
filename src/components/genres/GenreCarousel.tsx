"use client";

import { useRef, useState, useEffect } from 'react';
import MovieCard from '@/components/movie/MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GenreCarouselProps {
  movies: any[];
}

export default function GenreCarousel({ movies }: GenreCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  const handleScroll = () => {
    checkScroll();
    
    // Add motion blur effect
    if (!isScrolling) setIsScrolling(true);
    
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150); // Removes blur 150ms after scrolling stops
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => {
      window.removeEventListener('resize', checkScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [movies]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      // Scroll by roughly 3-4 cards (600px)
      scrollRef.current.scrollBy({ left: -600, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 600, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 bg-surface/90 backdrop-blur-md border border-border-subtle rounded-full text-text-primary hover:text-primary hover:border-primary transition-all shadow-2xl opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className={`flex gap-4 overflow-x-auto py-4 px-2 -mx-2 hide-scrollbar transition-all duration-300 ease-out will-change-transform ${isScrolling ? 'blur-[0.4px] scale-[0.995] opacity-95' : ''}`}
      >
        {movies.map((movie: any) => (
          <div key={movie.id} className="shrink-0 w-[160px] sm:w-[180px] md:w-[200px] transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 hover:shadow-2xl relative z-0 hover:z-10">
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

      {/* Right Arrow */}
      {canScrollRight && (
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 bg-surface/90 backdrop-blur-md border border-border-subtle rounded-full text-text-primary hover:text-primary hover:border-primary transition-all shadow-2xl opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
