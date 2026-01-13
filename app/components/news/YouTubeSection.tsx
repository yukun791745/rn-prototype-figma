import { Youtube } from 'lucide-react';
import { YouTubeFeaturedCard } from './YouTubeFeaturedCard';
import { YouTubeCarousel } from './YouTubeCarousel';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt?: string;
  duration: string;
}

interface YouTubeSectionProps {
  isConnected: boolean;
  featuredVideo?: YouTubeVideo;
  recentVideos?: YouTubeVideo[];
  onConnect?: () => void;
  onVideoPlay?: (videoId: string) => void;
}

export function YouTubeSection({
  isConnected,
  featuredVideo,
  recentVideos = [],
  onConnect,
  onVideoPlay,
}: YouTubeSectionProps) {
  return (
    <section className="mb-4">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3 px-4">
        <Youtube className="w-5 h-5 text-rose-500" />
        <h2 className="text-base font-semibold text-slate-800">
          マイチャンネル
        </h2>
        {isConnected && (
          <span className="text-xs text-slate-400">最新の動画</span>
        )}
      </div>

      {/* Featured card */}
      <div className="px-4">
        <YouTubeFeaturedCard
          isConnected={isConnected}
          video={featuredVideo}
          onConnect={onConnect}
          onPlay={onVideoPlay}
        />
      </div>

      {/* Carousel */}
      {isConnected && recentVideos.length > 0 && (
        <YouTubeCarousel videos={recentVideos} onVideoClick={onVideoPlay} />
      )}
    </section>
  );
}
