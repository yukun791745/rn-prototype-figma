import React from 'react';
import { ChevronLeft, Calendar, Flame, Clock, Activity } from 'lucide-react';

interface DailySession {
  id: string;
  type: 'スイム' | 'バイク' | 'ラン' | 'ブリック' | '筋トレ' | 'リカバリー' | '休息';
  name: string;
  time?: string;
  distance?: string;
  duration: string;
  tss: number;
  completed: boolean;
}

interface DaySchedule {
  date: string;
  dayOfWeek: string;
  isToday: boolean;
  sessions: DailySession[];
}

interface WeeklyScheduleScreenProps {
  onBack: () => void;
  onSessionClick?: (sessionId: string) => void;
}

export function WeeklyScheduleScreen({ onBack, onSessionClick }: WeeklyScheduleScreenProps) {
  // Mock data
  const weekSchedule: DaySchedule[] = [
    {
      date: '1月6日',
      dayOfWeek: '月',
      isToday: false,
      sessions: [
        { id: '1', type: 'スイム', name: 'テクニックドリル', time: '6:00', distance: '2.0km', duration: '50分', tss: 45, completed: true }
      ]
    },
    {
      date: '1月7日',
      dayOfWeek: '火',
      isToday: false,
      sessions: [
        { id: '2', type: 'バイク', name: 'テンポライド', time: '18:00', distance: '45km', duration: '1:30', tss: 78, completed: true }
      ]
    },
    {
      date: '1月8日',
      dayOfWeek: '水',
      isToday: false,
      sessions: [
        { id: '3', type: 'ラン', name: 'イージーラン', time: '6:30', distance: '8km', duration: '48分', tss: 42, completed: true }
      ]
    },
    {
      date: '1月9日',
      dayOfWeek: '木',
      isToday: false,
      sessions: [
        { id: '4', type: 'スイム', name: '持久力スイムセッション', time: '17:30', distance: '3.2km', duration: '1:24', tss: 68, completed: true }
      ]
    },
    {
      date: '1月10日',
      dayOfWeek: '金',
      isToday: true,
      sessions: [
        { id: '5', type: 'ラン', name: 'テンポラン', time: '18:00', distance: '10km', duration: '50分', tss: 65, completed: false }
      ]
    },
    {
      date: '1月11日',
      dayOfWeek: '土',
      isToday: false,
      sessions: [
        { id: '6', type: 'スイム', name: 'インターバル', time: '6:00', distance: '2.5km', duration: '60分', tss: 58, completed: false }
      ]
    },
    {
      date: '1月12日',
      dayOfWeek: '日',
      isToday: false,
      sessions: [
        { id: '7', type: 'バイク', name: 'ロングライド', time: '9:00', distance: '80km', duration: '3:00', tss: 142, completed: false },
        { id: '8', type: 'ラン', name: 'ブリックラン', time: '12:15', distance: '5km', duration: '25分', tss: 35, completed: false }
      ]
    }
  ];

  const getTypeColor = (type: DailySession['type']) => {
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
      case '休息':
        return 'bg-slate-300 text-slate-600';
      default:
        return 'bg-slate-400 text-white';
    }
  };

  const getTSSColor = (tss: number) => {
    if (tss >= 100) return 'text-[#FF33CC]';
    if (tss >= 60) return 'text-[#0066FF]';
    return 'text-[#6666FF]';
  };

  const totalWeekTSS = weekSchedule.reduce((total, day) => 
    total + day.sessions.reduce((dayTotal, session) => dayTotal + session.tss, 0), 0
  );

  const completedTSS = weekSchedule.reduce((total, day) => 
    total + day.sessions.filter(s => s.completed).reduce((dayTotal, session) => dayTotal + session.tss, 0), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F5FF] via-[#F5F9FF] to-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-slate-800">週間スケジュール</h1>
              <p className="text-xs text-slate-500">Week 3 - 1月6日〜1月12日</p>
            </div>
            <Calendar className="w-6 h-6 text-indigo-500" />
          </div>

          {/* Week Summary */}
          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-2.5">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-indigo-600" />
              <span className="text-xs text-slate-600">週間TSS</span>
            </div>
            <div className="text-sm font-bold text-slate-800">
              {completedTSS} / {totalWeekTSS}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="px-4 pt-4 space-y-2">
        {weekSchedule.map((day) => (
          <div
            key={day.date}
            className={`bg-white rounded-xl border-2 ${
              day.isToday ? 'border-indigo-300' : 'border-slate-200'
            } shadow-sm overflow-hidden`}
          >
            {/* Day Header */}
            <div className={`px-4 py-2 border-b ${
              day.isToday 
                ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    day.isToday ? 'bg-indigo-500 text-white' : 'bg-white border border-slate-200 text-slate-700'
                  }`}>
                    <span className="font-bold text-sm">{day.dayOfWeek}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{day.date}</div>
                    {day.isToday && (
                      <div className="text-xs font-bold text-indigo-600">今日</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">TSS</div>
                  <div className={`text-sm font-bold ${getTSSColor(
                    day.sessions.reduce((total, s) => total + s.tss, 0)
                  )}`}>
                    {day.sessions.reduce((total, s) => total + s.tss, 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Sessions */}
            <div className="p-3 space-y-2">
              {day.sessions.length === 0 ? (
                <div className="text-center py-3 text-xs text-slate-400">
                  休息日
                </div>
              ) : (
                day.sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                      session.completed
                        ? 'border-green-200 bg-green-50/50'
                        : 'border-slate-200 bg-white hover:shadow-md'
                    }`}
                    onClick={() => onSessionClick?.(session.id)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${getTypeColor(session.type)}`}>
                          {session.type}
                        </span>
                        {session.completed && (
                          <span className="text-xs text-green-600 font-semibold">✓ 完了</span>
                        )}
                      </div>
                      {session.time && (
                        <span className="text-xs text-slate-500">{session.time}</span>
                      )}
                    </div>

                    <h4 className="font-semibold text-sm text-slate-800 mb-1">{session.name}</h4>

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
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}