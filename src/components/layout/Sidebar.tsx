"use client";

import {
  Home,
  PlaySquare,
  Send,
  Search,
  Compass,
  Heart,
  PlusSquare,
  User,
  Menu,
  Grid3x3,
  Image,
  Video
} from 'lucide-react';
import { useState } from 'react';
import { CreatePostModal } from '../../modules/posts/components/CreatePostModal';

const mainItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: PlaySquare, label: 'Reels' },
  { icon: Send, label: 'Messages' },
  { icon: Search, label: 'Search' },
  { icon: Compass, label: 'Explore' },
  { icon: Heart, label: 'Notifications' },
  { icon: PlusSquare, label: 'Create' },
  { icon: User, label: 'Profile' },
];

const createOptions = [
  { icon: Image, label: 'Post' },
  { icon: Video, label: 'Reel' },
];

export default function Sidebar() {
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  return (
    <div className="w-20 hover:w-64 h-screen bg-[#0B1014] fixed left-0 top-0 flex flex-col py-6 px-3 group transition-all duration-200 z-50">
      <div className="flex items-center gap-3 mb-20 px-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white"
        >
          <path d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.043-.379 3.408 3.408 0 0 1-1.264-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066a8.074 8.074 0 0 0-2.67.511 5.392 5.392 0 0 0-1.949 1.27 5.392 5.392 0 0 0-1.269 1.948 8.074 8.074 0 0 0-.51 2.67C1.012 8.638 1 9.013 1 12s.013 3.362.066 4.535a8.074 8.074 0 0 0 .511 2.67 5.392 5.392 0 0 0 1.27 1.949 5.392 5.392 0 0 0 1.948 1.269 8.074 8.074 0 0 0 2.67.51C8.638 22.988 9.013 23 12 23s3.362-.013 4.535-.066a8.074 8.074 0 0 0 2.67-.511 5.625 5.625 0 0 0 3.218-3.218 8.074 8.074 0 0 0 .51-2.67C22.988 15.362 23 14.987 23 12s-.013-3.362-.066-4.535a8.074 8.074 0 0 0-.511-2.67 5.392 5.392 0 0 0-1.27-1.949 5.392 5.392 0 0 0-1.948-1.269 8.074 8.074 0 0 0-2.67-.51C15.362 1.012 14.987 1 12 1Zm0 5.351A5.649 5.649 0 1 0 17.649 12 5.649 5.649 0 0 0 12 6.351Zm0 9.316A3.667 3.667 0 1 1 15.667 12 3.667 3.667 0 0 1 12 15.667Zm5.872-10.859a1.32 1.32 0 1 0 1.32 1.32 1.32 1.32 0 0 0-1.32-1.32Z" />
        </svg>
      </div>
      <nav className="flex flex-col gap-4 flex-1">
        {mainItems.map((item) => (
          <div key={item.label} className="relative">
            <button
              className="flex items-center gap-4 text-gray-300 hover:text-white hover:bg-gray-900 px-2 py-2 rounded-lg transition w-full"
              onClick={() => {
                if (item.label === 'Create') {
                  setShowCreateDropdown(!showCreateDropdown);
                }
              }}
            >
              <div className="relative">
                <item.icon size={24} />
              </div>

              <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition">
                {item.label}
              </span>
            </button>
            
            {item.label === 'Create' && showCreateDropdown && (
              <div className="absolute left-full ml-2 top-0 bg-[#1C1C1C] rounded-lg shadow-lg overflow-hidden min-w-[200px] z-50">
                {createOptions.map((option) => (
                  <button
                    key={option.label}
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition w-full"
                    onClick={() => {
                      if (option.label === 'Post') {
                        setShowCreatePostModal(true);
                      } else {
                        console.log(`${option.label} clicked`);
                      }
                      setShowCreateDropdown(false);
                    }}
                  >
                    <option.icon size={20} />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="flex flex-col mt-auto">
        <div className="flex items-center gap-4 text-gray-300 hover:text-white hover:bg-gray-900 px-2 py-2 rounded-lg transition">
          <button>
            <Menu size={24} />
          </button>
          <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition">More</span>
        </div>

        <div className="flex items-center gap-4 text-gray-300 hover:text-white hover:bg-gray-900 px-2 py-2 rounded-lg transition">
          <button>
            <Grid3x3 size={24} />
          </button>
          <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition">Also from Meta</span>
        </div>
      </div>

      <CreatePostModal 
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        onPostCreated={() => {
          setShowCreatePostModal(false);
          if ((window as any).refreshPosts) {
            (window as any).refreshPosts();
          }
        }}
      />

    </div>
  );
}