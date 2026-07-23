"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';
import { getMovieDetailsAction } from '@/app/actions';
import MovieCard from '@/components/movie/MovieCard';
import UserListModal from '@/components/profile/UserListModal';
import { Film, Heart, Bookmark, Check, Loader2, Users, UserPlus, UserMinus, MessageSquare, Star } from 'lucide-react';
import Link from 'next/link';

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { user: currentUser } = useAuthStore();
  const [targetUser, setTargetUser] = useState<any>(null);
  
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [watched, setWatched] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>('followers');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'watchlist' | 'favorites' | 'watched' | 'reviews'>('watchlist');

  useEffect(() => {
    const fetchPublicProfile = async () => {
      setLoading(true);
      try {
        const resolvedParams = await params;
        const decodedUsername = decodeURIComponent(resolvedParams.username);

        // 1. Fetch Target User
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, username')
          .eq('username', decodedUsername)
          .maybeSingle();

        if (userError || !userData) {
          setError("User not found");
          setLoading(false);
          return;
        }

        setTargetUser(userData);

        // 2. Fetch Lists and Social Stats
        const [watchlistRes, favoritesRes, watchedRes, reviewsRes, followersRes, followingRes, isFollowingRes] = await Promise.all([
          supabase.from('watchlist').select('movie_id').eq('user_id', userData.id).order('added_at', { ascending: false }),
          supabase.from('favorites').select('movie_id').eq('user_id', userData.id).order('added_at', { ascending: false }),
          supabase.from('recently_watched').select('movie_id').eq('user_id', userData.id).order('watched_at', { ascending: false }),
          supabase.from('reviews').select('*').eq('user_id', userData.id).order('created_at', { ascending: false }),
          supabase.from('follows').select('follower_id', { count: 'exact' }).eq('following_id', userData.id),
          supabase.from('follows').select('following_id', { count: 'exact' }).eq('follower_id', userData.id),
          currentUser ? supabase.from('follows').select('follower_id').eq('follower_id', currentUser.id).eq('following_id', userData.id).maybeSingle() : Promise.resolve({ data: null })
        ]);

        if (watchlistRes.data) {
          const movies = await Promise.all(watchlistRes.data.map((item) => getMovieDetailsAction(item.movie_id.toString())));
          setWatchlist(movies.filter(Boolean));
        }

        if (favoritesRes.data) {
          const movies = await Promise.all(favoritesRes.data.map((item) => getMovieDetailsAction(item.movie_id.toString())));
          setFavorites(movies.filter(Boolean));
        }
        
        if (watchedRes.data) {
          const movies = await Promise.all(watchedRes.data.map((item) => getMovieDetailsAction(item.movie_id.toString())));
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

        setFollowers(followersRes.count || 0);
        setFollowing(followingRes.count || 0);
        setIsFollowing(!!isFollowingRes.data);

      } catch (err) {
        console.error("Error fetching public profile", err);
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [params, currentUser]);

  const toggleFollow = async () => {
    if (!currentUser) return alert("Please log in to follow users");
    if (!targetUser) return;

    setIsFollowing(!isFollowing); // Optimistic UI
    setFollowers(prev => isFollowing ? prev - 1 : prev + 1);

    if (!isFollowing) {
      await supabase.from('follows').insert({ follower_id: currentUser.id, following_id: targetUser.id });
    } else {
      await supabase.from('follows').delete().eq('follower_id', currentUser.id).eq('following_id', targetUser.id);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !targetUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <h1 className="text-2xl font-bold text-text-primary mb-2">User Not Found</h1>
        <p className="text-text-muted mb-6">The user you are looking for doesn't exist.</p>
        <Link href="/" className="px-6 py-3 bg-surface border border-border-subtle text-text-primary font-semibold rounded-md hover:border-primary transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  const displayedMovies = activeTab === 'watchlist' ? watchlist : activeTab === 'favorites' ? favorites : watched;
  const isSelf = currentUser?.id === targetUser.id;

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-4rem)]">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-surface p-8 rounded-xl border border-border-subtle">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 shrink-0">
            <Users className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">{targetUser.username}</h1>
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
        
        {/* Actions */}
        {!isSelf && (
          <button 
            onClick={toggleFollow}
            className={`px-6 py-3 font-semibold rounded-md transition-colors flex items-center gap-2 ${
              isFollowing 
                ? 'bg-surface border border-border-subtle text-text-primary hover:bg-surface/80 hover:text-red-400 hover:border-red-500/50' 
                : 'bg-primary text-canvas hover:bg-primary/90'
            }`}
          >
            {isFollowing ? (
              <>
                <UserMinus className="w-5 h-5" /> Unfollow
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" /> Follow
              </>
            )}
          </button>
        )}
      </div>

      <UserListModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'followers' ? 'Followers' : 'Following'}
        type={modalType}
        userId={targetUser.id}
      />

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border-subtle mb-8 overflow-x-auto pb-1">
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
              {targetUser.username} hasn't written any reviews yet.
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
              No movies in {activeTab}
            </h2>
            <p className="text-text-muted max-w-md">
              {targetUser.username} hasn't added any movies to their {activeTab} yet.
            </p>
          </div>
        )
      )}
    </div>
  );
}
