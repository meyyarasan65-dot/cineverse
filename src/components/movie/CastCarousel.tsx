"use client";

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CastCarouselProps {
  cast: any[];
}

export default function CastCarousel({ cast }: CastCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>(null);

  const checkArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkArrows();
    window.addEventListener('resize', checkArrows);
    return () => window.removeEventListener('resize', checkArrows);
  }, [cast]);

  const handleScroll = () => {
    checkArrows();
    
    // Apply motion blur effect
    if (!isScrolling) setIsScrolling(true);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-16 z-20 -ml-4 w-10 h-10 rounded-full bg-surface/90 border border-border-subtle shadow-xl flex items-center justify-center text-text-primary hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-16 z-20 -mr-4 w-10 h-10 rounded-full bg-surface/90 border border-border-subtle shadow-xl flex items-center justify-center text-text-primary hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className={`flex gap-4 overflow-x-auto py-4 px-2 -mx-2 hide-scrollbar transition-all duration-300 ease-out will-change-transform ${isScrolling ? 'blur-[0.4px] scale-[0.99]' : 'blur-0 scale-100'}`}
      >
        {cast.slice(0, 15).map((actor: any) => (
          <div key={actor.id} className="flex flex-col gap-2 shrink-0 w-32 group/actor transition-transform duration-300 hover:scale-105 hover:-translate-y-1 hover:z-10 cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-surface border border-border-subtle overflow-hidden relative shadow-md group-hover/actor:shadow-primary/20 group-hover/actor:border-primary/50 transition-all duration-300">
              {actor.profile_path ? (
                <Image 
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                  alt={actor.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/actor:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface/50 text-xs text-text-muted text-center p-2">
                  No Image
                </div>
              )}
            </div>
            <div className="text-sm font-semibold text-text-primary text-center truncate group-hover/actor:text-primary transition-colors">{actor.name}</div>
            <div className="text-xs text-text-muted text-center truncate">{actor.character}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
