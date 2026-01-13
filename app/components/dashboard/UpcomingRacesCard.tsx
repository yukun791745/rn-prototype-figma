import { Calendar, ChevronRight } from 'lucide-react';

interface Race {
  id: number;
  name: string;
  date: string;
  daysLeft: number;
  targetTime: string;
  predictedTime: string;
  priority?: 'A' | 'B' | 'C';
}

interface UpcomingRacesCardProps {
  races: Race[];
  onViewAllClick?: () => void;
}

export function UpcomingRacesCard({ races, onViewAllClick }: UpcomingRacesCardProps) {
  // 直近2レースのみ表示
  const displayRaces = races.slice(0, 2);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'A':
        return 'bg-[#FF33CC] text-white';
      case 'B':
        return 'bg-[#0066FF] text-white';
      case 'C':
        return 'bg-[#6666FF] text-white';
      default:
        return 'bg-slate-300 text-white';
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-md border border-slate-200">
      <div className="px-4 pt-2.5 pb-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-300" />
          <h2 className="text-sm font-semibold text-indigo-600">参加予定レース</h2>
        </div>
      </div>
      <div className="px-4 pb-3">
        <div className="space-y-2.5 mb-2">
          {displayRaces.map((race, index) => (
            <div
              key={race.id}
              className={`${
                index !== displayRaces.length - 1 ? 'pb-2.5 border-b border-slate-200' : ''
              }`}
            >
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm text-slate-800 font-semibold leading-snug flex-1 line-clamp-1">
                    {race.name}
                  </h3>
                  {race.priority && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${getPriorityColor(race.priority)}`}>
                      {race.priority}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500">{race.date}</div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 items-center">
                {/* 残り日数 */}
                <div>
                  <div className="inline-flex items-baseline gap-1 px-2 py-0.5 bg-rose-400/90 rounded-full">
                    <span className="text-white text-[9px]">あと</span>
                    <span className="text-white text-xl font-bold tabular-nums leading-none">
                      {race.daysLeft}
                    </span>
                    <span className="text-white text-[9px]">日</span>
                  </div>
                </div>

                {/* 目標タイム */}
                <div>
                  <div className="text-[9px] text-slate-500 mb-0.5 font-medium">目標</div>
                  <div className="text-base font-bold tabular-nums text-slate-700 leading-none">
                    {race.targetTime}
                  </div>
                </div>

                {/* 予想タイム */}
                <div>
                  <div className="text-[9px] text-slate-500 mb-0.5 font-medium">予想</div>
                  <div className="text-base font-bold tabular-nums text-rose-500 leading-none">
                    {race.predictedTime}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Link */}
        <button
          onClick={onViewAllClick}
          className="flex items-center gap-1 ml-auto text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
        >
          <span>すべてのレースを見る</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}