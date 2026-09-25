"use client";

import { useState } from "react";
import MovieCard from "@/components/movie/MovieCard";
import { getMoviesByGenreAction } from "@/app/actions";
import { Loader2 } from "lucide-react";

interface GenreMovieListProps {
  initialMovies: any[];
  genreId: string;
}

export default function GenreMovieList({ initialMovies, genreId }: GenreMovieListProps) {
  const [movies, setMovies] = useState<any[]>(initialMovies);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialMovies.length === 20);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    
    const nextPage = page + 1;
    const data = await getMoviesByGenreAction(genreId, nextPage);
    
    const newMovies = data?.results || [];
    
    if (newMovies.length > 0) {
      setMovies((prev) => [...prev, ...newMovies]);
      setPage(nextPage);
      if (newMovies.length < 20) setHasMore(false);
    } else {
      setHasMore(false);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 w-full">
        {movies.map((movie: any, idx: number) => (
          <MovieCard 
            key={`${movie.id}-${idx}`} 
            id={movie.id}
            title={movie.title || movie.name}
            posterPath={movie.poster_path}
            releaseYear={movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}
            rating={movie.vote_average}
          />
        ))}
      </div>
      
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mt-12 px-8 py-3 bg-surface border border-border-subtle hover:bg-canvas text-text-primary font-semibold rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Loading...</>
          ) : (
            "Load More"
          )}
        </button>
      )}
    </div>
  );
}
