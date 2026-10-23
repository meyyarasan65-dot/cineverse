"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, User, LogOut, Menu, X, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import SearchBar from "@/components/layout/SearchBar";
import NotificationsPanel from "@/components/layout/NotificationsPanel";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      {/* Floating 3D Navigation Bar Outer Wrapper */}
      <header className="sticky top-2 sm:top-3.5 z-50 w-full px-3 sm:px-6 pointer-events-none transition-all duration-300">
        
        {/* Curved 3D Capsule */}
        <nav className="pointer-events-auto max-w-7xl mx-auto h-16 sm:h-[68px] px-3.5 sm:px-6 flex items-center justify-between rounded-2xl md:rounded-[26px] bg-surface/85 backdrop-blur-2xl border-t border-l border-r border-white/25 dark:border-white/15 border-b-2 border-black/35 dark:border-black/50 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.5),0_6px_16px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.35)] relative">
          
          {/* Specular 3D Rim Highlight Lines */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-black/40 to-transparent pointer-events-none rounded-full" />

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 hover:opacity-90 transition-all group shrink-0">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Frame Diary Logo" 
                className="w-11 h-11 sm:w-13 sm:h-13 object-contain [clip-path:circle(48%_at_50%_50%)] drop-shadow-[0_2px_8px_rgba(0,224,84,0.35)] transition-transform group-hover:scale-105" 
              />
            </div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight leading-none flex items-center -translate-y-[2px]">
              <span className="text-text-primary drop-shadow-sm">FRAME</span>
              <span className="text-[#02d450] drop-shadow-[0_0_12px_rgba(2,212,80,0.4)]">DIARY</span>
            </span>
          </Link>

          {/* Desktop 3D Navigation Links */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-canvas/40 border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]">
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
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <SearchBar />
            </div>
            
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-canvas/30 border border-white/5 shadow-inner">
              <ThemeToggle />
              <NotificationsPanel />
            </div>
            
            {!loading && (
              user ? (
                <div className="hidden md:flex items-center gap-2">
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
                    className="p-2 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors" 
                    aria-label="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
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

            {/* Mobile Menu Button */}
            <button 
              aria-label="Menu" 
              className="md:hidden p-2 rounded-xl bg-canvas/40 border border-white/10 text-text-muted hover:text-primary hover:border-primary/30 transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Dropdown - 3D Curved Panel */}
        {isMobileMenuOpen && (
          <div className="pointer-events-auto max-w-7xl mx-auto mt-2.5 rounded-2xl bg-surface/95 backdrop-blur-2xl border-t border-l border-r border-white/20 border-b-2 border-black/40 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="sm:hidden w-full">
              <SearchBar />
            </div>

            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "text-primary bg-primary/15 border border-primary/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                        : "text-text-primary hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            
            <div className="border-t border-white/10 my-1"></div>
            
            {!loading && (
              user ? (
                <div className="flex flex-col gap-2">
                  <Link 
                    href="/profile" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-canvas/50 border border-border-subtle text-sm font-semibold text-text-primary hover:text-primary transition-colors"
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className="w-7 h-7 rounded-full object-cover border border-primary/40 shrink-0" />
                    ) : (
                      <User className="w-5 h-5 text-primary" />
                    )}
                    <span className="truncate">{displayName}</span>
                  </Link>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors text-left" 
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link 
                    href="/login" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-text-primary bg-canvas/60 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/register" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-canvas bg-gradient-to-b from-[#00f75e] to-[#00b843] shadow-[0_4px_14px_rgba(0,224,84,0.35)] hover:brightness-110 transition-all"
                  >
                    Create Account
                  </Link>
                </div>
              )
            )}
          </div>
        )}
      </header>
      
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-surface border-t border-l border-r border-white/20 border-b-2 border-black/40 rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-text-primary">Confirm Logout</h3>
            <p className="text-text-muted text-sm leading-relaxed">Are you sure you want to log out of your account?</p>
            <div className="flex justify-end gap-3 mt-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm font-semibold text-text-primary bg-canvas/60 border border-border-subtle rounded-xl hover:bg-canvas transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  setShowLogoutModal(false);
                  await signOut();
                }}
                className="px-4 py-2 text-sm font-semibold text-canvas bg-red-500 rounded-xl hover:bg-red-600 shadow-[0_4px_12px_rgba(239,68,68,0.35)] transition-colors flex items-center gap-2"
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
