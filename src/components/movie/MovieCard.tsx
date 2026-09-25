"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, Bookmark, Heart, Check } from 'lucide-react';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  releaseYear?: string;
  rating?: number;
}

export default function MovieCard({ id, title, posterPath, releaseYear, rating }: MovieCardProps) {
  const imageUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;

  return (
    <Link href={`/movie/${id}`} className="group relative flex flex-col gap-2 w-full">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-surface border border-border-subtle transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/20 z-0 group-hover:z-10">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-text-muted text-sm text-center p-4">
            No Image
          </div>
        )}
        
        {/* Rating Badge */}
        {rating !== undefined && rating > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-canvas/80 backdrop-blur-md px-2 py-1 rounded-sm border border-border-subtle z-20">
            <Star className="w-3 h-3 text-primary fill-primary" />
            <span className="text-xs font-medium text-text-primary">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-4">
          <div className="flex justify-center gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button 
              onClick={(e) => { e.preventDefault(); /* TODO: Implement */ }}
              className="p-2 bg-white/10 hover:bg-white/20 hover:text-primary rounded-full backdrop-blur-md transition-colors text-white"
              title="Add to Watchlist"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); /* TODO: Implement */ }}
              className="p-2 bg-white/10 hover:bg-white/20 hover:text-red-500 rounded-full backdrop-blur-md transition-colors text-white"
              title="Mark as Favorite"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); /* TODO: Implement */ }}
              className="p-2 bg-white/10 hover:bg-white/20 hover:text-primary rounded-full backdrop-blur-md transition-colors text-white"
              title="Mark as Watched"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <h3 className="font-semibold text-text-primary text-sm truncate group-hover:text-primary transition-colors">
          {title}
        </h3>
        {releaseYear && (
          <span className="text-xs text-text-muted">{releaseYear}</span>
        )}
      </div>
    </Link>
  );
}
