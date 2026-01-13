import React from 'react';
import { Settings2, Languages } from 'lucide-react';

export interface NewsFilters {
  language: 'all' | 'jp' | 'en';
  topic: string;
  media: 'all' | 'article' | 'video' | 'podcast';
  source: 'all' | 'selected';
  autoTranslate: boolean;
}

interface FilterBarProps {
  filters: NewsFilters;
  onFilterChange: (filters: NewsFilters) => void;
  onManageSources?: () => void;
}

export function FilterBar({ filters, onFilterChange, onManageSources }: FilterBarProps) {
  const topics = [
    { value: 'all', label: 'すべて' },
    { value: 'training', label: 'トレーニング' },
    { value: 'nutrition', label: '栄養' },
    { value: 'gear', label: 'ギア' },
    { value: 'race', label: 'レース' },
    { value: 'recovery', label: 'リカバリー' },
    { value: 'science', label: '科学' },
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-[53px] z-30">
      <div className="px-4 py-3 space-y-3">
        {/* Row 1: Language, Topic, Media */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {/* Language filter */}
          <select
            value={filters.language}
            onChange={(e) =>
              onFilterChange({ ...filters, language: e.target.value as NewsFilters['language'] })
            }
            className="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 flex-shrink-0"
          >
            <option value="all">言語: すべて</option>
            <option value="jp">日本語</option>
            <option value="en">English</option>
          </select>

          {/* Topic filter */}
          <select
            value={filters.topic}
            onChange={(e) => onFilterChange({ ...filters, topic: e.target.value })}
            className="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 flex-shrink-0"
          >
            {topics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.value === 'all' ? 'トピック: ' : ''}
                {topic.label}
              </option>
            ))}
          </select>

          {/* Media filter */}
          <select
            value={filters.media}
            onChange={(e) =>
              onFilterChange({ ...filters, media: e.target.value as NewsFilters['media'] })
            }
            className="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 flex-shrink-0"
          >
            <option value="all">メディア: すべて</option>
            <option value="article">記事</option>
            <option value="video">動画</option>
            <option value="podcast">ポッドキャスト</option>
          </select>

          {/* Source filter */}
          <select
            value={filters.source}
            onChange={(e) =>
              onFilterChange({ ...filters, source: e.target.value as NewsFilters['source'] })
            }
            className="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 flex-shrink-0"
          >
            <option value="all">情報源: すべて</option>
            <option value="selected">選択中のみ</option>
          </select>
        </div>

        {/* Row 2: Auto-translate & Manage sources */}
        <div className="flex items-center justify-between gap-2">
          {/* Auto translate toggle */}
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={filters.autoTranslate}
                onChange={(e) =>
                  onFilterChange({ ...filters, autoTranslate: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-rose-400 peer-checked:to-purple-400 transition-all"></div>
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm"></div>
            </div>
            <div className="flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-medium text-slate-600">英語を自動翻訳</span>
            </div>
          </label>

          {/* Manage sources button */}
          <button
            onClick={onManageSources}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>情報源を管理</span>
          </button>
        </div>
      </div>
    </div>
  );
}
