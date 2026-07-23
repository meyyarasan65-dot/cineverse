"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const { user, signOut } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  const handleAuthClick = (e: React.MouseEvent) => {
    if (user) {
      e.preventDefault();
      setShowLogoutModal(true);
    }
  };

  return (
    <>
    <footer className="w-full border-t border-border-subtle bg-surface mt-12 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[#02d450] font-bold text-xl tracking-tight"><span className="text-white drop-shadow-md">FRAME</span>DIARY</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Discover. Watch. Review. Your personal Letterboxd-style movie discovery platform.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold text-text-primary mb-4">Discover</h4>
          <ul className="flex flex-col gap-2">
            <li><Link href="/trending" className="text-text-muted hover:text-primary text-sm transition-colors">Trending Movies</Link></li>
            <li><Link href="/genres" className="text-text-muted hover:text-primary text-sm transition-colors">Browse Genres</Link></li>
            <li><Link href="/coming-soon" className="text-text-muted hover:text-primary text-sm transition-colors">Coming Soon</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-4">Account</h4>
          <ul className="flex flex-col gap-2">
            <li><Link href="/login" onClick={handleAuthClick} className="text-text-muted hover:text-primary text-sm transition-colors">Log In</Link></li>
            <li><Link href="/register" onClick={handleAuthClick} className="text-text-muted hover:text-primary text-sm transition-colors">Create Account</Link></li>
            <li><Link href="/profile" className="text-text-muted hover:text-primary text-sm transition-colors">My Profile</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-4">Legal</h4>
          <ul className="flex flex-col gap-2">
            <li><a href="https://meyyarasan65-dot.github.io/portfolio/" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary text-sm transition-colors">Contact Us</a></li>
            <li><Link href="/terms" className="text-text-muted hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="text-text-muted hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border-subtle/50 text-center">
        <p className="text-text-muted text-sm">
          &copy; {new Date().getFullYear()} Frame Diary. Built with Next.js and Tailwind CSS.
        </p>
      </div>
    </footer>

    {/* Logout Confirmation Modal for Footer Links */}
    {showLogoutModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-surface border border-border-subtle rounded-xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
          <h3 className="text-xl font-bold text-text-primary">Confirm Logout</h3>
          <p className="text-text-muted">You must log out of your current account before logging into another one. Would you like to log out now?</p>
          <div className="flex justify-end gap-3 mt-4">
            <button 
              onClick={() => setShowLogoutModal(false)}
              className="px-4 py-2 text-sm font-medium text-text-primary bg-canvas border border-border-subtle rounded-md hover:bg-canvas/80 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={async () => {
                setShowLogoutModal(false);
                await signOut();
                router.push('/login');
              }}
              className="px-4 py-2 text-sm font-medium text-canvas bg-red-500 rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
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
