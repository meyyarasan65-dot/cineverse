"use client";

import { useState } from "react";
import Link from "next/link";
import { Film, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Assuming you have an update-password page to handle the redirect
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface p-8 rounded-xl border border-border-subtle shadow-2xl">
        <div className="text-center">
          <Film className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold text-text-primary">Reset Password</h2>
          <p className="mt-2 text-sm text-text-muted">
            Enter your email and we'll send you a link to get back into your account.
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
            <p className="font-semibold text-lg">Check your inbox</p>
            <p>We've sent a password reset link to <strong>{email}</strong>.</p>
            <Link href="/login" className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 transition-colors">
              Return to Login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-text-muted" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-border-subtle rounded-md bg-canvas text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-canvas bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
              >
                {loading ? "Sending link..." : "Send Reset Link"}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <Link href="/login" className="text-sm font-medium text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
