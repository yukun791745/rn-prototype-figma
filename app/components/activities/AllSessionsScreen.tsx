import React from 'react';
import { ChevronLeft, Filter, Bike, Waves, Footprints, Dumbbell, ChevronDown, ChevronLeft as ChevronLeftIcon, ChevronRight } from 'lucide-react';

interface Session {
  id: string;
  date: string;
  discipline: 'swim' | 'bike' | 'run' | 'other';
  title: string;
  distance: number; // km
  duration: number; // minutes
  pace?: string; // min/km or km/h
  tss: number;
}

interface AllSessionsScreenProps {
  onBack: () => void;
  onActivityClick?: (id: string) => void;
}

export function AllSessionsScreen({ onBack, onActivityClick }: AllSessionsScreenProps) {
  const [selectedDiscipline, setSelectedDiscipline] = React.useState<'all' | 'swim' | 'bike' | 'run' | 'other'>('all');
  const [selectedMonth, setSelectedMonth] = React.useState<string>('all');
  const [showDisciplineDropdown, setShowDisciplineDropdown] = React.useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 30;

  // モックデータ生成（実際のデータに置き換え）
  const generateMockSessions = (): Session[] => {
    const sessions: Session[] = [];
    const today = new Date('2026-01-10');
    
    const disciplines: ('swim' | 'bike' | 'run' | 'other')[] = ['swim', 'bike', 'run', 'other'];
    const swimTitles = ['朝スイム', 'インターバル', 'ロングスイム', 'テクニック練習', 'イージースイム'];
    const bikeTitles = ['朝ライド', 'ヒルクライム', 'インターバル', 'ロングライド', 'リカバリーライド'];
    const runTitles = ['朝ラン', 'インターバル', 'ロングラン', 'テンポラン', 'イージーラン'];
    const otherTitles = ['筋トレ', 'ヨガ', '体幹トレーニング', 'ストレッチ', 'クロストレーニング'];

    // 過去6ヶ月分のデータを生成（約150セッション）
    for (let i = 0; i < 150; i++) {
      const daysAgo = Math.floor(i * 1.2); // 平均して1.2日に1セッション
      const sessionDate = new Date(today);
      sessionDate.setDate(sessionDate.getDate() - daysAgo);
      
      const discipline = disciplines[Math.floor(Math.random() * disciplines.length)];
      
      let title: string;
      let distance: number;
      let duration: number;
      let pace: string;
      let tss: number;
      
      switch (discipline) {
        case 'swim':
          title = swimTitles[Math.floor(Math.random() * swimTitles.length)];
          distance = parseFloat((1.5 + Math.random() * 3).toFixed(1)); // 1.5-4.5km
          duration = Math.round(distance * 25 + Math.random() * 10); // 約25分/km
          pace = `${Math.floor(duration / distance)}:${String(Math.round((duration / distance % 1) * 60)).padStart(2, '0')} min/km`;
          tss = Math.round(duration * 0.8 + Math.random() * 20);
          break;
        case 'bike':
          title = bikeTitles[Math.floor(Math.random() * bikeTitles.length)];
          distance = parseFloat((20 + Math.random() * 80).toFixed(1)); // 20-100km
          duration = Math.round(distance * 2 + Math.random() * 20); // 約2分/km
          pace = `${(distance / (duration / 60)).toFixed(1)} km/h`;
          tss = Math.round(duration * 1.2 + Math.random() * 30);
          break;
        case 'run':
          title = runTitles[Math.floor(Math.random() * runTitles.length)];
          distance = parseFloat((5 + Math.random() * 15).toFixed(1)); // 5-20km
          duration = Math.round(distance * 5.5 + Math.random() * 15); // 約5.5分/km
          pace = `${Math.floor(duration / distance)}:${String(Math.round((duration / distance % 1) * 60)).padStart(2, '0')} min/km`;
          tss = Math.round(duration * 1.5 + Math.random() * 25);
          break;
        case 'other':
          title = otherTitles[Math.floor(Math.random() * otherTitles.length)];
          distance = 0;
          duration = Math.round(30 + Math.random() * 60); // 30-90分
          pace = '-';
          tss = Math.round(duration * 0.5 + Math.random() * 15);
          break;
      }
      
      sessions.push({
        id: `session-${i}`,
        date: sessionDate.toISOString().split('T')[0],
        discipline,
        title,
        distance,
        duration,
        pace,
        tss
      });
    }
    
    return sessions;
  };

  const allSessions = generateMockSessions();

  // フィルタリング
  const filteredSessions = React.useMemo(() => {
    return allSessions.filter(session => {
      // 種目フィルター
      if (selectedDiscipline !== 'all' && session.discipline !== selectedDiscipline) {
        return false;
      }
      
      // 月フィルター
      if (selectedMonth !== 'all') {
        const sessionMonth = session.date.substring(0, 7); // YYYY-MM
        if (sessionMonth !== selectedMonth) {
          return false;
        }
      }
      
      return true;
    });
  }, [allSessions, selectedDiscipline, selectedMonth]);

  // ページネーション
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSessions = filteredSessions.slice(startIndex, endIndex);

  // ページ変更時に先頭にスクロール
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // フィルター変更時にページを1にリセット
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedDiscipline, selectedMonth]);

  // 利用可能な月のリストを生成
  const availableMonths = React.useMemo(() => {
    const months = new Set<string>();
    allSessions.forEach(session => {
      months.add(session.date.substring(0, 7));
    });
    return Array.from(months).sort().reverse();
  }, [allSessions]);

  const getDisciplineIcon = (discipline: string) => {
    switch (discipline) {
      case 'swim':
        return <Waves className="w-4 h-4" />;
      case 'bike':
        return <Bike className="w-4 h-4" />;
      case 'run':
        return <Footprints className="w-4 h-4" />;
      case 'other':
        return <Dumbbell className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getDisciplineColor = (discipline: string) => {
    switch (discipline) {
      case 'swim':
        return 'bg-[rgba(0,102,255,0.1)] text-[#0066FF] border-[#0066FF]';
      case 'bike':
        return 'bg-[rgba(102,102,255,0.1)] text-[#6666FF] border-[#6666FF]';
      case 'run':
        return 'bg-[rgba(255,51,204,0.1)] text-[#FF33CC] border-[#FF33CC]';
      case 'other':
        return 'bg-[rgba(153,153,153,0.1)] text-[#999999] border-[#999999]';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDisciplineLabel = (discipline: string) => {
    switch (discipline) {
      case 'swim':
        return 'スイム';
      case 'bike':
        return 'バイク';
      case 'run':
        return 'ラン';
      case 'other':
        return 'その他';
      case 'all':
        return 'すべて';
      default:
        return '';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}:${String(mins).padStart(2, '0')}`;
    }
    return `${mins}分`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${month}/${day} (${weekday})`;
  };

  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    return `${year}年${parseInt(month)}月`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F5FF] via-[#F5F9FF] to-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="px-4 py-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-all mb-3"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-slate-800">すべてのセッション</h1>
              <p className="text-xs text-slate-500">{filteredSessions.length}件のセッション</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-2">
            {/* Discipline Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowDisciplineDropdown(!showDisciplineDropdown);
                  setShowMonthDropdown(false);
                }}
                className="w-full flex items-center justify-between bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{getDisciplineLabel(selectedDiscipline)}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              </button>

              {showDisciplineDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-slate-200 rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto">
                  {['all', 'swim', 'bike', 'run', 'other'].map((discipline) => (
                    <button
                      key={discipline}
                      onClick={() => {
                        setSelectedDiscipline(discipline as any);
                        setShowDisciplineDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 transition-all flex items-center gap-2 ${
                        selectedDiscipline === discipline ? 'bg-indigo-100 font-semibold text-indigo-700' : 'text-slate-700'
                      }`}
                    >
                      {discipline !== 'all' && getDisciplineIcon(discipline)}
                      {getDisciplineLabel(discipline)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Month Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowMonthDropdown(!showMonthDropdown);
                  setShowDisciplineDropdown(false);
                }}
                className="w-full flex items-center justify-between bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all"
              >
                <span className="truncate">
                  {selectedMonth === 'all' ? 'すべての期間' : formatMonthLabel(selectedMonth)}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              </button>

              {showMonthDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-slate-200 rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedMonth('all');
                      setShowMonthDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 transition-all ${
                      selectedMonth === 'all' ? 'bg-indigo-100 font-semibold text-indigo-700' : 'text-slate-700'
                    }`}
                  >
                    すべての期間
                  </button>
                  {availableMonths.map((month) => (
                    <button
                      key={month}
                      onClick={() => {
                        setSelectedMonth(month);
                        setShowMonthDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 transition-all ${
                        selectedMonth === month ? 'bg-indigo-100 font-semibold text-indigo-700' : 'text-slate-700'
                      }`}
                    >
                      {formatMonthLabel(month)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="px-4 pt-4 space-y-2">
        {currentSessions.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-slate-200 p-8 text-center">
            <p className="text-slate-500">該当するセッションがありません</p>
          </div>
        ) : (
          currentSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all px-3 py-2 cursor-pointer"
              onClick={() => onActivityClick && onActivityClick(session.id)}
            >
              {/* Row 1: 日付、種目、タイトル */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-bold text-slate-800 min-w-[60px]">{formatDate(session.date)}</span>
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${getDisciplineColor(session.discipline)}`}>
                  {getDisciplineIcon(session.discipline)}
                  <span>{getDisciplineLabel(session.discipline)}</span>
                </div>
                <span className="text-sm text-slate-700 truncate flex-1">{session.title}</span>
              </div>

              {/* Row 2: 距離、時間、ペース、TSS */}
              <div className="flex items-center gap-3 text-xs text-slate-600">
                {session.distance > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">距離</span>
                    <span className="font-bold text-slate-800">{session.distance}km</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">時間</span>
                  <span className="font-bold text-slate-800">{formatDuration(session.duration)}</span>
                </div>
                {session.pace !== '-' && (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">ペース</span>
                    <span className="font-bold text-slate-800">{session.pace}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-slate-500">TSS</span>
                  <span className="font-bold text-indigo-700">{session.tss}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 pt-4 pb-4">
          <div className="bg-white rounded-lg border border-slate-200 px-3 py-2 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all ${
                  currentPage === 1
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <ChevronLeftIcon className="w-3 h-3" />
                前
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded text-xs font-semibold transition-all ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all ${
                  currentPage === totalPages
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                次
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}