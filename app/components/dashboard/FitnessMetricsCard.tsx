import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';

interface FitnessMetricsCardProps {
  ctl: number;
  ctlDelta: number;
  atl: number;
  atlDelta: number;
  tsb: number;
  tsbDelta: number;
  onDetailClick?: () => void;
}

export function FitnessMetricsCard({
  ctl,
  ctlDelta,
  atl,
  atlDelta,
  tsb,
  tsbDelta,
  onDetailClick,
}: FitnessMetricsCardProps) {
  return (
    <section className="bg-white rounded-lg shadow-md border border-slate-200">
      <div className="px-4 pt-3 pb-2">
        <h2 className="text-sm font-semibold text-indigo-600">フィットネス概要</h2>
      </div>
      <div className="px-4 pb-2">
        <div className="grid grid-cols-3 gap-2 mb-2">
          {/* フィットネス（CTL） */}
          <div className="bg-white border border-[#0066FF] rounded-lg p-2.5 shadow-sm flex items-center justify-center">
            <div className="w-full">
              <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2 text-center">
                フィットネス
              </div>
              <div className="flex items-end justify-center gap-2 mb-1">
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold tabular-nums text-[#0066FF] leading-none mb-1">
                    {ctl}
                  </div>
                  <div className="text-[9px] text-slate-400 tracking-wide">CTL</div>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`text-base font-semibold tabular-nums leading-none mb-1 ${
                      ctlDelta >= 0 ? 'text-[#0066FF]' : 'text-slate-400'
                    }`}
                  >
                    {ctlDelta >= 0 ? '+' : ''}
                    {ctlDelta}
                  </div>
                  <div className="text-[8px] text-slate-400 tracking-wide whitespace-nowrap">前日比</div>
                </div>
              </div>
            </div>
          </div>

          {/* 疲労（ATL） */}
          <div className="bg-white border border-[#FF33CC] rounded-lg p-2.5 shadow-sm flex items-center justify-center">
            <div className="w-full">
              <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2 text-center">
                疲労
              </div>
              <div className="flex items-end justify-center gap-2 mb-1">
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold tabular-nums text-[#FF33CC] leading-none mb-1">
                    {atl}
                  </div>
                  <div className="text-[9px] text-slate-400 tracking-wide">ATL</div>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`text-base font-semibold tabular-nums leading-none mb-1 ${
                      atlDelta < 0 ? 'text-[#FF33CC]' : 'text-slate-400'
                    }`}
                  >
                    {atlDelta >= 0 ? '+' : ''}
                    {atlDelta}
                  </div>
                  <div className="text-[8px] text-slate-400 tracking-wide whitespace-nowrap">前日比</div>
                </div>
              </div>
            </div>
          </div>

          {/* コンディション（TSB） */}
          <div className="bg-white border-2 border-[#6666FF] rounded-lg p-2.5 shadow-sm flex items-center justify-center">
            <div className="w-full">
              <div className="text-[9px] text-[#6666FF] uppercase tracking-wider font-semibold mb-2 text-center">
                コンディション
              </div>
              <div className="flex items-end justify-center gap-2 mb-1">
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold tabular-nums text-[#6666FF] leading-none mb-1">
                    {tsb}
                  </div>
                  <div className="text-[9px] text-[#6666FF] tracking-wide">TSB</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-base font-semibold tabular-nums leading-none mb-1 text-[#6666FF]">
                    {tsbDelta >= 0 ? '+' : ''}
                    {tsbDelta}
                  </div>
                  <div className="text-[8px] text-[#6666FF] tracking-wide whitespace-nowrap">前日比</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Link */}
        <button
          onClick={onDetailClick}
          className="flex items-center gap-1 ml-auto text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
        >
          <span>詳細を見る</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}