import React from 'react';
import type { YoutubePlaylistDto } from '../types/youtube';
import { useNavigate } from 'react-router-dom';

// Props 타입 정의
interface PlaylistCardProps {
  playlist: YoutubePlaylistDto;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const navigate = useNavigate();
  const { snippet, contentDetails } = playlist;
  const { title, thumbnails, channelTitle, description } = snippet;

  return (
    <div className="group cursor-pointer flex flex-col gap-3">
      {/* 썸네일 영역 */}
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-200 shadow-sm">
        <img 
          src={thumbnails.high.url} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div onClick={()=> navigate(`/playlists/${playlist.id}`) }>
          {contentDetails.itemCount}개 영상 목록 상세 이동
        </div>
      </div>

      {/* 정보 영역 */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="line-clamp-2 text-base font-semibold text-gray-900 leading-snug group-hover:text-blue-600">
          {title}
        </h3>
        <div className="flex flex-col text-sm text-gray-500">
          <span>{channelTitle}</span>
          {/* 설명이 있을 경우에만 노출하거나, 나중에 상세 정보로 활용 가능 */}
          {description && (
            <p className="mt-1 line-clamp-1 text-xs text-gray-400">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;