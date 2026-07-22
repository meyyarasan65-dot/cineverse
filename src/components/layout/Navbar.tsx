"use client";

import Link from "next/link";
import { Film, User, LogOut, Menu } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import SearchBar from "@/components/layout/SearchBar";
import NotificationsPanel from "@/components/layout/NotificationsPanel";

export default function Navbar() {
  const { user, loading, signOut } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-subtle bg-canvas/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Film className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl tracking-tight text-text-primary">Movie<span className="text-primary">Universe</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/trending" className="text-sm font-medium text-text-muted hover:text-primary transition-colors">Trending</Link>
          <Link href="/genres" className="text-sm font-medium text-text-muted hover:text-primary transition-colors">Genres</Link>
          <Link href="/coming-soon" className="text-sm font-medium text-text-muted hover:text-primary transition-colors">Coming Soon</Link>
        </div>

        {/* Right Section: Search & Auth/Profile */}
        <div className="flex items-center gap-4">
          <SearchBar />
          <NotificationsPanel />
          
          {!loading && (
            user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors">
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline">{user.user_metadata?.username || 'Profile'}</span>
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="p-2 text-text-muted hover:text-red-500 transition-colors" 
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-text-primary hover:text-primary transition-colors">
                  Log In
                </Link>
                <Link href="/register" className="px-4 py-2 bg-primary text-canvas text-sm font-semibold rounded-md hover:opacity-90 transition-opacity">
                  Sign Up
                </Link>
              </div>
            )
          )}

          {/* Mobile Menu Button */}
          <button aria-label="Menu" className="md:hidden p-2 text-text-muted hover:text-primary transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>

      </div>
    </nav>
  );
}
