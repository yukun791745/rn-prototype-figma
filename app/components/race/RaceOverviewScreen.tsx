import React from 'react';
import { Calendar, MapPin, Trophy, Clock, Plus, Target, Edit, ChevronRight, Trash2 } from 'lucide-react';

interface SelectedRace {
  id: string;
  name: string;
  date: string;
  location: string;
  category: string;
  targetTime: string;
  daysUntilRace: number;
  priority?: 'A' | 'B' | 'C';
}

interface RaceOverviewScreenProps {
  onSelectRaces: () => void;
  onSetGoal?: (race: SelectedRace) => void;
  selectedRaces?: SelectedRace[];
  onDeleteRace?: (raceId: string) => void;
}

export function RaceOverviewScreen({ 
  onSelectRaces, 
  onSetGoal,
  selectedRaces: propSelectedRaces,
  onDeleteRace
}: RaceOverviewScreenProps) {
  const [confirmDelete, setConfirmDelete] = React.useState<string | null>(null);
  
  // Get saved goal time from localStorage
  const savedGoalTime = localStorage.getItem('raceGoalTime');
  
  // Mock data - later this will come from state/props
  const defaultRaces: SelectedRace[] = [
    {
      id: '1',
      name: 'オリンピックディスタンス・トライアスロン',
      date: '2026-01-18',
      location: '東京',
      category: 'スタンダード',
      targetTime: savedGoalTime || '',
      daysUntilRace: 8,
      priority: 'A'
    },
    {
      id: '2',
      name: 'スプリント・トライアスロン大会',
      date: '2026-02-15',
      location: '横浜',
      category: 'ショート',
      targetTime: '01:15:00',
      daysUntilRace: 36,
      priority: 'B'
    }
  ];

  // Calculate days until race and format date
  const calculateDaysUntilRace = (dateStr: string): number => {
    let raceDate: Date;
    
    // Handle both ISO format (2026-01-18) and Japanese format (2026年1月18日)
    if (dateStr.includes('年')) {
      // Parse Japanese format: 2026年1月18日
      const match = dateStr.match(/(\d+)年(\d+)月(\d+)日/);
      if (match) {
        const year = parseInt(match[1]);
        const month = parseInt(match[2]) - 1; // JavaScript months are 0-indexed
        const day = parseInt(match[3]);
        raceDate = new Date(year, month, day);
      } else {
        return 0;
      }
    } else {
      // Parse ISO format: 2026-01-18
      raceDate = new Date(dateStr);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    raceDate.setHours(0, 0, 0, 0);
    const diffTime = raceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateStr: string): string => {
    let date: Date;
    
    // Handle both ISO format and Japanese format
    if (dateStr.includes('年')) {
      // Already in Japanese format, return as is (but add weekday if missing)
      const match = dateStr.match(/(\d+)年(\d+)月(\d+)日/);
      if (match) {
        const year = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const day = parseInt(match[3]);
        date = new Date(year, month, day);
      } else {
        return dateStr;
      }
    } else {
      // Parse ISO format
      date = new Date(dateStr);
    }
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${year}年${month}月${day}日（${weekday}）`;
  };

  // Process races with calculated values and sort by date (nearest first)
  const processedRaces = (propSelectedRaces || defaultRaces).map(race => ({
    ...race,
    daysUntilRace: calculateDaysUntilRace(race.date),
    formattedDate: formatDate(race.date)
  })).sort((a, b) => a.daysUntilRace - b.daysUntilRace);

  const handleDeleteRace = (raceId: string) => {
    if (onDeleteRace) {
      onDeleteRace(raceId);
    }
    setConfirmDelete(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'A':
        return 'bg-[#FF33CC] text-white border-[#FF33CC]';
      case 'B':
        return 'bg-[rgba(0,102,255,0.1)] text-[#0066FF] border-[#0066FF]';
      case 'C':
        return 'bg-[rgba(102,102,255,0.1)] text-[#6666FF] border-[#6666FF]';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getRaceUrgencyColor = (days: number) => {
    if (days <= 7) return 'text-[#FF33CC] bg-[rgba(255,51,204,0.1)]';
    if (days <= 14) return 'text-[#0066FF] bg-[rgba(0,102,255,0.1)]';
    if (days <= 30) return 'text-[#6666FF] bg-[rgba(102,102,255,0.1)]';
    return 'text-[#CCCCCC] bg-[rgba(204,204,204,0.1)]';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">参加予定レース</h1>
            <p className="text-xs text-slate-500 mt-0.5">{processedRaces.length}件のレースが選択されています</p>
          </div>
          <Trophy className="w-8 h-8 text-indigo-500" />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pt-4 space-y-3">
        {processedRaces.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">まだレースが選択されていません</h3>
            <p className="text-sm text-slate-500 mb-4">
              参加予定のレースを選択して、目標設定とトレーニング計画を立てましょう
            </p>
            <button
              onClick={onSelectRaces}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold text-sm rounded-lg shadow-md hover:from-indigo-600 hover:to-blue-600 transition-all"
            >
              レースを選択する
            </button>
          </div>
        ) : (
          <>
            {/* Race Cards */}
            {processedRaces.map((race, index) => (
              <div
                key={race.id}
                className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 border-b border-slate-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="font-bold text-base text-slate-800 mb-1">{race.name}</h2>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded">
                          {race.category}
                        </span>
                        {race.priority && (
                          <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getPriorityColor(race.priority)}`}>
                            {race.priority}レース
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => setConfirmDelete(race.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Date and Location */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-500">開催日</p>
                        <p className="text-[11px] font-semibold text-slate-800 leading-tight">{race.formattedDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-500">開催地</p>
                        <p className="text-xs font-semibold text-slate-800 truncate">{race.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Target Time and Days Until Race */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Target className="w-4 h-4 text-rose-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-500">目標タイム</p>
                        {race.targetTime ? (
                          <p className="text-sm font-bold text-rose-600">{race.targetTime}</p>
                        ) : (
                          <p className="text-sm font-bold text-slate-400">未設定</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getRaceUrgencyColor(race.daysUntilRace)}`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-500">残り日数</p>
                        <p className={`text-base font-extrabold ${
                          race.daysUntilRace <= 7 ? 'text-[#FF33CC]' :
                          race.daysUntilRace <= 14 ? 'text-[#0066FF]' :
                          race.daysUntilRace <= 30 ? 'text-[#6666FF]' :
                          'text-slate-600'
                        }`}>
                          {race.daysUntilRace}日
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2">
                    <button
                      onClick={() => onSetGoal && onSetGoal(race)}
                      className="w-full py-2 px-3 text-left flex items-center justify-between group hover:bg-indigo-50/50 rounded-lg transition-all"
                    >
                      <span className="text-indigo-600 font-medium text-xs">
                        {race.targetTime ? '目標タイムを修正する' : '目標タイムを設定する'}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Races Button */}
            <button
              onClick={onSelectRaces}
              className="w-full py-4 bg-white border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>参加するレースを選択する</span>
            </button>
          </>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold text-slate-800 mb-2">レースを削除しますか？</h2>
            <p className="text-sm text-slate-600 mb-6">この操作は取り消せません。</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all"
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDeleteRace(confirmDelete)}
                className="flex-1 py-2.5 bg-red-500 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-red-600 transition-all"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}