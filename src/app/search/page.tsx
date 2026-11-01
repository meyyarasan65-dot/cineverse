import MovieCard from "@/components/movie/MovieCard";
import SearchInput from "@/components/search/SearchInput";
import { fetchFromTMDB, getTrendingMovies } from "@/lib/tmdb";
import { Flame, Film, Sparkles, TrendingUp } from "lucide-react";
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
    <div className="container mx-auto px-4 py-6 sm:py-10 min-h-screen flex flex-col gap-8">
      {/* Search Header Banner */}
      <div className="flex flex-col items-center text-center gap-3 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Discover Cinema</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">
          Find Your Next Favorite Film
        </h1>
        <p className="text-sm sm:text-base text-text-muted max-w-xl">
          Search thousands of movies, discover hidden gems, or check out what's currently trending worldwide.
        </p>

        {/* Search Input Box */}
        <div className="w-full mt-2">
          <SearchInput key={query} initialQuery={query} />
        </div>
      </div>

      {/* Main Content Area */}
      {isSearching ? (
        /* Searched State */
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary flex items-center gap-2">
                <span>Search Results for</span>
                <span className="text-primary italic">"{query}"</span>
              </h2>
              <p className="text-sm text-text-muted mt-1">
                {hasResults
                  ? `Found ${searchResults.length} movies matching your query.`
                  : "No matches found."}
              </p>
            </div>

            <Link
              href="/search"
              className="text-xs sm:text-sm font-semibold text-text-muted hover:text-primary transition-colors self-start sm:self-auto flex items-center gap-1"
            >
              <Flame className="w-4 h-4 text-[#02d450]" />
              <span>View Trending Movies</span>
            </Link>
          </div>

          {hasResults ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
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
            <div className="flex flex-col gap-10">
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-border-subtle rounded-2xl bg-surface/60 backdrop-blur-md">
                <div className="w-14 h-14 rounded-full bg-canvas/80 border border-white/10 flex items-center justify-center text-text-muted mb-4">
                  <Film className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  No movies found matching "{query}"
                </h3>
                <p className="text-sm text-text-muted max-w-md mb-6">
                  Check your spelling or try different keywords. Or explore what's popular with cinema lovers right now below.
                </p>
                <Link
                  href="/search"
                  className="px-5 py-2.5 bg-primary text-canvas font-bold text-sm rounded-xl shadow-[0_4px_14px_rgba(0,224,84,0.35)] hover:brightness-110 transition-all"
                >
                  Explore Trending Movies
                </Link>
              </div>

              {/* Trending fallback recommendations */}
              {trendingMovies.length > 0 && (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-bold text-text-primary">
                      Trending Movies Instead
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
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
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/25 text-[#02d450]">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                  Trending Movies
                </h2>
                <p className="text-xs sm:text-sm text-text-muted">
                  The most popular films being watched and discussed right now.
                </p>
              </div>
            </div>

            <Link
              href="/trending"
              className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Explore full trending list</span>
              <span>→</span>
            </Link>
          </div>

          {trendingMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
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
            <div className="text-center py-12 text-text-muted">
              Loading trending films...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
