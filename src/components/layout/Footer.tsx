import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border-subtle bg-surface mt-12 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <h3 className="text-primary font-bold text-lg tracking-tight">Movie Universe</h3>
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
            <li><Link href="/login" className="text-text-muted hover:text-primary text-sm transition-colors">Log In</Link></li>
            <li><Link href="/register" className="text-text-muted hover:text-primary text-sm transition-colors">Create Account</Link></li>
            <li><Link href="/profile" className="text-text-muted hover:text-primary text-sm transition-colors">My Profile</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-text-primary mb-4">Legal</h4>
          <ul className="flex flex-col gap-2">
            <li><Link href="/contact" className="text-text-muted hover:text-primary text-sm transition-colors">Contact Us</Link></li>
            <li><Link href="/terms" className="text-text-muted hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="text-text-muted hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border-subtle/50 text-center">
        <p className="text-text-muted text-sm">
          &copy; {new Date().getFullYear()} Movie Universe. Built with Next.js and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
