import React from 'react';
import { ChevronLeft, Target, TrendingUp, Calendar, Trophy, Flame } from 'lucide-react';

interface PhaseWeek {
  weekNumber: number;
  startDate: string;
  endDate: string;
  plannedTSS: number;
  focus: string;
  isCurrentWeek: boolean;
}

interface TrainingPhase {
  id: string;
  name: string;
  description: string;
  startWeek: number;
  endWeek: number;
  totalWeeks: number;
  goal: string;
  weeks: PhaseWeek[];
}

interface TrainingPlanScreenProps {
  onBack: () => void;
}

export function TrainingPlanScreen({ onBack }: TrainingPlanScreenProps) {
  // Mock data
  const targetRace = {
    name: 'オリンピックディスタンス・トライアスロン',
    date: '2026年1月18日（日）',
    weeksUntilRace: 1
  };

  const phases: TrainingPhase[] = [
    {
      id: '1',
      name: 'ベース期',
      description: '有酸素能力の向上と基礎体力の構築',
      startWeek: 1,
      endWeek: 8,
      totalWeeks: 8,
      goal: '週間TSS 400-500を維持し、持久力を向上させる',
      weeks: [
        { weekNumber: 1, startDate: '12/23', endDate: '12/29', plannedTSS: 350, focus: '有酸素ベース', isCurrentWeek: false },
        { weekNumber: 2, startDate: '12/30', endDate: '1/5', plannedTSS: 400, focus: '持久力強化', isCurrentWeek: false },
        { weekNumber: 3, startDate: '1/6', endDate: '1/12', plannedTSS: 450, focus: 'テンポトレーニング', isCurrentWeek: true },
        { weekNumber: 4, startDate: '1/13', endDate: '1/19', plannedTSS: 300, focus: 'リカバリー週', isCurrentWeek: false },
        { weekNumber: 5, startDate: '1/20', endDate: '1/26', plannedTSS: 480, focus: 'ロングセッション', isCurrentWeek: false },
        { weekNumber: 6, startDate: '1/27', endDate: '2/2', plannedTSS: 500, focus: 'ピークボリューム', isCurrentWeek: false },
        { weekNumber: 7, startDate: '2/3', endDate: '2/9', plannedTSS: 420, focus: 'テンポ＋持久力', isCurrentWeek: false },
        { weekNumber: 8, startDate: '2/10', endDate: '2/16', plannedTSS: 350, focus: 'リカバリー週', isCurrentWeek: false }
      ]
    },
    {
      id: '2',
      name: 'ビルド期',
      description: '強度を上げて、レースペースでのトレーニング',
      startWeek: 9,
      endWeek: 12,
      totalWeeks: 4,
      goal: 'レースペースでの持久力を向上させ、週間TSS 450-550',
      weeks: [
        { weekNumber: 9, startDate: '2/17', endDate: '2/23', plannedTSS: 480, focus: 'レースペース導入', isCurrentWeek: false },
        { weekNumber: 10, startDate: '2/24', endDate: '3/2', plannedTSS: 520, focus: 'インターバル強化', isCurrentWeek: false },
        { weekNumber: 11, startDate: '3/3', endDate: '3/9', plannedTSS: 550, focus: 'ピーク週', isCurrentWeek: false },
        { weekNumber: 12, startDate: '3/10', endDate: '3/16', plannedTSS: 380, focus: 'リカバリー週', isCurrentWeek: false }
      ]
    },
    {
      id: '3',
      name: 'テーパー期',
      description: 'レースに向けて疲労を抜き、体調を整える',
      startWeek: 13,
      endWeek: 14,
      totalWeeks: 2,
      goal: 'レースに向けて十分に回復し、最高の状態で臨む',
      weeks: [
        { weekNumber: 13, startDate: '3/17', endDate: '3/23', plannedTSS: 280, focus: 'テーパー開始', isCurrentWeek: false },
        { weekNumber: 14, startDate: '3/24', endDate: '3/30', plannedTSS: 150, focus: 'ファイナルテーパー', isCurrentWeek: false }
      ]
    }
  ];

  const currentPhase = phases.find(phase => 
    phase.weeks.some(week => week.isCurrentWeek)
  ) || phases[0];

  const maxTSS = Math.max(...phases.flatMap(p => p.weeks.map(w => w.plannedTSS)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-all mb-3"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-lg font-bold text-slate-800">トレーニング計画</h1>
              <p className="text-xs text-slate-500">14週間プログラム</p>
            </div>
            <Target className="w-6 h-6 text-indigo-500" />
          </div>

          {/* Target Race */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-3 border border-rose-200">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-semibold text-rose-600">目標レース</span>
            </div>
            <h3 className="font-bold text-sm text-slate-800 mb-1">{targetRace.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">{targetRace.date}</span>
              <span className="text-sm font-bold text-rose-600">
                あと {targetRace.weeksUntilRace} 週間
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4 space-y-3">
        {/* Current Phase Highlight */}
        <div className="bg-white rounded-xl border-2 border-indigo-300 shadow-md">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-3 rounded-t-xl">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold">現在のフェーズ</span>
            </div>
            <h2 className="text-lg font-bold mb-1">{currentPhase.name}</h2>
            <p className="text-sm opacity-90">{currentPhase.description}</p>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600">進捗</span>
              <span className="text-xs font-semibold text-slate-800">
                Week {currentPhase.weeks.find(w => w.isCurrentWeek)?.weekNumber || currentPhase.startWeek} / Week {currentPhase.endWeek}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full transition-all"
                style={{ 
                  width: `${((currentPhase.weeks.find(w => w.isCurrentWeek)?.weekNumber || currentPhase.startWeek) / currentPhase.endWeek) * 100}%` 
                }}
              />
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200">
              <div className="text-xs text-slate-600 mb-1">目標</div>
              <p className="text-sm text-slate-800">{currentPhase.goal}</p>
            </div>
          </div>
        </div>

        {/* All Phases */}
        {phases.map((phase) => (
          <div
            key={phase.id}
            className={`bg-white rounded-xl border-2 shadow-sm ${
              phase.id === currentPhase.id ? 'border-indigo-200' : 'border-slate-200'
            }`}
          >
            <div className={`px-4 py-3 border-b ${
              phase.id === currentPhase.id 
                ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-sm text-slate-800">{phase.name}</h3>
                <span className="text-xs text-slate-500">
                  Week {phase.startWeek}-{phase.endWeek}
                </span>
              </div>
              <p className="text-xs text-slate-600">{phase.description}</p>
            </div>

            <div className="p-3 space-y-1.5">
              {phase.weeks.map((week) => (
                <div
                  key={week.weekNumber}
                  className={`p-2.5 rounded-lg border transition-all ${
                    week.isCurrentWeek
                      ? 'border-indigo-300 bg-indigo-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold ${
                        week.isCurrentWeek
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        W{week.weekNumber}
                      </div>
                      <span className="text-xs text-slate-600">
                        {week.startDate} - {week.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-slate-400" />
                      <span className="text-sm font-bold text-slate-800">{week.plannedTSS}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">{week.focus}</span>
                    <div className="w-20">
                      <div className="w-full bg-slate-200 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full ${
                            week.plannedTSS >= 500 ? 'bg-[#FF33CC]' :
                            week.plannedTSS >= 400 ? 'bg-[#FF33CC]' :
                            week.plannedTSS >= 300 ? 'bg-[#0066FF]' :
                            'bg-[#6666FF]'
                          }`}
                          style={{ width: `${(week.plannedTSS / maxTSS) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-4">
          <h3 className="font-bold text-sm text-slate-800 mb-3">TSS負荷レベル</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-green-500 rounded"></div>
              <span className="text-slate-600">低負荷（&lt; 300）- リカバリー週</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-yellow-500 rounded"></div>
              <span className="text-slate-600">中負荷（300-400）- ベーストレーニング</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-orange-500 rounded"></div>
              <span className="text-slate-600">高負荷（400-500）- 強化週</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-rose-500 rounded"></div>
              <span className="text-slate-600">最高負荷（&gt; 500）- ピーク週</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}