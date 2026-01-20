import React from 'react';
import type { YoutubePlaylistItemDto } from '../types/youtube';


interface PlaylistItemRowProps {
  item: YoutubePlaylistItemDto;
}

const PlaylistItemComponent: React.FC<PlaylistItemRowProps> = ({ item }) => {
  const { snippet } = item;

return (
    <div className="group flex flex-col sm:flex-row gap-4 p-3 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
      {/* 영상 썸네일: 고정 너비 지정 */}
      <div className="relative flex-shrink-0 w-full sm:w-48 aspect-video overflow-hidden rounded-lg bg-gray-200">
        <img 
          src={snippet.thumbnails.medium?.url || snippet.thumbnails.high.url} 
          alt={snippet.title} 
          className="h-full w-full object-cover"
        />
        {/* 순번 표시 (position) */}
        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
          {snippet.position + 1}
        </div>
      </div>

      {/* 영상 정보 */}
      <div className="flex flex-col justify-center py-1">
        <h4 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600">
          {snippet.title}
        </h4>
        <p className="text-xs text-gray-500 mt-1">
          {snippet.title} • {new Date(snippet.publishedAt).toLocaleDateString()}
        </p>
        {/* 설명이 있다면 짧게 노출 */}
        {snippet.description && (
          <p className="text-xs text-gray-400 mt-2 line-clamp-1 italic">
            {snippet.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PlaylistItemComponent;