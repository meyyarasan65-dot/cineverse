"use client";

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Film } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    // Supabase auth
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <div className="w-full max-w-md bg-surface border border-border-subtle rounded-xl p-8 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Frame Diary Logo" className="w-14 h-14 object-contain [clip-path:circle(48%_at_50%_50%)] mb-4" />
          <h1 className="text-2xl font-bold text-text-primary">Join Frame Diary</h1>
          <p className="text-text-muted text-sm mt-2">Start your cinema journey today</p>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center text-2xl font-bold">✓</div>
            <h2 className="text-xl font-semibold text-text-primary">Check your email!</h2>
            <p className="text-text-muted text-sm">We've sent a confirmation link to {email}.</p>
            <Link href="/login" className="mt-4 text-primary hover:underline font-medium">
              Return to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-primary" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                required
                className="bg-canvas border border-border-subtle rounded-md px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="cinephile99"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-primary" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                className="bg-canvas border border-border-subtle rounded-md px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-primary" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                className="bg-canvas border border-border-subtle rounded-md px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-primary text-canvas font-semibold py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex justify-center items-center h-12"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        )}

        {!success && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-border-subtle"></div>
              <span className="px-3 text-text-muted text-sm">or continue with</span>
              <div className="flex-grow border-t border-border-subtle"></div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
                className="w-full flex items-center justify-center gap-2 bg-surface border border-border-subtle hover:bg-surface/80 text-text-primary py-3 rounded-md transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-text-muted">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Log in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
