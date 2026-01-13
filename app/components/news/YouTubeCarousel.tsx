import { Clock } from 'lucide-react';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
}

interface YouTubeCarouselProps {
  videos: YouTubeVideo[];
  onVideoClick?: (videoId: string) => void;
}

export function YouTubeCarousel({ videos, onVideoClick }: YouTubeCarouselProps) {
  if (videos.length === 0) return null;

  return (
    <div className="mt-3">
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => onVideoClick?.(video.id)}
            className="flex-shrink-0 w-44 group"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden mb-2">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              
              {/* Duration */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/80 text-white px-1.5 py-0.5 rounded text-[10px] font-medium">
                <Clock className="w-2.5 h-2.5" />
                <span>{video.duration}</span>
              </div>
            </div>

            {/* Title */}
            <h4 className="text-xs text-slate-700 font-medium text-left line-clamp-2 leading-snug group-hover:text-rose-500 transition-colors">
              {video.title}
            </h4>
          </button>
        ))}
      </div>
    </div>
  );
}
