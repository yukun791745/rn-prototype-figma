import React from 'react';
import { FileText, Video, Headphones, ExternalLink, ChevronRight } from 'lucide-react';

export interface NewsItem {
  id: string;
  source: string;
  mediaType: 'article' | 'video' | 'podcast' | 'youtube';
  language: 'jp' | 'en';
  title: string;
  summary: string;
  timestamp: string;
  url: string;
  thumbnail?: string;
  translatedTitle?: string;
  translatedSummary?: string;
}

interface NewsFeedItemProps {
  item: NewsItem;
  autoTranslate: boolean;
  onViewJapaneseSummary?: (itemId: string) => void;
  onClick?: (url: string) => void;
}

export function NewsFeedItem({
  item,
  autoTranslate,
  onViewJapaneseSummary,
  onClick,
}: NewsFeedItemProps) {
  const [showOriginal, setShowOriginal] = React.useState(false);

  const mediaIcons = {
    article: FileText,
    video: Video,
    podcast: Headphones,
    youtube: Video,
  };

  const MediaIcon = mediaIcons[item.mediaType];

  const isTranslated = Boolean(item.translatedTitle);
  const shouldShowTranslation =
    item.language === 'en' && autoTranslate && !showOriginal;

  const displayTitle = shouldShowTranslation ? item.translatedTitle || item.title : item.title;
  const displaySummary = shouldShowTranslation
    ? item.translatedSummary || item.summary
    : item.summary;

  const hasThumbnail = Boolean(item.thumbnail);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-200 hover:shadow-sm transition-all">
      <button
        onClick={() => onClick?.(item.url)}
        className="w-full p-3 text-left"
      >
        <div className={`flex gap-3 ${hasThumbnail ? 'items-start' : 'flex-col'}`}>
          {/* Thumbnail (if exists) */}
          {hasThumbnail && (
            <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-slate-100">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header: Source, Media Type, Language */}
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              {/* Source badge */}
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-semibold rounded uppercase tracking-wide">
                {item.source}
              </span>

              {/* Media type */}
              <div className="flex items-center gap-1 text-slate-500">
                <MediaIcon className="w-3 h-3" />
                <span className="text-[10px] font-medium">
                  {item.mediaType === 'article'
                    ? '記事'
                    : item.mediaType === 'video'
                    ? '動画'
                    : item.mediaType === 'youtube'
                    ? 'YouTube'
                    : 'ポッドキャスト'}
                </span>
              </div>

              {/* Language badge */}
              <span
                className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                  item.language === 'en'
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {item.language.toUpperCase()}
              </span>

              {/* Translation badge */}
              {shouldShowTranslation && (
                <span className="px-1.5 py-0.5 bg-[rgba(102,102,255,0.1)] text-[#6666FF] text-[10px] font-medium rounded">
                  翻訳済み
                </span>
              )}

              {/* Timestamp */}
              <span className="text-[10px] text-slate-400 ml-auto">{item.timestamp}</span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-slate-800 leading-snug mb-1.5 line-clamp-2">
              {displayTitle}
            </h3>

            {/* Summary */}
            <p className="text-xs text-slate-600 leading-relaxed mb-2 line-clamp-2">
              {displaySummary}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2">
              {shouldShowTranslation && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOriginal(true);
                  }}
                  className="px-2.5 py-0.5 text-[11px] font-medium text-slate-500 hover:bg-slate-50 rounded-full transition-colors"
                >
                  原文を表示
                </button>
              )}

              {showOriginal && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOriginal(false);
                  }}
                  className="px-2.5 py-0.5 text-[11px] font-medium text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                >
                  翻訳を表示
                </button>
              )}

              <div className="flex items-center gap-1 ml-auto text-indigo-600">
                <span className="text-xs font-semibold">詳細を見る</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Japanese Summary Link for English Articles */}
      {item.language === 'en' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewJapaneseSummary?.(item.id);
          }}
          className="w-full px-3 py-2.5 border-t border-slate-100 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 hover:from-purple-50 hover:to-indigo-50 transition-all flex items-center justify-between group"
        >
          <span className="text-xs font-medium text-slate-700">
            日本語の要約を見る
          </span>
          <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}