"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Film, Lock, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the user arrived here via a password reset link
    // Supabase will automatically handle the #access_token fragment and log them in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If they don't have a session, they shouldn't be here (or token expired)
        setError("Your password reset link is invalid or has expired. Please request a new one.");
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      setSuccess(true);
      
      // Redirect to profile or home after a short delay
      setTimeout(() => {
        router.push('/profile');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface p-8 rounded-xl border border-border-subtle shadow-2xl">
        <div className="text-center">
          <Film className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold text-text-primary">Update Password</h2>
          <p className="mt-2 text-sm text-text-muted">
            Enter your new secure password below.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-md text-center">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-6 rounded-md text-center flex flex-col items-center gap-3">
            <CheckCircle2 className="w-10 h-10" />
            <p className="font-semibold text-lg">Password Updated!</p>
            <p>Your password has been changed successfully.</p>
            <p className="text-sm opacity-70">Redirecting to your profile...</p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="sr-only">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-text-muted" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="block w-full pl-10 pr-3 py-3 border border-border-subtle rounded-md bg-canvas text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                    placeholder="New Password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !password || error.includes("invalid")}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-canvas bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
