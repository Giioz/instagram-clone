'use client';

import { X, Search } from 'lucide-react';
import { useState } from 'react';

interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  isFollowing?: boolean;
}

interface FollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: 'followers' | 'following' | 'remove';
  users: User[];
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
  loading?: boolean;
}

export default function FollowModal({
   isOpen,
   onClose,
   title,
   users,
   onFollow,
   onUnfollow,
   loading = false
}: FollowModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredUsers = users.filter(user =>
     user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center pb-[10%]  z-50">
      <div className="bg-[rgb(33,35,40)] text-[rgb(245,245,245)] rounded-[24px] w-[560px] h-[400px] max-h-[699px] flex flex-col shadow-xl overflow-x-auto overflow-y-auto" style={{ fontSize: '14px', lineHeight: '18px' }}>
        <div className="flex items-center justify-center relative p-4  border-b- border-[2b3036]">
          <h2 className="text-[16px] font-semibold capitalize">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4"
          >
            <X size={28} />
          </button>
        </div>
        <div className="p-3 border-t border-gray-700">
        <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[528px] h-[32px] pl-9 pr-3 bg-[#363636] text-white placeholder-gray-400 rounded-[10px] outline-none text-[14px]"
            />
        </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="py-8 text-center text-gray-400">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              {searchQuery ? 'No users found' : `No ${title} yet`}
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-[#2c2c2e] transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-[44px] h-[44px] rounded-full bg-gray-500 flex items-center justify-center text-sm font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>

                  <div className="leading-tight">
                    <div className="text-[14px] font-semibold">
                      {user.username}
                    </div>
                    <div className="text-[14px] text-[#959DA7]">
                      {user.name}
                    </div>
                  </div>
                </div>
                {user.isFollowing !== undefined && (
                  <button
                    onClick={() => {
                      if (user.isFollowing && onUnfollow) {
                        onUnfollow(user.id);
                      } else if (!user.isFollowing && onFollow) {
                        onFollow(user.id);
                      }
                    }}
                    className="flex items-center justify-center h-8 px-4 text-sm font-bold rounded-lg bg-[#25292E] text-white hover:bg-[#25292E]"
                  >
                    {title === 'followers' ? 'remove' : title}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}