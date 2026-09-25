import GenreMovieList from "@/components/genres/GenreMovieList";
import { fetchFromTMDB, getGenres } from "@/lib/tmdb";

export default async function GenreDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const [data, genresData] = await Promise.all([
    fetchFromTMDB(`/discover/movie?with_genres=${resolvedParams.id}&sort_by=popularity.desc`),
    getGenres()
  ]);

  const movies = data.results || [];
  const genre = genresData.genres?.find((g: any) => g.id.toString() === resolvedParams.id);
  const genreName = genre ? genre.name : "Genre";

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-3xl font-bold text-text-primary">{genreName} Movies</h1>
        <p className="text-text-muted">Explore the best {genreName.toLowerCase()} movies.</p>
      </div>

      <GenreMovieList initialMovies={movies} genreId={resolvedParams.id} />
    </div>
  );
}
