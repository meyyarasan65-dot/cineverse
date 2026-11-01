"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, User, LogOut, Home, Search, Flame } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import SearchBar from "@/components/layout/SearchBar";
import NotificationsPanel from "@/components/layout/NotificationsPanel";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const displayName = user?.user_metadata?.username || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Profile';

  const navLinks = [
    { label: "Trending", href: "/trending" },
    { label: "Genres", href: "/genres" },
    { label: "Coming Soon", href: "/coming-soon" },
  ];

  return (
    <>
      {/* =========================================================================
          1. DESKTOP 3D FLOATING NAVIGATION BAR (Visible on md and up)
      ========================================================================== */}
      <header className="hidden md:block sticky top-2 sm:top-3.5 z-50 w-full px-4 sm:px-6 pointer-events-none transition-all duration-300">
        <nav className="pointer-events-auto max-w-7xl mx-auto h-[68px] px-6 flex items-center justify-between rounded-[26px] bg-surface/85 backdrop-blur-2xl border-t border-l border-r border-white/25 dark:border-white/15 border-b-2 border-black/35 dark:border-black/50 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.5),0_6px_16px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.35)] relative">
          
          {/* Specular 3D Rim Highlight Lines */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-black/40 to-transparent pointer-events-none rounded-full" />

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 hover:opacity-90 transition-all group shrink-0">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Frame Diary Logo" 
                className="w-12 h-12 object-contain [clip-path:circle(48%_at_50%_50%)] drop-shadow-[0_2px_8px_rgba(0,224,84,0.35)] transition-transform group-hover:scale-105" 
              />
            </div>
            <span className="font-extrabold text-2xl tracking-tight leading-none flex items-center -translate-y-[2px]">
              <span className="text-text-primary drop-shadow-sm">FRAME</span>
              <span className="text-[#02d450] drop-shadow-[0_0_12px_rgba(2,212,80,0.4)]">DIARY</span>
            </span>
          </Link>

          {/* Desktop 3D Navigation Links */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-canvas/40 border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                    isActive
                      ? "text-primary bg-primary/15 border border-primary/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_10px_rgba(0,224,84,0.3)]"
                      : "text-text-muted hover:text-text-primary hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Section: Search & Auth/Profile */}
          <div className="flex items-center gap-3">
            <SearchBar />
            
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-canvas/30 border border-white/5 shadow-inner">
              <ThemeToggle />
              <NotificationsPanel />
            </div>
            
            {!loading && (
              user ? (
                <div className="flex items-center gap-2">
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-canvas/50 border border-border-subtle/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_2px_6px_rgba(0,0,0,0.2)] hover:border-primary/40 transition-all text-sm font-medium text-text-muted hover:text-primary group"
                  >
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt={displayName} 
                        className="w-6 h-6 rounded-full object-cover border border-primary/50 shrink-0 group-hover:scale-105 transition-transform" 
                      />
                    ) : (
                      <User className="w-4 h-4 text-primary" />
                    )}
                    <span className="hidden lg:inline max-w-[120px] truncate text-text-primary font-semibold">
                      {displayName}
                    </span>
                  </Link>

                  <button 
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer" 
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link 
                    href="/login" 
                    className="px-3.5 py-1.5 text-sm font-semibold text-text-primary hover:text-primary transition-colors rounded-xl hover:bg-white/5"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-4 py-2 bg-gradient-to-b from-[#00f75e] to-[#00b843] text-canvas text-sm font-bold rounded-xl shadow-[0_4px_14px_rgba(0,224,84,0.35),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-2px_2px_rgba(0,0,0,0.3)] hover:brightness-110 active:scale-[0.98] transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>
        </nav>
      </header>

      {/* =========================================================================
          2. MOBILE CLEAN PILL-STYLED TOP HEADER (Visible on < md)
      ========================================================================== */}
      <header className="md:hidden sticky top-2 z-40 w-full px-3 pointer-events-none transition-all duration-300">
        <nav className="pointer-events-auto mx-auto max-w-md h-13 px-3.5 flex items-center justify-between rounded-full bg-surface/90 dark:bg-[#121815]/90 backdrop-blur-2xl border-t border-l border-r border-white/25 dark:border-white/15 border-b-2 border-black/35 dark:border-black/50 shadow-[0_10px_28px_-4px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] relative">
          
          {/* Subtle Top Specular Rim */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none rounded-full" />

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1.5 hover:opacity-90 transition-opacity">
            <img 
              src="/logo.png" 
              alt="Frame Diary Logo" 
              className="w-8 h-8 object-contain [clip-path:circle(48%_at_50%_50%)] drop-shadow-[0_2px_6px_rgba(0,224,84,0.35)]" 
            />
            <span className="font-extrabold text-base tracking-tight leading-none flex items-center -translate-y-[1px]">
              <span className="text-text-primary">FRAME</span>
              <span className="text-[#02d450] drop-shadow-[0_0_8px_rgba(2,212,80,0.4)]">DIARY</span>
            </span>
          </Link>

          {/* Quick Header Controls (Theme, Notifications, Profile / Login) */}
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <NotificationsPanel />

            {!loading && (
              user ? (
                <Link
                  href="/profile"
                  className="p-0.5 rounded-full hover:ring-2 hover:ring-primary/40 transition-all ml-0.5"
                  aria-label="Profile"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-7 h-7 rounded-full object-cover border border-primary/50"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-1 rounded-full text-xs font-bold text-text-primary bg-canvas/60 border border-white/10 hover:border-primary/40 transition-all ml-0.5"
                >
                  Log In
                </Link>
              )
            )}
          </div>
        </nav>
      </header>

      {/* =========================================================================
          3. MOBILE FIXED APP-STYLE BOTTOM TAB BAR (Visible on < md)
      ========================================================================== */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-3 inset-x-3 max-w-md mx-auto z-50 pointer-events-auto"
      >
        <div className="h-16 px-1.5 rounded-2xl sm:rounded-3xl bg-surface/92 dark:bg-[#101713]/94 backdrop-blur-2xl border-t border-l border-r border-white/20 dark:border-white/10 border-b-2 border-black/50 shadow-[0_16px_36px_rgba(0,0,0,0.65),0_2px_8px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-center justify-around relative">
          
          {/* Micro Top Specular Highlight */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none rounded-full" />

          {/* Tab 1: Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 relative ${
              pathname === "/"
                ? "text-primary font-bold bg-primary/15 border border-primary/25 shadow-[0_2px_8px_rgba(0,224,84,0.2)]"
                : "text-text-muted hover:text-text-primary border border-transparent"
            }`}
          >
            {pathname === "/" && (
              <span className="absolute top-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_#02d450]" />
            )}
            <Home className="w-5 h-5" />
            <span className="text-[10px] sm:text-[11px] leading-tight mt-0.5">Home</span>
          </Link>

          {/* Tab 2: Search (Opens /search with trending movies or search results) */}
          <Link
            href="/search"
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 relative ${
              pathname.startsWith("/search")
                ? "text-primary font-bold bg-primary/15 border border-primary/25 shadow-[0_2px_8px_rgba(0,224,84,0.2)]"
                : "text-text-muted hover:text-text-primary border border-transparent"
            }`}
          >
            {pathname.startsWith("/search") && (
              <span className="absolute top-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_#02d450]" />
            )}
            <Search className="w-5 h-5" />
            <span className="text-[10px] sm:text-[11px] leading-tight mt-0.5">Search</span>
          </Link>

          {/* Tab 3: Trending */}
          <Link
            href="/trending"
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 relative ${
              pathname.startsWith("/trending")
                ? "text-primary font-bold bg-primary/15 border border-primary/25 shadow-[0_2px_8px_rgba(0,224,84,0.2)]"
                : "text-text-muted hover:text-text-primary border border-transparent"
            }`}
          >
            {pathname.startsWith("/trending") && (
              <span className="absolute top-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_#02d450]" />
            )}
            <Flame className="w-5 h-5" />
            <span className="text-[10px] sm:text-[11px] leading-tight mt-0.5">Trending</span>
          </Link>

          {/* Tab 4: Genres */}
          <Link
            href="/genres"
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 relative ${
              pathname.startsWith("/genres")
                ? "text-primary font-bold bg-primary/15 border border-primary/25 shadow-[0_2px_8px_rgba(0,224,84,0.2)]"
                : "text-text-muted hover:text-text-primary border border-transparent"
            }`}
          >
            {pathname.startsWith("/genres") && (
              <span className="absolute top-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_#02d450]" />
            )}
            <Film className="w-5 h-5" />
            <span className="text-[10px] sm:text-[11px] leading-tight mt-0.5">Genres</span>
          </Link>

          {/* Tab 5: Profile / Login */}
          <Link
            href={user ? "/profile" : "/login"}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 relative ${
              pathname.startsWith("/profile") || pathname.startsWith("/login") || pathname.startsWith("/register")
                ? "text-primary font-bold bg-primary/15 border border-primary/25 shadow-[0_2px_8px_rgba(0,224,84,0.2)]"
                : "text-text-muted hover:text-text-primary border border-transparent"
            }`}
          >
            {(pathname.startsWith("/profile") || pathname.startsWith("/login") || pathname.startsWith("/register")) && (
              <span className="absolute top-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_#02d450]" />
            )}
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-5 h-5 rounded-full object-cover border border-primary/50"
              />
            ) : (
              <User className="w-5 h-5" />
            )}
            <span className="text-[10px] sm:text-[11px] leading-tight mt-0.5 truncate max-w-[54px]">
              {user ? "Profile" : "Log In"}
            </span>
          </Link>

        </div>
      </nav>

      {/* =========================================================================
          4. LOGOUT CONFIRMATION MODAL
      ========================================================================== */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-surface border-t border-l border-r border-white/20 border-b-2 border-black/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-text-primary">Confirm Logout</h3>
            <p className="text-text-muted text-sm leading-relaxed">Are you sure you want to log out of your account?</p>
            <div className="flex justify-end gap-3 mt-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm font-semibold text-text-primary bg-canvas/60 border border-border-subtle rounded-xl hover:bg-canvas transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setShowLogoutModal(false);
                  await signOut();
                }}
                className="px-4 py-2 text-sm font-semibold text-canvas bg-red-500 rounded-xl hover:bg-red-600 shadow-[0_4px_12px_rgba(239,68,68,0.35)] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
