import React from 'react';
import { ChevronLeft, Calendar, Clock, Activity, Flame, Heart, Zap, TrendingUp, MapPin } from 'lucide-react';

interface SessionDetail {
  id: string;
  type: 'スイム' | 'バイク' | 'ラン' | 'ブリック' | '筋トレ' | 'リカバリー';
  name: string;
  date: string;
  time: string;
  distance: string;
  duration: string;
  pace?: string;
  avgHeartRate?: number;
  maxHeartRate?: number;
  avgPower?: number;
  normalizedPower?: number;
  tss: number;
  intensity: number;
  elevation?: string;
  calories?: number;
  description?: string;
  completed: boolean;
}

interface SessionDetailScreenProps {
  sessionId: string;
  onBack: () => void;
}

export function SessionDetailScreen({ sessionId, onBack }: SessionDetailScreenProps) {
  // Mock data - 実際にはsessionIdを使ってデータを取得
  const session: SessionDetail = {
    id: sessionId,
    type: 'スイム',
    name: '持久力スイムセッション',
    date: '2026年1月9日（木）',
    time: '17:30',
    distance: '3.2km',
    duration: '1:24:32',
    pace: '2:38/100m',
    avgHeartRate: 142,
    maxHeartRate: 165,
    tss: 68,
    intensity: 0.75,
    calories: 580,
    description: 'ウォームアップ400m、メインセット2000m（200m x 10、レスト15秒）、クー��ダウン800m',
    completed: true
  };

  const getTypeColor = (type: SessionDetail['type']) => {
    switch (type) {
      case 'スイム':
        return 'from-[#0066FF] to-[#0052CC]';
      case 'バイク':
        return 'from-[#000099] to-[#000066]';
      case 'ラン':
        return 'from-[#FF33CC] to-[#CC0099]';
      case 'ブリック':
        return 'from-[#0066FF] to-[#FF33CC]';
      case '筋トレ':
        return 'from-slate-600 to-slate-700';
      case 'リカバリー':
        return 'from-emerald-500 to-emerald-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getIntensityInfo = (intensity: number) => {
    if (intensity >= 0.9) return { label: '最大強度', color: 'text-[#FF33CC]' };
    if (intensity >= 0.75) return { label: '高強度', color: 'text-[#0066FF]' };
    if (intensity >= 0.6) return { label: '中強度', color: 'text-[#6666FF]' };
    return { label: '低強度', color: 'text-[#CCCCCC]' };
  };

  const intensityInfo = getIntensityInfo(session.intensity);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 pb-20">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getTypeColor(session.type)} text-white`}>
        <div className="px-4 py-4">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-all mb-3"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="inline-block px-2.5 py-1 bg-white/20 rounded-lg text-xs font-bold mb-2">
                {session.type}
              </div>
              <h1 className="text-xl font-bold mb-1">{session.name}</h1>
              <div className="flex items-center gap-3 text-sm opacity-90">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{session.date}</span>
                </div>
                <span>{session.time}</span>
              </div>
            </div>
            {session.completed && (
              <div className="px-3 py-1.5 bg-white/20 rounded-lg">
                <span className="text-sm font-bold">✓ 完了</span>
              </div>
            )}
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center">
              <Activity className="w-5 h-5 mx-auto mb-1 opacity-80" />
              <div className="text-xs opacity-75 mb-0.5">距離</div>
              <div className="text-lg font-bold">{session.distance}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 opacity-80" />
              <div className="text-xs opacity-75 mb-0.5">時間</div>
              <div className="text-lg font-bold">{session.duration}</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 text-center">
              <Flame className="w-5 h-5 mx-auto mb-1 opacity-80" />
              <div className="text-xs opacity-75 mb-0.5">TSS</div>
              <div className="text-lg font-bold">{session.tss}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4 space-y-3">
        {/* Performance Metrics */}
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 border-b border-slate-200">
            <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              パフォーマンス指標
            </h2>
          </div>

          <div className="p-4 space-y-3">
            {/* Pace */}
            {session.pace && (
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-slate-600">平均ペース</span>
                </div>
                <span className="text-base font-bold text-slate-800">{session.pace}</span>
              </div>
            )}

            {/* Heart Rate */}
            {session.avgHeartRate && (
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-rose-600" />
                  </div>
                  <span className="text-sm text-slate-600">心拍数</span>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-slate-800">
                    平均 {session.avgHeartRate} bpm
                  </div>
                  {session.maxHeartRate && (
                    <div className="text-xs text-slate-500">
                      最大 {session.maxHeartRate} bpm
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Power (for bike) */}
            {session.avgPower && (
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm text-slate-600">パワー</span>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-slate-800">
                    平均 {session.avgPower}W
                  </div>
                  {session.normalizedPower && (
                    <div className="text-xs text-slate-500">
                      NP {session.normalizedPower}W
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Intensity */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-sm text-slate-600">強度</span>
              </div>
              <div className="text-right">
                <div className={`text-base font-bold ${intensityInfo.color}`}>
                  {intensityInfo.label}
                </div>
                <div className="text-xs text-slate-500">
                  IF {session.intensity.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Calories */}
            {session.calories && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                    <Flame className="w-4 h-4 text-rose-600" />
                  </div>
                  <span className="text-sm text-slate-600">消費カロリー</span>
                </div>
                <span className="text-base font-bold text-slate-800">{session.calories} kcal</span>
              </div>
            )}
          </div>
        </div>

        {/* Workout Description */}
        {session.description && (
          <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 border-b border-slate-200">
              <h2 className="font-bold text-sm text-slate-800">ワークアウト内容</h2>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-700 leading-relaxed">{session.description}</p>
            </div>
          </div>
        )}

        {/* Training Load */}
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 border-b border-slate-200">
            <h2 className="font-bold text-sm text-slate-800">トレーニング負荷</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600">TSS (Training Stress Score)</span>
              <span className="text-sm font-bold text-slate-800">{session.tss}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className={`bg-gradient-to-r ${getTypeColor(session.type)} h-3 rounded-full transition-all`}
                style={{ width: `${Math.min((session.tss / 150) * 100, 100)}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {session.tss < 50 && '軽い負荷のセッション'}
              {session.tss >= 50 && session.tss < 100 && '中程度の負荷のセッション'}
              {session.tss >= 100 && session.tss < 150 && '高負荷のセッション'}
              {session.tss >= 150 && '非常に高負荷のセッション'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}