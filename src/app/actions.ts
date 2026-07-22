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
