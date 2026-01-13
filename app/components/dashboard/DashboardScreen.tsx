import React from 'react';
import { Calendar, TrendingUp, Dumbbell, Target, ChevronRight, Flame, Clock, Activity } from 'lucide-react';
import { FitnessChartCard } from './FitnessChartCard';
import { PeriodSelection } from './types';

interface TrainingSession {
  id: string;
  date: string;
  type: 'スイム' | 'バイク' | 'ラン' | 'ブリック' | '筋トレ' | 'リカバリー';
  name: string;
  distance?: string;
  duration: string;
  tss: number;
  completed: boolean;
}

interface WeeklySummary {
  weekNumber: number;
  totalTSS: number;
  plannedTSS: number;
  completedSessions: number;
  totalSessions: number;
  swimDistance: string;
  bikeDistance: string;
  runDistance: string;
  totalTime: string;
}

interface TrainingPhase {
  name: string;
  currentWeek: number;
  totalWeeks: number;
  targetRace: string;
  weeksUntilRace: number;
}

interface TrainingDashboardScreenProps {
  onViewSchedule?: () => void;
  onViewAllSessions?: () => void;
  onViewPlan?: () => void;
  onViewOverview?: () => void;
  onSessionClick?: (sessionId: string) => void;
  onPeriodChange?: (period: PeriodSelection) => void;
  currentCTL: number;
  currentATL: number;
  currentTSB: number;
  ctlDelta: number;
  atlDelta: number;
  tsbDelta: number;
  selectedPeriod?: PeriodSelection;
}

