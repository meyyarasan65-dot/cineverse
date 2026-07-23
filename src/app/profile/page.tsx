"use client";

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';
import { getMovieDetailsAction } from '@/app/actions';
import MovieCard from '@/components/movie/MovieCard';
import UserListModal from '@/components/profile/UserListModal';
import { Film, Heart, Bookmark, Check, Loader2, Users, MessageSquare, Star, BookOpen, Globe, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function ProfilePage() {
  const { user, loading: authLoading } = useAuthStore();
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [watched, setWatched] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'watchlist' | 'favorites' | 'watched' | 'reviews'>('watchlist');
  const [searchUser, setSearchUser] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>('followers');
  
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkArrows = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkArrows();
    window.addEventListener('resize', checkArrows);
    return () => window.removeEventListener('resize', checkArrows);
  }, [watchlist, favorites, watched, reviews]);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const amount = direction === 'left' ? -200 : 200;
      tabsRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };
  
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [watchlistRes, favoritesRes, watchedRes, reviewsRes, followersRes, followingRes] = await Promise.all([
          supabase.from('watchlist').select('movie_id').eq('user_id', user.id).order('added_at', { ascending: false }),
          supabase.from('favorites').select('movie_id').eq('user_id', user.id).order('added_at', { ascending: false }),
          supabase.from('recently_watched').select('movie_id').eq('user_id', user.id).order('watched_at', { ascending: false }),
          supabase.from('reviews').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('follows').select('follower_id', { count: 'exact' }).eq('following_id', user.id),
          supabase.from('follows').select('following_id', { count: 'exact' }).eq('follower_id', user.id)
        ]);

        if (watchlistRes.data) {
          const movies = await Promise.all(
            watchlistRes.data.map(async (item) => getMovieDetailsAction(item.movie_id.toString()))
          );
          setWatchlist(movies.filter(Boolean));
        }

        if (favoritesRes.data) {
          const movies = await Promise.all(
            favoritesRes.data.map(async (item) => getMovieDetailsAction(item.movie_id.toString()))
          );
          setFavorites(movies.filter(Boolean));
        }
        
        if (watchedRes.data) {
          const movies = await Promise.all(
            watchedRes.data.map(async (item) => getMovieDetailsAction(item.movie_id.toString()))
          );
          setWatched(movies.filter(Boolean));
        }

        if (reviewsRes.data) {
          const enrichedReviews = await Promise.all(
            reviewsRes.data.map(async (review) => {
              const movie = await getMovieDetailsAction(review.movie_id.toString());
              return { ...review, movie };
            })
          );
          setReviews(enrichedReviews.filter(r => r.movie));
        }

        setFollowers(followersRes?.count || 0);
        setFollowing(followingRes?.count || 0);

      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleUserSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUser.trim()) {
      router.push(`/user/${searchUser.trim()}`);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <h1 className="text-2xl font-bold text-text-primary mb-4">You are not logged in</h1>
        <Link href="/login" className="px-6 py-3 bg-primary text-canvas font-semibold rounded-md hover:bg-primary/90 transition-colors">
          Log In to view profile
        </Link>
      </div>
    );
  }

  const displayedMovies = activeTab === 'watchlist' ? watchlist : activeTab === 'favorites' ? favorites : watched;

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-4rem)]">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-surface p-8 rounded-xl border border-border-subtle">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary border border-primary/30 shrink-0">
            <Film className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              {user.user_metadata?.username || user.email?.split('@')[0]}
            </h1>
            <p className="text-text-muted mt-1">{user.email}</p>
            <div className="flex gap-4 mt-3 text-sm text-text-primary">
              <button 
                onClick={() => { setModalType('followers'); setIsModalOpen(true); }}
                className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-primary" />
                <span className="font-semibold">{followers}</span> Followers
              </button>
              <button 
                onClick={() => { setModalType('following'); setIsModalOpen(true); }}
                className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors cursor-pointer"
              >
                <span className="font-semibold text-text-primary">{following}</span> Following
              </button>
            </div>
          </div>
        </div>
        
        {/* User Search */}
        <form onSubmit={handleUserSearch} className="flex w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Find friend by username..."
            className="bg-canvas border border-border-subtle rounded-l-md px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-primary flex-1"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <button type="submit" className="bg-primary text-canvas font-semibold px-4 py-2 text-sm rounded-r-md hover:bg-primary/90 transition-colors">
            Search
          </button>
        </form>
      </div>

      <UserListModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'followers' ? 'Followers' : 'Following'}
        type={modalType}
        userId={user.id}
      />

      {/* Tabs */}
      <div className="relative mb-8 group">
        {showLeftArrow && (
          <button 
            onClick={() => scrollTabs('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-1.5 bg-surface border border-border-subtle rounded-full text-text-primary hover:text-primary hover:border-primary transition-all shadow-md opacity-0 group-hover:opacity-100 hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        <div 
          ref={tabsRef}
          onScroll={checkArrows}
          className="flex gap-6 border-b border-border-subtle overflow-x-auto pb-1 hide-scrollbar"
        >
          <button 
            onClick={() => setActiveTab('watchlist')}
            className={`pb-4 text-lg font-semibold flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'watchlist' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-primary'
            } -mb-[1px]`}
          >
            <Bookmark className="w-5 h-5" /> Watchlist ({watchlist.length})
          </button>
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`pb-4 text-lg font-semibold flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'favorites' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-primary'
          } -mb-[1px]`}
        >
          <Heart className="w-5 h-5" /> Favorites ({favorites.length})
        </button>
        <button 
          onClick={() => setActiveTab('watched')}
          className={`pb-4 text-lg font-semibold flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'watched' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-primary'
          } -mb-[1px]`}
        >
          <Check className="w-5 h-5" /> Watched ({watched.length})
        </button>
        <button 
          onClick={() => setActiveTab('reviews')}
          className={`pb-4 text-lg font-semibold flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-primary'
          } -mb-[1px]`}
        >
          <MessageSquare className="w-5 h-5" /> Reviews ({reviews.length})
        </button>
        </div>
        
        {showRightArrow && (
          <button 
            onClick={() => scrollTabs('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-1.5 bg-surface border border-border-subtle rounded-full text-text-primary hover:text-primary hover:border-primary transition-all shadow-md opacity-0 group-hover:opacity-100 hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'reviews' ? (
        reviews.length > 0 ? (
          <div className="flex flex-col gap-6 max-w-4xl">
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-surface border border-border-subtle rounded-xl p-6 flex flex-col md:flex-row gap-6">
                <Link href={`/movie/${review.movie_id}`} className="shrink-0 w-24 md:w-32 aspect-[2/3] bg-canvas rounded-md overflow-hidden relative border border-border-subtle hover:border-primary transition-colors">
                  {review.movie.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w200${review.movie.poster_path}`} alt={review.movie.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">No Poster</div>
                  )}
                </Link>
                <div className="flex flex-col flex-1 gap-3">
                  <div>
                    <Link href={`/movie/${review.movie_id}`} className="text-xl font-bold text-text-primary hover:text-primary transition-colors">
                      {review.movie.title || review.movie.name}
                    </Link>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= review.rating ? "fill-primary text-primary" : "text-border-subtle"}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-text-muted">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {review.text && (
                    <p className="text-text-muted leading-relaxed whitespace-pre-wrap mt-2 bg-canvas/50 p-4 rounded-md border border-border-subtle/50">
                      {review.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center text-text-muted mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              No reviews yet
            </h2>
            <p className="text-text-muted max-w-md">
              You haven't written any reviews.
            </p>
          </div>
        )
      ) : (
        /* Movie Grid */
        displayedMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {displayedMovies.map((movie: any) => (
              <MovieCard 
                key={movie.id} 
                id={movie.id}
                title={movie.title || movie.name}
                posterPath={movie.poster_path}
                releaseYear={movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0]}
                rating={movie.vote_average}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center text-text-muted mb-4">
              {activeTab === 'watchlist' ? <Bookmark className="w-8 h-8" /> : activeTab === 'favorites' ? <Heart className="w-8 h-8" /> : <Check className="w-8 h-8" />}
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Your {activeTab} is empty
            </h2>
            <p className="text-text-muted max-w-md">
              Start exploring movies and add them to your {activeTab} to keep track of what you love.
            </p>
            <Link href="/trending" className="mt-6 px-6 py-2 bg-surface border border-border-subtle text-text-primary font-medium rounded-md hover:border-primary transition-colors">
              Discover Movies
            </Link>
          </div>
        )
      )}
    </div>
  );
}
