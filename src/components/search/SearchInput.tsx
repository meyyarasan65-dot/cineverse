"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Flame } from "lucide-react";

interface SearchInputProps {
  initialQuery?: string;
}

const POPULAR_SUGGESTIONS = [
  { label: "Action", query: "Action" },
  { label: "Sci-Fi", query: "Sci-Fi" },
  { label: "Drama", query: "Drama" },
  { label: "Horror", query: "Horror" },
  { label: "Comedy", query: "Comedy" },
  { label: "Animation", query: "Animation" },
  { label: "Thriller", query: "Thriller" },
];

export default function SearchInput({ initialQuery = "" }: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    router.push("/search");
  };

  const handleSuggestionClick = (query: string) => {
    setSearchTerm(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-2 sm:gap-3">
      {/* Search Bar Capsule */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full bg-surface/90 backdrop-blur-xl border border-border-subtle rounded-full p-1 sm:p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
      >
        <div className="pl-2.5 sm:pl-3 pr-1.5 sm:pr-2 text-primary flex items-center justify-center shrink-0">
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search movies, genres, actors..."
          className="w-full bg-transparent border-none outline-none text-sm sm:text-base text-text-primary placeholder:text-text-muted px-1 sm:px-2 py-1 sm:py-1.5 min-w-0"
          autoFocus={false}
        />

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 sm:p-1.5 mr-1 text-text-muted hover:text-text-primary rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}

        <button
          type="submit"
          className="px-3.5 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-[#00f75e] to-[#00b843] text-canvas font-bold text-xs sm:text-sm rounded-full shadow-[0_4px_14px_rgba(0,224,84,0.3)] hover:brightness-110 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5 px-0.5 -mx-0.5">
        <button
          type="button"
          onClick={() => {
            setSearchTerm("");
            router.push("/search");
          }}
          className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
            !searchTerm
              ? "bg-primary text-canvas shadow-sm"
              : "bg-surface/80 text-text-muted hover:text-text-primary border border-border-subtle hover:border-primary/40"
          }`}
        >
          <Flame className="w-3 h-3" />
          <span>Trending</span>
        </button>

        {POPULAR_SUGGESTIONS.map((item) => {
          const isSelected = searchTerm.toLowerCase() === item.query.toLowerCase();
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleSuggestionClick(item.query)}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary/15 text-primary border border-primary/30 font-semibold shadow-sm"
                  : "bg-surface/80 text-text-muted hover:text-text-primary border border-border-subtle hover:border-primary/40"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
