"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { syncUserProfile } from "@/lib/auth-sync";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      // 1. Check if error was passed in URL query (e.g. user cancelled Google OAuth)
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error || errorDescription) {
        setErrorMessage(errorDescription || error || "Authentication failed. Please try again.");
        return;
      }

      // 2. Check if a code parameter is present (PKCE OAuth flow)
      const code = searchParams.get("code");

      try {
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error("Exchange code error:", exchangeError);
            throw exchangeError;
          }
          if (data.session?.user) {
            setUser(data.session.user);
            await syncUserProfile(data.session.user);
            router.replace("/");
            return;
          }
        }

        // 3. Fallback: check active session if code wasn't present or already exchanged
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          setUser(session.user);
          await syncUserProfile(session.user);
          router.replace("/");
        } else {
          // If no session found after a moment, check again or redirect to login
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (currentSession?.user) {
              setUser(currentSession.user);
              await syncUserProfile(currentSession.user);
              subscription.unsubscribe();
              router.replace("/");
            }
          });

          // Timeout fallback in case no auth state arrives
          setTimeout(() => {
            subscription.unsubscribe();
            router.replace("/");
          }, 3000);
        }
      } catch (err: any) {
        console.error("OAuth callback error:", err);
        setErrorMessage(err.message || "An unexpected error occurred during sign-in.");
      }
    };

    handleAuth();
  }, [router, searchParams, setUser]);

  if (errorMessage) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md bg-surface border border-border-subtle rounded-xl p-8 shadow-xl text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-text-primary mb-2">Authentication Failed</h1>
          <p className="text-sm text-text-muted mb-6">{errorMessage}</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-canvas rounded-md font-semibold hover:bg-primary/90 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <div className="w-full max-w-md bg-surface border border-border-subtle rounded-xl p-8 shadow-xl text-center flex flex-col items-center">
        <img
          src="/logo.png"
          alt="Frame Diary Logo"
          className="w-14 h-14 object-contain [clip-path:circle(48%_at_50%_50%)] mb-6 animate-pulse"
        />
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold text-text-primary">Completing Sign-In</h2>
        <p className="text-sm text-text-muted mt-2">
          Please wait while we verify your Google credentials...
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
