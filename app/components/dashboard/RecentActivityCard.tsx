import { ChevronRight } from 'lucide-react';

interface RecentActivityCardProps {
  name: string;
  date: string;
  type: string;
  typeColor: string;
  distance: string;
  duration: string;
  pace: string;
  tss: number;
  onCommentClick?: () => void;
  activityId?: string;
}

export function RecentActivityCard({
  name,
  date,
  type,
  typeColor,
  distance,
  duration,
  pace,
  tss,
  onCommentClick,
  activityId,
}: RecentActivityCardProps) {
  return (
    <section className="bg-white rounded-lg shadow-md border border-slate-200">
      <div className="px-4 pt-2.5 pb-2">
        <h2 className="text-sm font-semibold text-indigo-600">
          最近のアクティビティ
        </h2>
      </div>
      <div className="px-4 pb-3">
        {/* Activity Title - Compact */}
        <div className="mb-2.5">
          <h3 className="text-sm text-slate-800 font-semibold leading-snug mb-1.5 line-clamp-2">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <div className="text-[10px] text-slate-500">{date}</div>
            <div className={`text-[10px] px-2 py-0.5 rounded font-medium ${typeColor}`}>
              {type}
            </div>
          </div>
        </div>

        {/* Metrics Grid - Compact */}
        <div className="grid grid-cols-4 gap-3 pt-2.5 border-t border-slate-200/80 mb-2.5">
          {/* 距離 */}
          <div>
            <div className="text-[9px] text-slate-400 mb-1.5 font-medium uppercase tracking-wide">
              距離
            </div>
            <div className="text-xl font-bold tabular-nums text-indigo-600 leading-none">
              {distance}
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">km</div>
          </div>

          {/* 時間 */}
          <div>
            <div className="text-[9px] text-slate-400 mb-1.5 font-medium uppercase tracking-wide">
              時間
            </div>
            <div className="text-xl font-bold tabular-nums text-indigo-600 leading-none">
              {duration}
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">h:mm</div>
          </div>

          {/* ペース */}
          <div>
            <div className="text-[9px] text-slate-400 mb-1.5 font-medium uppercase tracking-wide">
              ペース
            </div>
            <div className="text-xl font-bold tabular-nums text-indigo-600 leading-none">
              {pace}
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">/100m</div>
          </div>

          {/* TSS */}
          <div>
            <div className="text-[9px] text-slate-400 mb-1.5 font-medium uppercase tracking-wide">
              TSS
            </div>
            <div className="text-xl font-bold tabular-nums text-indigo-600 leading-none">
              {tss}
            </div>
            <div className="text-[9px] text-slate-400 mt-0.5">負荷</div>
          </div>
        </div>

        {/* Link */}
        <button
          onClick={onCommentClick}
          className="flex items-center gap-1 ml-auto text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
        >
          <span>AIコーチのコメントを見る</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}