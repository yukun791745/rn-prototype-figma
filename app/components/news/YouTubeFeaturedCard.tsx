import { Play, Clock } from 'lucide-react';

interface YouTubeFeaturedCardProps {
  isConnected: boolean;
  video?: {
    id: string;
    title: string;
    thumbnail: string;
    publishedAt: string;
    duration: string;
  };
  onConnect?: () => void;
  onPlay?: (videoId: string) => void;
}

export function YouTubeFeaturedCard({
  isConnected,
  video,
  onConnect,
  onPlay,
}: YouTubeFeaturedCardProps) {
  if (!isConnected) {
    return (
      <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/40 rounded-2xl p-6 border border-indigo-100/50 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Play className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-2">
          YouTubeチャンネル未設定
        </h3>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          チャンネルを設定すると、最新の動画をここに表示します
        </p>
        <button
          onClick={onConnect}
          className="px-6 py-2.5 bg-gradient-to-r from-rose-400 to-purple-400 text-white text-sm font-medium rounded-full hover:shadow-md transition-shadow"
        >
          チャンネルを設定
        </button>
      </div>
    );
  }

  if (!video) return null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-100">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
          <Clock className="w-3 h-3" />
          <span>{video.duration}</span>
        </div>

        {/* Play button overlay */}
        <button
          onClick={() => onPlay?.(video.id)}
          className="absolute inset-0 flex items-center justify-center group"
        >
          <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Play className="w-8 h-8 text-rose-500 fill-rose-500 ml-1" />
          </div>
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 flex-1">
            {video.title}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">{video.publishedAt}</p>
          <button
            onClick={() => onPlay?.(video.id)}
            className="px-4 py-1.5 bg-rose-50 text-rose-500 text-xs font-medium rounded-full hover:bg-rose-100 transition-colors"
          >
            再生
          </button>
        </div>
      </div>
    </div>
  );
}
