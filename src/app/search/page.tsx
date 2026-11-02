import MovieCard from "@/components/movie/MovieCard";
import SearchInput from "@/components/search/SearchInput";
import { fetchFromTMDB, getTrendingMovies } from "@/lib/tmdb";
import { Flame, Film, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q?.trim() || "";

  let searchResults: any[] = [];
  let trendingMovies: any[] = [];

  // Always fetch trending movies for default view or fallback recommendations
  try {
    const trendingData = await getTrendingMovies("week");
    trendingMovies = trendingData.results || [];
  } catch (err) {
    console.error("Failed to fetch trending movies:", err);
  }

  if (query) {
    try {
      const data = await fetchFromTMDB(
        `/search/movie?query=${encodeURIComponent(query)}&include_adult=false`
      );
      searchResults = data.results || [];
    } catch (err) {
      console.error("Failed to fetch search results:", err);
    }
  }

  const isSearching = Boolean(query);
  const hasResults = searchResults.length > 0;

  return (
    <div className="container mx-auto px-3.5 sm:px-6 pt-3 sm:pt-6 pb-28 md:pb-16 min-h-screen flex flex-col gap-4 sm:gap-8">
      {/* Sticky Search Header Bar */}
      <div className="sticky top-[60px] sm:top-[72px] z-30 -mx-3.5 sm:-mx-6 px-3.5 sm:px-6 py-2 sm:py-3 bg-canvas/85 backdrop-blur-xl border-b border-border-subtle/60 transition-all">
        <SearchInput key={query} initialQuery={query} />
      </div>

      {/* Main Content Area */}
      {isSearching ? (
        /* Searched State */
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex items-center justify-between gap-2 border-b border-border-subtle pb-3">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-extrabold text-text-primary flex items-center gap-1.5 flex-wrap">
                <span>Results for</span>
                <span className="text-primary italic truncate">"{query}"</span>
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                {hasResults
                  ? `Found ${searchResults.length} matching movies`
                  : "No matches found"}
              </p>
            </div>

            <Link
              href="/search"
              className="text-xs sm:text-sm font-semibold text-text-muted hover:text-primary transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full bg-surface border border-border-subtle shadow-sm"
            >
              <Flame className="w-3.5 h-3.5 text-[#02d450]" />
              <span>Trending</span>
            </Link>
          </div>

          {hasResults ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {searchResults.map((movie: any) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title || movie.name}
                  posterPath={movie.poster_path}
                  releaseYear={
                    movie.release_date?.split("-")[0] ||
                    movie.first_air_date?.split("-")[0]
                  }
                  rating={movie.vote_average}
                />
              ))}
            </div>
          ) : (
            /* No Results State */
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-border-subtle rounded-2xl bg-surface/60 backdrop-blur-md">
                <div className="w-12 h-12 rounded-full bg-canvas border border-border-subtle flex items-center justify-center text-text-muted mb-3">
                  <Film className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-1">
                  No movies found matching "{query}"
                </h3>
                <p className="text-xs sm:text-sm text-text-muted max-w-sm mb-4">
                  Check your spelling or explore the trending films below.
                </p>
                <Link
                  href="/search"
                  className="px-4 py-2 bg-primary text-canvas font-bold text-xs sm:text-sm rounded-xl shadow-md hover:brightness-110 transition-all"
                >
                  Explore Trending Movies
                </Link>
              </div>

              {/* Trending fallback recommendations */}
              {trendingMovies.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="text-lg sm:text-xl font-bold text-text-primary">
                      Trending Movies Instead
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                    {trendingMovies.slice(0, 12).map((movie: any) => (
                      <MovieCard
                        key={movie.id}
                        id={movie.id}
                        title={movie.title || movie.name}
                        posterPath={movie.poster_path}
                        releaseYear={
                          movie.release_date?.split("-")[0] ||
                          movie.first_air_date?.split("-")[0]
                        }
                        rating={movie.vote_average}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Default State: Trending Movies View */
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex items-center justify-between gap-2 border-b border-border-subtle pb-3">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-xl bg-primary/10 border border-primary/25 text-[#02d450] shrink-0">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-2xl font-extrabold text-text-primary tracking-tight truncate">
                  Trending Movies
                </h2>
                <p className="hidden sm:block text-xs sm:text-sm text-text-muted truncate">
                  The most popular films being watched and discussed right now.
                </p>
              </div>
            </div>

            <Link
              href="/trending"
              className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full bg-surface border border-border-subtle shadow-sm"
            >
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>

          {trendingMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {trendingMovies.map((movie: any) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title || movie.name}
                  posterPath={movie.poster_path}
                  releaseYear={
                    movie.release_date?.split("-")[0] ||
                    movie.first_air_date?.split("-")[0]
                  }
                  rating={movie.vote_average}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted text-sm">
              Loading trending films...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
