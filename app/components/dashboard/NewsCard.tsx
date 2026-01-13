import { Newspaper, ChevronRight } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  language: 'jp' | 'en';
  url: string;
}

interface NewsCardProps {
  news: NewsItem[];
  onViewAllClick?: () => void;
  onNewsItemClick?: (item: NewsItem) => void;
}

export function NewsCard({ news, onViewAllClick, onNewsItemClick }: NewsCardProps) {
  return (
    <section className="bg-white rounded-lg shadow-md border border-slate-200">
      <div className="px-4 pt-2.5 pb-2">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-indigo-300" />
          <h2 className="text-sm font-semibold text-indigo-600">最新ニュース</h2>
        </div>
      </div>
      <div className="px-4 pb-3">
        <div className="space-y-2 mb-2">
          {news.map((item) => (
            <button
              key={item.id}
              onClick={() => onNewsItemClick?.(item)}
              className="w-full text-left pb-2 border-b border-slate-200 last:border-b-0 last:pb-0 hover:bg-slate-50 -mx-2 px-2 rounded transition-colors"
            >
              <div className="text-xs text-slate-800 font-semibold mb-1 leading-snug">
                {item.title}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[10px] text-slate-500">{item.source}</div>
                {item.language === 'en' && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded font-medium">
                    日本語要約あり
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
        {/* Link */}
        <button
          onClick={onViewAllClick}
          className="flex items-center gap-1 ml-auto text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
        >
          <span>すべてのニュースを見る</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}