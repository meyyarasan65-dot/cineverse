const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchFromTMDB(endpoint: string, options?: RequestInit) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('TMDB_API_KEY is not defined in environment variables.');
  }

  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${TMDB_BASE_URL}${endpoint}${separator}api_key=${apiKey}`;

  const res = await fetch(url, {
    ...options,
    next: { revalidate: 3600, ...options?.next }, // Cache for 1 hour by default
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch from TMDB: ${res.statusText}`);
  }

  return res.json();
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  return fetchFromTMDB(`/trending/movie/${timeWindow}`);
}

export async function getMovie(id: string) {
  return fetchFromTMDB(`/movie/${id}?append_to_response=credits,videos,similar`);
}

export async function getGenres() {
  return fetchFromTMDB(`/genre/movie/list`);
}
