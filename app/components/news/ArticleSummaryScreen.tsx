import React from 'react';
import { ArrowLeft, AlertCircle, ExternalLink, FileText, Video, Headphones } from 'lucide-react';

export interface ArticleSummary {
  id: string;
  originalTitle: string;
  translatedTitle: string;
  source: string;
  publishedAt: string;
  mediaType: 'article' | 'video' | 'podcast' | 'youtube';
  url: string;
  aiSummary: {
    overview: string;
    keyPoints: string[];
    implicationsForAthletes: string;
  };
}

interface ArticleSummaryScreenProps {
  article: ArticleSummary;
  onBackToList: () => void;
  onReadOriginal: () => void;
}

export function ArticleSummaryScreen({
  article,
  onBackToList,
  onReadOriginal,
}: ArticleSummaryScreenProps) {
  const mediaTypeLabels = {
    article: '記事',
    video: '動画',
    podcast: 'ポッドキャスト',
    youtube: 'YouTube',
  };

  const mediaIcons = {
    article: FileText,
    video: Video,
    podcast: Headphones,
    youtube: Video,
  };

  const MediaIcon = mediaIcons[article.mediaType];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="px-4 py-3">
          {/* Back button */}
          <button
            onClick={onBackToList}
            className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">ニュース一覧に戻る</span>
          </button>

          {/* Article Title */}
          <h1 className="text-base font-bold text-slate-800 leading-snug mb-2">
            {article.translatedTitle}
          </h1>

          {/* Meta info */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-semibold rounded uppercase tracking-wide">
              {article.source}
            </span>
            <div className="flex items-center gap-1 text-slate-500">
              <MediaIcon className="w-3 h-3" />
              <span className="text-[10px] font-medium">
                {mediaTypeLabels[article.mediaType]}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">{article.publishedAt}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-5 space-y-4">
        {/* AI Summary Badge */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-indigo-200"></div>
          <span className="px-3 py-1 bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-200/50">
            AI生成要約
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-indigo-200 to-purple-200"></div>
        </div>

        {/* Overview Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 mb-2.5 flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
            概要
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {article.aiSummary.overview}
          </p>
        </div>

        {/* Key Points Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
            重要ポイント
          </h2>
          <ul className="space-y-2.5">
            {article.aiSummary.keyPoints.map((point, index) => (
              <li key={index} className="flex gap-2.5 text-sm text-slate-700 leading-relaxed">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center mt-0.5">
                  {index + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Implications for Triathletes Section */}
        <div className="bg-gradient-to-br from-rose-50/50 to-pink-50/50 rounded-xl border border-rose-200/50 p-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 mb-2.5 flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full"></div>
            トライアスリートへの示唆
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {article.aiSummary.implicationsForAthletes}
          </p>
        </div>

        {/* AI Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              この要約はAIによって自動生成されたものです。正確な情報は必ず原文でご確認ください。
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Primary: Read Original */}
          <button
            onClick={onReadOriginal}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span className="text-sm">原文記事を読む</span>
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Secondary: Back to List */}
          <button
            onClick={onBackToList}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">一覧に戻る</span>
          </button>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}
