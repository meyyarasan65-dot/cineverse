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
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-3">
      {/* Search Bar Capsule */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full bg-surface/90 backdrop-blur-xl border border-white/15 dark:border-white/10 rounded-2xl sm:rounded-full p-2 shadow-[0_8px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/25 transition-all"
      >
        <div className="pl-3 pr-2 text-primary flex items-center justify-center shrink-0">
          <Search className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search movies by title, director, keyword..."
          className="w-full bg-transparent border-none outline-none text-base text-text-primary placeholder:text-text-muted px-2 py-1.5 sm:py-2"
          autoFocus={false}
        />

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 mr-1 text-text-muted hover:text-text-primary rounded-full hover:bg-white/10 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="px-4 sm:px-6 py-2 bg-gradient-to-r from-[#00f75e] to-[#00b843] text-canvas font-bold text-sm sm:text-base rounded-xl sm:rounded-full shadow-[0_4px_14px_rgba(0,224,84,0.35)] hover:brightness-110 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1">
        <button
          type="button"
          onClick={() => {
            setSearchTerm("");
            router.push("/search");
          }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
            !searchTerm
              ? "bg-primary text-canvas shadow-[0_2px_8px_rgba(0,224,84,0.35)]"
              : "bg-surface/80 text-text-muted hover:text-text-primary border border-white/10 hover:border-white/20"
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Trending</span>
        </button>

        {POPULAR_SUGGESTIONS.map((item) => {
          const isSelected = searchTerm.toLowerCase() === item.query.toLowerCase();
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleSuggestionClick(item.query)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary/20 text-primary border border-primary/40 font-semibold shadow-[0_2px_8px_rgba(0,224,84,0.25)]"
                  : "bg-surface/80 text-text-muted hover:text-text-primary border border-white/10 hover:border-white/20"
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
