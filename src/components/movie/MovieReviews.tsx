"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { Star, MessageSquare, Loader2, User } from "lucide-react";
import Link from "next/link";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  text: string;
  created_at: string;
  users: {
    username: string;
    avatar_url: string;
  };
}

export default function MovieReviews({ movieId }: { movieId: number }) {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users (
            username,
            avatar_url
          )
        `)
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data as any || []);
    } catch (err: any) {
      console.error("Error fetching reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setError("You must be logged in to review.");
    if (rating === 0) return setError("Please select a rating.");

    setSubmitting(true);
    setError(null);

    try {
      // Check if user already reviewed this movie
      const { data: existing } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', user.id)
        .eq('movie_id', movieId)
        .maybeSingle();

      let error;
      if (existing) {
        const { error: updateError } = await supabase
          .from('reviews')
          .update({
            rating,
            text: text.trim() || null
          })
          .eq('id', existing.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('reviews')
          .insert({
            user_id: user.id,
            movie_id: movieId,
            rating,
            text: text.trim() || null
          });
        error = insertError;
      }
        
      if (error) throw error;

      setText("");
      setRating(0);
      setHoverRating(0);
      fetchReviews();
    } catch (err: any) {
      console.error("Error submitting review", err);
      setError("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
        
      if (error) throw error;
      fetchReviews();
    } catch (err) {
      console.error("Error deleting review", err);
    }
  };

  return (
    <div className="mt-12 flex flex-col gap-8">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-semibold text-text-primary">Reviews & Ratings</h2>
      </div>

      {/* Review Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-surface border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="font-semibold text-text-primary">Write a Review</h3>
          
          {error && <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md">{error}</div>}
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted mr-2">Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star 
                  className={`w-6 h-6 ${
                    star <= (hoverRating || rating) 
                      ? "fill-primary text-primary" 
                      : "text-border-subtle"
                  }`} 
                />
              </button>
            ))}
            <span className="text-sm font-medium text-text-primary ml-2">
              {rating > 0 ? `${rating} / 5` : ""}
            </span>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What did you think of the movie? (Optional)"
            className="w-full bg-canvas border border-border-subtle rounded-md p-4 text-text-primary focus:outline-none focus:border-primary resize-none min-h-[100px]"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="bg-primary text-canvas font-semibold px-6 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Submitting..." : "Post Review"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-surface border border-border-subtle rounded-xl p-6 text-center">
          <p className="text-text-muted mb-4">Log in to rate and review this movie.</p>
          <Link href="/login" className="inline-block bg-primary text-canvas font-semibold px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Log In
          </Link>
        </div>
      )}

      {/* Reviews List */}
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-text-primary text-lg mb-2">
          Community Reviews ({reviews.length})
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-text-muted border border-border-subtle border-dashed rounded-xl bg-surface/50">
            No reviews yet. Be the first to review!
          </div>
        ) : (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-surface border border-border-subtle rounded-xl p-6 flex gap-4">
                {/* Avatar */}
                <Link href={`/user/${review.users?.username}`} className="shrink-0 w-12 h-12 bg-canvas rounded-full flex items-center justify-center border border-border-subtle overflow-hidden relative hover:border-primary transition-colors">
                  {review.users?.avatar_url ? (
                    <img src={review.users.avatar_url} alt={review.users.username} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-text-muted" />
                  )}
                </Link>
                
                {/* Content */}
                <div className="flex flex-col flex-1 gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/user/${review.users?.username}`} className="font-semibold text-text-primary hover:text-primary transition-colors">
                        {review.users?.username}
                      </Link>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= review.rating ? "fill-primary text-primary" : "text-border-subtle"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-text-muted">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                      {user && user.id === review.user_id && (
                        <button 
                          onClick={() => handleDelete(review.id)}
                          className="text-xs text-red-500 hover:text-red-400 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {review.text && (
                    <p className="text-text-muted mt-2 leading-relaxed whitespace-pre-wrap">
                      {review.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
