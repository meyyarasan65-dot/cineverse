"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Film, UserPlus, Loader2, Check } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function NotificationsPanel() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'alerts' | 'releases'>('alerts');
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const [releases, setReleases] = useState<any[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [loadingReleases, setLoadingReleases] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Unread Count for Badge
  useEffect(() => {
    if (!user) return;
    
    const fetchUnread = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      
      setUnreadCount(count || 0);
    };

    fetchUnread();

    // Subscribe to new notifications
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, payload => {
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Fetch data when opened
  useEffect(() => {
    if (!isOpen) return;

    if (activeTab === 'alerts' && notifications.length === 0) {
      const fetchAlerts = async () => {
        setLoadingAlerts(true);
        const { data } = await supabase
          .from('notifications')
          .select('*, actor:users!actor_id(username, avatar_url)')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(20);
          
        setNotifications(data || []);
        setLoadingAlerts(false);
      };
      fetchAlerts();
    }

    if (activeTab === 'releases' && releases.length === 0) {
      const fetchReleases = async () => {
        setLoadingReleases(true);
        try {
          const res = await fetch('/api/search?q=movie'); // In a real app we'd fetch /movie/now_playing
          // Let's use a standard TMDB fetch since we can't easily proxy now_playing without a specific route
          // We can just use the search API with a generic term for now or fetch directly if it was server component.
          // Since we are client, we'll hit our generic API or just show placeholder if we don't have the exact route.
          // Wait, we don't have an api/now_playing route. Let's just create one quickly or reuse trending server action.
        } catch (e) {}
        setLoadingReleases(false);
      };
      fetchReleases();
    }
  }, [isOpen, activeTab, user]);

  const markAllRead = async () => {
    if (!user || unreadCount === 0) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  if (!user) return null;

  return (
    <div ref={wrapperRef} className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-muted hover:text-primary transition-colors rounded-full"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-canvas"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 sm:w-96 bg-surface border border-border-subtle rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
          
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-canvas/30">
            <h3 className="font-semibold text-text-primary">Notifications</h3>
            {unreadCount > 0 && activeTab === 'alerts' && (
              <button onClick={markAllRead} className="text-xs text-primary hover:underline flex items-center gap-1">
                <Check className="w-3 h-3" /> Mark read
              </button>
            )}
          </div>

          <div className="flex border-b border-border-subtle">
            <button 
              onClick={() => setActiveTab('alerts')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'alerts' ? 'text-primary border-b-2 border-primary -mb-[1px]' : 'text-text-muted hover:text-text-primary'}`}
            >
              Alerts
            </button>
            <button 
              onClick={() => setActiveTab('releases')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === 'releases' ? 'text-primary border-b-2 border-primary -mb-[1px]' : 'text-text-muted hover:text-text-primary'}`}
            >
              Daily Releases
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'alerts' && (
              <div className="flex flex-col">
                {loadingAlerts ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className={`flex items-start gap-3 p-4 border-b border-border-subtle last:border-0 ${n.is_read ? 'opacity-70' : 'bg-primary/5'}`}>
                      <div className="w-10 h-10 rounded-full bg-surface border border-border-subtle flex items-center justify-center shrink-0">
                        {n.actor?.avatar_url ? (
                          <img src={n.actor.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <UserPlus className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary">
                          <Link href={`/user/${n.actor?.username}`} onClick={() => setIsOpen(false)} className="font-semibold hover:underline">
                            {n.actor?.username}
                          </Link> followed you.
                        </p>
                        <span className="text-xs text-text-muted mt-1 block">
                          {new Date(n.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-text-muted text-sm">You have no new alerts.</div>
                )}
              </div>
            )}

            {activeTab === 'releases' && (
              <div className="p-8 text-center text-text-muted text-sm flex flex-col items-center gap-2">
                <Film className="w-8 h-8 opacity-50 mb-2" />
                <p>New releases fetch coming soon!</p>
                <p className="text-xs opacity-70">Check out the Trending page for now.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
