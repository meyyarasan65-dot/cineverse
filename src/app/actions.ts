"use server";

import { getMovie } from "@/lib/tmdb";

// Server action to fetch movie details safely from client components
export async function getMovieDetailsAction(id: string) {
  try {
    const data = await getMovie(id);
    return data;
  } catch (error) {
    console.error("Failed to fetch movie:", error);
    return null;
  }
}

export async function getMoviesByGenreAction(genreId: string, page: number = 1) {
  try {
    const data = await fetchFromTMDB(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`);
    return data;
  } catch (error) {
    console.error("Failed to fetch genre movies:", error);
    return { results: [] };
  }
}
