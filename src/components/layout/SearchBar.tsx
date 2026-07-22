"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Film, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Click outside handler
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      setUsers([]);
      return;
    }

    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const searchTerm = query.trim();

        // 1. Fetch Users from Supabase
        const { data: usersData } = await supabase
          .from('users')
          .select('id, username, avatar_url')
          .ilike('username', `%${searchTerm}%`)
          .limit(3);

        // 2. Fetch Movies via our server action to protect API key
        // We'll create a new server action just for searching if needed, 
        // but it's cleaner to just fetch the client-side API route if we had one.
        // Wait, we need a server action for search since TMDB key is private.
        // We can use fetch(`/api/search?q=${searchTerm}`) if we make an API route.
        // Let's use the API route approach for clean architecture.
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
        const tmdbData = await res.json();

        setUsers(usersData || []);
        setMovies(tmdbData?.results?.slice(0, 3) || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchRecommendations();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsFocused(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative hidden md:block z-50">
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-surface border border-border-subtle rounded-full px-3 py-1.5 focus-within:border-primary transition-colors"
      >
        <Search className="w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search movies & users..."
          className="bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted ml-2 w-48 focus:w-64 transition-all"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsFocused(true); // Re-open if they type again
          }}
          onFocus={() => setIsFocused(true)}
        />
      </form>

      {/* Recommendations Dropdown */}
      {isFocused && query.trim().length > 0 && (
        <div className="absolute top-full mt-2 left-0 w-full bg-surface border border-border-subtle rounded-lg shadow-xl overflow-hidden py-2 text-sm">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : (movies.length === 0 && users.length === 0) ? (
            <div className="px-4 py-3 text-text-muted text-center">No results found</div>
          ) : (
            <div className="flex flex-col">
              {/* Users Section */}
              {users.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-1 text-xs font-semibold text-text-muted uppercase tracking-wider">Users</div>
                  {users.map(u => (
                    <Link
                      key={u.id}
                      href={`/user/${u.username}`}
                      onClick={() => setIsFocused(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-canvas transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <span className="text-text-primary font-medium">{u.username}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Movies Section */}
              {movies.length > 0 && (
                <div>
                  <div className="px-4 py-1 text-xs font-semibold text-text-muted uppercase tracking-wider">Movies</div>
                  {movies.map(m => (
                    <Link
                      key={m.id}
                      href={`/movie/${m.id}`}
                      onClick={() => setIsFocused(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-canvas transition-colors"
                    >
                      <div className="w-8 h-12 bg-canvas rounded flex items-center justify-center shrink-0 overflow-hidden">
                        {m.poster_path ? (
                          <img src={`https://image.tmdb.org/t/p/w92${m.poster_path}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Film className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-text-primary font-medium line-clamp-1">{m.title || m.name}</span>
                        <span className="text-xs text-text-muted">{m.release_date?.split('-')[0]}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
