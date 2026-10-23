import { Suspense } from "react";
import Link from "next/link";
import { getGenres, fetchFromTMDB } from "@/lib/tmdb";
import GenreRow from "@/components/genres/GenreRow";
import AutoHeroSlider from "@/components/common/AutoHeroSlider";
import { Sparkles } from "lucide-react";

// Skeletons for the row while it loads
function GenreRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-6 border-b border-border-subtle/50 animate-pulse">
      <div className="h-8 w-48 bg-surface rounded-xl"></div>
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="shrink-0 w-[160px] sm:w-[180px] md:w-[200px] aspect-[2/3] bg-surface rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
}

export default async function GenresPage() {
  const [genresData, featuredData] = await Promise.all([
    getGenres(),
    fetchFromTMDB("/discover/movie?sort_by=popularity.desc&vote_count.gte=200"),
  ]);

  const genres = genresData.genres || [];
  
  // Build a lookup map of genre id -> genre name
  const genresMap: Record<number, string> = {};
  genres.forEach((g: { id: number; name: string }) => {
    genresMap[g.id] = g.name;
  });

  // Filter top movies with backdrop for the hero carousel
  const heroMovies = (featuredData.results || [])
    .filter((movie: any) => Boolean(movie.backdrop_path))
    .slice(0, 8);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 min-h-screen">
      {/* Auto-Changing Hero Section for Genres */}
      {heroMovies.length > 0 && (
        <AutoHeroSlider 
          movies={heroMovies} 
          categoryType="genres"
          genresMap={genresMap}
          autoPlayInterval={6000}
        />
      )}

      {/* Header and Quick Genre Filter Pills */}
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Browse by Genre
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Explore movies curated across your favorite cinematic universes and themes.
          </p>
        </div>

        {/* Quick Jump Category Chips with 3D Curved Finish */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {genres.slice(0, 12).map((genre: any) => (
            <a
              key={genre.id}
              href={`#genre-${genre.id}`}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-surface border-t border-l border-r border-white/15 border-b border-black/30 text-text-muted hover:text-primary hover:border-primary/40 shadow-[0_2px_6px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_10px_rgba(0,224,84,0.2)] whitespace-nowrap transition-all shrink-0 active:scale-95"
            >
              {genre.name}
            </a>
          ))}
        </div>
      </div>

      {/* Genre Rows */}
      <div className="flex flex-col gap-2">
        {genres.map((genre: any) => (
          <Suspense key={genre.id} fallback={<GenreRowSkeleton />}>
            <GenreRow genreId={genre.id.toString()} genreName={genre.name} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