export function TrainingDashboardScreen({ 
  onViewSchedule, 
  onViewAllSessions, 
  onViewPlan,
  onViewOverview,
  onSessionClick,
  onPeriodChange,
  currentCTL,
  currentATL,
  currentTSB,
  ctlDelta,
  atlDelta,
  tsbDelta,
  selectedPeriod
}: TrainingDashboardScreenProps) {
  // Mock data - 後で実際のデータに置き換え
  const weeklySummary: WeeklySummary = {
    weekNumber: 3,
    totalTSS: 385,
    plannedTSS: 450,
    completedSessions: 7,
    totalSessions: 9,
    swimDistance: '8.5km',
    bikeDistance: '142km',
    runDistance: '32km',
    totalTime: '12:45:30'
  };

  const upcomingSessions: TrainingSession[] = [
    {
      id: '1',
      date: '今日 18:00',
      type: 'ラン',
      name: 'テンポラン',
      distance: '10km',
      duration: '50分',
      tss: 65,
      completed: false
    },
    {
      id: '2',
      date: '明日 6:00',
      type: 'スイム',
      name: 'インターバル',
      distance: '2.5km',
      duration: '60分',
      tss: 58,
      completed: false
    },
    {
      id: '3',
      date: '1月12日 9:00',
      type: 'バイク',
      name: 'ロングライド',
      distance: '80km',
      duration: '3:00',
      tss: 142,
      completed: false
    }
  ];

  const recentSessions: TrainingSession[] = [
    {
      id: '4',
      date: '2026年1月9日（木）',
      type: 'スイム',
      name: '持久力スイムセッション',
      distance: '3.2km',
      duration: '1:24',
      tss: 68,
      completed: true
    },
    {
      id: '5',
      date: '2026年1月8日（水）',
      type: 'ラン',
      name: 'イージーラン',
      distance: '8km',
      duration: '48分',
      tss: 42,
      completed: true
    },
    {
      id: '6',
      date: '2026年1月7日（火）',
      type: 'バイク',
      name: 'テンポライド',
      distance: '45km',
      duration: '1:30',
      tss: 78,
      completed: true
    }
  ];

  const trainingPhase: TrainingPhase = {
    name: 'ベース期',
    currentWeek: 3,
    totalWeeks: 8,
    targetRace: 'オリンピックディスタンス・トライアスロン',
    weeksUntilRace: 1
  };

  const getTypeColor = (type: TrainingSession['type']) => {
    switch (type) {
      case 'スイム':
        return 'bg-[#0066FF] text-white';
      case 'バイク':
        return 'bg-[#000099] text-white';
      case 'ラン':
        return 'bg-[#FF33CC] text-white';
      case 'ブリック':
        return 'bg-gradient-to-r from-[#0066FF] to-[#FF33CC] text-white';
      case '筋トレ':
        return 'bg-slate-600 text-white';
      case 'リカバリー':
        return 'bg-emerald-500 text-white';
      default:
        return 'bg-slate-400 text-white';
    }
  };

  const getTSSColor = (tss: number) => {
    if (tss >= 100) return 'text-[#FF33CC]';
    if (tss >= 60) return 'text-[#0066FF]';
    return 'text-[#6666FF]';
  };

  const completionRate = Math.round((weeklySummary.completedSessions / weeklySummary.totalSessions) * 100);
  const tssRate = Math.round((weeklySummary.totalTSS / weeklySummary.plannedTSS) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F5FF] via-[#F5F9FF] to-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">トレーニング</h1>
            <p className="text-xs text-slate-500 mt-0.5">Week {weeklySummary.weekNumber}</p>
          </div>
          <Dumbbell className="w-8 h-8 text-indigo-500" />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pt-4 space-y-3">
        {/* Section 1: Fitness Chart */}
        <FitnessChartCard
          currentCTL={currentCTL}
          currentATL={currentATL}
          currentTSB={currentTSB}
          ctlDelta={ctlDelta}
          atlDelta={atlDelta}
          tsbDelta={tsbDelta}
          initialPeriod={selectedPeriod}
          onPeriodChange={onPeriodChange}
          onViewDetails={onViewOverview}
        />

        {/* Section 2: This Week's Schedule */}
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-sm text-slate-800">今週の予定</h2>
              </div>
              <button
                onClick={onViewSchedule}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1"
              >
                週間スケジュール
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-2">
            {upcomingSessions.map((session, index) => (
              <div
                key={session.id}
                className={`p-3 rounded-lg border-2 ${
                  index === 0 
                    ? 'border-indigo-300 bg-indigo-50/50' 
                    : 'border-slate-200 bg-white'
                } hover:shadow-md transition-all cursor-pointer`}
                onClick={() => onSessionClick?.(session.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${getTypeColor(session.type)}`}>
                      {session.type}
                    </span>
                    {index === 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded animate-pulse">
                        今日
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{session.date}</span>
                </div>
                
                <h3 className="font-semibold text-sm text-slate-800 mb-1">{session.name}</h3>
                
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  {session.distance && (
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      <span>{session.distance}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{session.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span className={`font-semibold ${getTSSColor(session.tss)}`}>
                      TSS {session.tss}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Recent Sessions */}
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-sm text-slate-800">最近のセッション</h2>
              </div>
              <button
                onClick={onViewAllSessions}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1"
              >
                すべて見る
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-2">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="p-3 rounded-lg border border-slate-200 bg-white hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSessionClick?.(session.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${getTypeColor(session.type)}`}>
                    {session.type}
                  </span>
                  <span className="text-xs text-slate-500">{session.date}</span>
                </div>
                
                <h3 className="font-semibold text-sm text-slate-800 mb-1">{session.name}</h3>
                
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  {session.distance && (
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      <span>{session.distance}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{session.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    <span className={`font-semibold ${getTSSColor(session.tss)}`}>
                      TSS {session.tss}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Training Plan */}
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-sm text-slate-800">トレーニング計画</h2>
              </div>
              <button
                onClick={onViewPlan}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1"
              >
                計画全体
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* Current Phase */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-base text-slate-800">{trainingPhase.name}</h3>
                  <p className="text-xs text-slate-500">
                    Week {trainingPhase.currentWeek} / {trainingPhase.totalWeeks}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">目標レースまで</div>
                  <div className="text-2xl font-bold text-rose-600">{trainingPhase.weeksUntilRace}</div>
                  <div className="text-xs text-slate-500">週間</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${(trainingPhase.currentWeek / trainingPhase.totalWeeks) * 100}%` }}
                />
              </div>
            </div>

            {/* Target Race */}
            <div className="pt-3 border-t border-slate-200">
              <div className="text-xs text-slate-500 mb-1">目標レース</div>
              <div className="font-semibold text-sm text-slate-800">{trainingPhase.targetRace}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
