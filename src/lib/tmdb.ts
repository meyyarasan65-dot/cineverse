const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchFromTMDB(endpoint: string, options?: RequestInit) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('TMDB_API_KEY is not defined in environment variables.');
  }

  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${TMDB_BASE_URL}${endpoint}${separator}api_key=${apiKey}`;

  try {
    const res = await fetch(url, {
      ...options,
      next: { revalidate: 3600, ...options?.next }, // Cache for 1 hour by default
    });

    if (!res.ok) {
      console.warn(`TMDB response error [${res.status}]: ${res.statusText}`);
      return { results: [] };
    }

    return res.json();
  } catch (err) {
    console.warn(`TMDB fetch failed for ${endpoint}:`, err);
    return { results: [] };
  }
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  if (timeWindow === 'day') {
    return fetchFromTMDB(`/movie/now_playing`);
  }
  return fetchFromTMDB(`/trending/movie/week`);
}

export async function getMovie(id: string) {
  return fetchFromTMDB(`/movie/${id}?append_to_response=credits,videos,similar,watch/providers`);
}

export async function getGenres() {
  return fetchFromTMDB(`/genre/movie/list`);
}

export async function getMoviesByGenre(genreId: string) {
  return fetchFromTMDB(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`);
}
