import Image from 'next/image';
import { Star, Clock, Calendar } from 'lucide-react';
import MovieCard from '@/components/movie/MovieCard';
import MovieActions from '@/components/movie/MovieActions';
import MovieReviews from '@/components/movie/MovieReviews';
import GenreCarousel from '@/components/genres/GenreCarousel';
import CastCarousel from '@/components/movie/CastCarousel';
import { getMovie } from '@/lib/tmdb';
import { notFound } from 'next/navigation';

export default async function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const movie = await getMovie(resolvedParams.id);
  
  if (!movie || movie.success === false) {
    notFound();
  }

  const releaseYear = movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0];
  const trailer = movie.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
  
  return (
    <div className="flex flex-col w-full bg-canvas min-h-screen">
      {/* Backdrop Hero */}
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <div className="absolute inset-0 bg-surface/30">
          {movie.backdrop_path && (
             <img 
               src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
               alt="Hero Backdrop"
               className="w-full h-full object-cover opacity-30"
             />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/80 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 container mx-auto flex flex-col md:flex-row gap-8 items-end z-10">
          {/* Poster */}
          <div className="hidden md:block w-48 lg:w-64 aspect-[2/3] bg-surface rounded-lg shadow-2xl overflow-hidden border border-border-subtle shrink-0 relative">
             {movie.poster_path ? (
               <Image
                 src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                 alt={movie.title || movie.name}
                 fill
                 className="object-cover"
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-text-muted text-sm bg-surface/50">
                 No Poster
               </div>
             )}
          </div>
          
          {/* Info */}
          <div className="flex flex-col gap-4 z-10 w-full max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight drop-shadow-lg">
              {movie.title || movie.name}
            </h1>
            {movie.tagline && <p className="text-lg md:text-xl italic text-text-muted drop-shadow-md">{movie.tagline}</p>}
            
            {movie.overview && (
              <p className="text-text-primary/90 text-sm md:text-base lg:text-lg leading-relaxed drop-shadow-md bg-surface/40 backdrop-blur-sm p-4 rounded-lg border border-border-subtle/50 mb-2">
                {movie.overview}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-text-primary">
              <div className="flex items-center gap-1 bg-surface px-3 py-1 rounded-full border border-border-subtle">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span>{movie.vote_average?.toFixed(1) || '0.0'}</span>
              </div>
              {releaseYear && (
                <div className="flex items-center gap-1 text-text-muted">
                  <Calendar className="w-4 h-4" />
                  <span>{releaseYear}</span>
                </div>
              )}
              {movie.runtime > 0 && (
                <div className="flex items-center gap-1 text-text-muted">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {movie.genres?.map((g: any) => (
                <span key={g.id} className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-surface border border-border-subtle text-text-muted rounded-md">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-12 py-12 flex flex-col gap-12">
        {/* Actions */}
        <MovieActions 
          movieId={movie.id} 
          movieTitle={movie.title || movie.name}
          trailerUrl={trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : undefined} 
        />


        {/* Cast */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">Top Cast</h2>
            <CastCarousel cast={movie.credits.cast} />
          </div>
        )}

        {/* Similar Movies */}
        {movie.similar?.results && movie.similar.results.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-l-4 border-primary pl-3">Movies Like This</h2>
            <div className="-mx-2">
              <GenreCarousel movies={movie.similar.results.slice(0, 15)} />
            </div>
          </div>
        )}

        {/* Reviews */}
        <MovieReviews movieId={movie.id} />
      </div>
    </div>
  );
}
