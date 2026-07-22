"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'followers' | 'following';
  userId: string;
}

export default function UserListModal({ isOpen, onClose, title, type, userId }: UserListModalProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        if (type === 'followers') {
          const { data, error } = await supabase
            .from('follows')
            .select('users!follower_id(id, username, avatar_url)')
            .eq('following_id', userId);
            
          if (!error && data) setUsers(data.map(d => d.users));
        } else {
          const { data, error } = await supabase
            .from('follows')
            .select('users!following_id(id, username, avatar_url)')
            .eq('follower_id', userId);
            
          if (!error && data) setUsers(data.map(d => d.users));
        }
      } catch (err) {
        console.error("Error fetching users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen, userId, type]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border-subtle rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary transition-colors rounded-full hover:bg-canvas">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : users.length > 0 ? (
            <div className="flex flex-col gap-2">
              {users.map((u: any) => (
                <Link 
                  href={`/user/${u.username}`} 
                  key={u.id}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-canvas transition-colors border border-transparent hover:border-border-subtle"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary shrink-0">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt={u.username} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <Users className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-text-primary block">{u.username}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-text-muted">
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
