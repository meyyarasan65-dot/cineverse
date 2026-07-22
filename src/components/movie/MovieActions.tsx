"use client";

import { useState, useEffect } from 'react';
import { Play, Bookmark, Heart, Check } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';

interface MovieActionsProps {
  movieId: number;
  trailerUrl?: string;
}

export default function MovieActions({ movieId, trailerUrl }: MovieActionsProps) {
  const { user } = useAuthStore();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);
  const [inWatched, setInWatched] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const [watchlistRes, favoritesRes, watchedRes] = await Promise.all([
          supabase.from('watchlist').select('id').eq('user_id', user.id).eq('movie_id', movieId).maybeSingle(),
          supabase.from('favorites').select('id').eq('user_id', user.id).eq('movie_id', movieId).maybeSingle(),
          supabase.from('recently_watched').select('id').eq('user_id', user.id).eq('movie_id', movieId).maybeSingle()
        ]);
        
        if (watchlistRes.data) setInWatchlist(true);
        if (favoritesRes.data) setInFavorites(true);
        if (watchedRes.data) setInWatched(true);
      } catch (error) {
        console.error("Error fetching status", error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user, movieId]);

  const toggleWatchlist = async () => {
    if (!user) return alert("Please log in to add to watchlist");
    
    setInWatchlist(!inWatchlist); // Optimistic UI
    if (!inWatchlist) {
      await supabase.from('watchlist').insert({ user_id: user.id, movie_id: movieId });
    } else {
      await supabase.from('watchlist').delete().eq('user_id', user.id).eq('movie_id', movieId);
    }
  };

  const toggleFavorite = async () => {
    if (!user) return alert("Please log in to add to favorites");

    setInFavorites(!inFavorites); // Optimistic UI
    if (!inFavorites) {
      await supabase.from('favorites').insert({ user_id: user.id, movie_id: movieId });
    } else {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('movie_id', movieId);
    }
  };

  const toggleWatched = async () => {
    if (!user) return alert("Please log in to mark as watched");
    
    setInWatched(!inWatched); // Optimistic UI
    if (!inWatched) {
      await supabase.from('recently_watched').insert({ user_id: user.id, movie_id: movieId });
    } else {
      await supabase.from('recently_watched').delete().eq('user_id', user.id).eq('movie_id', movieId);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      {trailerUrl && (
        <a 
          href={trailerUrl} 
          target="_blank" 
          rel="noreferrer"
          className="px-6 py-3 bg-primary text-canvas font-semibold rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Play className="w-5 h-5 fill-canvas" /> Watch Trailer
        </a>
      )}
      
      <button 
        onClick={toggleWatchlist}
        disabled={loading}
        className={`px-6 py-3 font-medium rounded-md transition-colors flex items-center gap-2 border ${
          inWatchlist 
            ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20' 
            : 'bg-surface border-border-subtle text-text-primary hover:bg-surface/80'
        }`}
      >
        {inWatchlist ? <Check className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        {inWatchlist ? 'In Watchlist' : 'Watchlist'}
      </button>

      <button 
        onClick={toggleFavorite}
        disabled={loading}
        className={`px-6 py-3 font-medium rounded-md transition-colors flex items-center gap-2 border ${
          inFavorites
            ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/20' 
            : 'bg-surface border-border-subtle text-text-primary hover:bg-surface/80'
        }`}
      >
        {inFavorites ? <Heart className="w-5 h-5 fill-red-500 text-red-500" /> : <Heart className="w-5 h-5" />}
        Favorite
      </button>

      <button 
        onClick={toggleWatched}
        disabled={loading}
        className={`px-6 py-3 font-medium rounded-md transition-colors flex items-center gap-2 border ${
          inWatched
            ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20' 
            : 'bg-surface border-border-subtle text-text-primary hover:bg-surface/80'
        }`}
      >
        {inWatched ? <Check className="w-5 h-5 text-primary" /> : <Check className="w-5 h-5 text-text-muted" />}
        {inWatched ? 'Watched' : 'Mark as Watched'}
      </button>
    </div>
  );
}
