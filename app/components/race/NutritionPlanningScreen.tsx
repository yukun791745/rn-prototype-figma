import React from 'react';
import { ChevronLeft, ChevronRight, Droplets, Zap, AlertCircle, CheckCircle, AlertTriangle, MessageSquare, Info, X } from 'lucide-react';

interface NutritionPlanningScreenProps {
  onBack: () => void;
  onNext?: () => void;
  goalData?: {
    scenario: string;
    totalTime: string;
    swim: { time: string };
    bike: { time: string; if: number };
    run: { time: string; degradation: number };
  };
}

interface NutritionPhase {
  id: string;
  name: string;
  duration: string;
  carbsGrams: number;
  type: string;
  notes?: string;
}

interface RiskAssessment {
  type: 'carbs' | 'hydration' | 'overload';
  level: 'safe' | 'warning' | 'danger';
  message: string;
}

interface InfoModalContent {
  title: string;
  content: string;
}

export function NutritionPlanningScreen({ 
  onBack, 
  onNext,
  goalData = {
    scenario: '現実的なベスト',
    totalTime: '10:45:00',
    swim: { time: '1:05:00' },
    bike: { time: '5:35:00', if: 0.72 },
    run: { time: '4:00:00', degradation: 22 },
  }
}: NutritionPlanningScreenProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [infoModal, setInfoModal] = React.useState<InfoModalContent | null>(null);

  // User settings (from profile/settings)
  const userSettings = {
    weight: 68, // kg
    leanMass: 58, // kg
    carbsTolerancePerHour: 90, // g/h - from training tests
  };

  // Energy calculation
  const energyData = {
    total: 8450,
    swim: 850,
    bike: 4200,
    run: 3400,
  };

  // Glycogen storage
  const glycogenData = {
    muscle: 1400, // kcal
    liver: 600, // kcal
    total: 2000, // kcal
  };

  // Carbs requirements
  const carbsData = {
    bodyStorage: 2000, // kcal from glycogen
    deficit: 6450,
    carbsNeeded: 1612, // grams
    ratePerHour: 85, // g/h during race
  };

  // Hydration
  const hydrationData = {
    sweatRate: 850, // ml/h
    sodiumConcentration: 1200, // mg/L
    recommendedWater: 750, // ml/h
    recommendedSodium: 900, // mg/h
  };

  // Nutrition timeline
  const phases: NutritionPhase[] = [
    { id: 'pre-race-day', name: '前日', duration: '終日', carbsGrams: 400, type: '固形食', notes: 'カーボローディング' },
    { id: 'morning', name: '当日朝', duration: '3時間前', carbsGrams: 150, type: '固形食', notes: '消化時間考慮' },
    { id: 't1', name: 'T1', duration: '0:03:00', carbsGrams: 0, type: '-', notes: 'トランジション' },
    { id: 'bike-early', name: 'バイク前半', duration: '2:45:00', carbsGrams: 240, type: 'ドリンク+ジェル', notes: '90g/h' },
    { id: 'bike-late', name: 'バイク後半', duration: '2:50:00', carbsGrams: 250, type: 'ドリンク+ジェル', notes: '88g/h' },
    { id: 't2', name: 'T2', duration: '0:02:00', carbsGrams: 0, type: '-', notes: 'トランジション' },
    { id: 'run-early', name: 'ラン前半', duration: '2:00:00', carbsGrams: 140, type: 'ジェル+水', notes: '70g/h' },
    { id: 'run-late', name: 'ラン後半', duration: '2:00:00', carbsGrams: 120, type: 'ジェル+水', notes: '60g/h' },
  ];

  // Risk assessment
  const risks: RiskAssessment[] = [
    {
      type: 'carbs',
      level: 'safe',
      message: '糖質摂取量は適正範囲内です。レース後半まで安定したエネルギー供給が期待できます。'
    },
    {
      type: 'hydration',
      level: 'warning',
      message: '気温28℃・湿度75%の条件では、発汗量が増加します。バイク前半の水分摂取を意識的に増やしてください。'
    },
    {
      type: 'overload',
      level: 'safe',
      message: '胃腸への負担は許容範囲内です。ただし、レース中は体調に応じて調整してください。'
    },
  ];

  const showInfoModal = (title: string, content: string) => {
    setInfoModal({ title, content });
  };

  const closeInfoModal = () => {
    setInfoModal(null);
  };

  const getRiskIcon = (level: 'safe' | 'warning' | 'danger') => {
    switch (level) {
      case 'safe':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
    }
  };

  const getRiskColor = (level: 'safe' | 'warning' | 'danger') => {
    switch (level) {
      case 'safe':
        return 'bg-emerald-50 border-emerald-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'danger':
        return 'bg-rose-50 border-rose-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Header - Fixed */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white px-4 py-3.5 sticky top-0 z-50 shadow-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold">補給設計</h1>
            <p className="text-xs opacity-90">Nutrition & Hydration Planning</p>
          </div>
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 pb-24">
        {/* AI Coach Introduction */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 shadow-sm p-4">
          <div className="flex gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-800 leading-relaxed">
                設定したレース戦略を成立させるための補給計画を設計します。消費エネルギーと運動強度から、必要な糖質・水分・電解質を算出し、タイムラインで可視化します。
              </p>
            </div>
          </div>
        </div>

        {/* 0. Strategy Summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-2.5 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-800">0️⃣ レース戦略（前提条件）</h3>
            <p className="text-xs text-slate-600 mt-0.5">この補給設計は、以下の戦略を前提にしています</p>
          </div>
          
          <div className="p-4">
            <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">採用シナリオ</span>
                <span className="text-sm font-bold text-indigo-700">{goalData.scenario}</span>
              </div>
              <div className="text-lg font-bold text-slate-900 text-center">{goalData.totalTime}</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#0066FF]/5 rounded-lg p-2 border border-[#0066FF]/20">
                <div className="text-[10px] text-slate-600 mb-1">🏊‍♂️ スイム</div>
                <div className="text-xs font-bold text-slate-900">{goalData.swim.time}</div>
              </div>
              <div className="bg-[#000099]/5 rounded-lg p-2 border border-[#000099]/20">
                <div className="text-[10px] text-slate-600 mb-1">🚴‍♂️ バイク</div>
                <div className="text-xs font-bold text-slate-900">{goalData.bike.time}</div>
                <div className="text-[10px] text-slate-600">IF {goalData.bike.if.toFixed(2)}</div>
              </div>
              <div className="bg-[#FF33CC]/5 rounded-lg p-2 border border-[#FF33CC]/20">
                <div className="text-[10px] text-slate-600 mb-1">🏃‍♂️ ラン</div>
                <div className="text-xs font-bold text-slate-900">{goalData.run.time}</div>
                <div className="text-[10px] text-slate-600">劣化{goalData.run.degradation}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Energy & Carbs Requirements */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-2.5 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-800">1️⃣ 消費エネルギーと必要糖質量</h3>
            <p className="text-xs text-slate-600 mt-0.5">運動強度と所要時間から算出</p>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Total Energy */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                総消費エネルギー
                <button
                  onClick={() => showInfoModal(
                    '総消費エネルギーの算出方法',
                    '各種目の運動強度（%VO2max / IF など）と時間から、代謝当量（METs）または仕事量ベースで推定しています。気温・風・路面条件などの外的要因も補正に使用しています。スイムは水温と泳速度、バイクはパワーと速度、ランはペースと勾配から精密に計算されます。'
                  )}
                  className="p-0.5 hover:bg-slate-200 rounded-full transition-all"
                >
                  <Info className="w-3.5 h-3.5 text-indigo-600" />
                </button>
              </h4>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-3">
                <div className="text-center mb-2">
                  <div className="text-2xl font-bold text-slate-900">{energyData.total.toLocaleString()}</div>
                  <div className="text-xs text-slate-600">kcal</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xs text-slate-600">スイム</div>
                    <div className="text-sm font-bold text-slate-800">{energyData.swim}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600">バイク</div>
                    <div className="text-sm font-bold text-slate-800">{energyData.bike}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600">ラン</div>
                    <div className="text-sm font-bold text-slate-800">{energyData.run}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Glycogen Storage */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                体内糖原利用可能量
                <button
                  onClick={() => showInfoModal(
                    '体内糖原利用可能量',
                    '体内に貯蔵できる糖質エネルギーは個人差があります。体重、除脂肪量、過去の持久競技経験、カーボローディングの有無などから推定しています。これは「補給せずに使える上限」を示します。筋グリコーゲンは主に運動中のエネルギー源、肝グリコーゲンは血糖値維持に使用されます。'
                  )}
                  className="p-0.5 hover:bg-slate-200 rounded-full transition-all"
                >
                  <Info className="w-3.5 h-3.5 text-indigo-600" />
                </button>
              </h4>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-600">総利用可能量</span>
                  <span className="text-lg font-bold text-slate-900">{glycogenData.total.toLocaleString()} kcal</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg border border-indigo-200 p-2">
                    <div className="text-[10px] text-slate-600 mb-0.5">筋グリコーゲン</div>
                    <div className="text-xs font-bold text-indigo-700">{glycogenData.muscle} kcal</div>
                  </div>
                  <div className="bg-white rounded-lg border border-indigo-200 p-2">
                    <div className="text-[10px] text-slate-600 mb-0.5">肝グリコーゲン</div>
                    <div className="text-xs font-bold text-indigo-700">{glycogenData.liver} kcal</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carbs Requirements */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                推奨糖質摂取量
                <button
                  onClick={() => showInfoModal(
                    '推奨糖質摂取量の算出',
                    '総消費エネルギーのうち、運動強度に基づく糖質／脂質の燃焼比率を推定し、糖質由来エネルギーのうち、体内貯蔵で賄えない分を「補給必要量」としています。糖質1g = 約4kcal として重量換算しています。レース中の糖質酸化率は個人のフィットネスレベルと運動強度により変動します。'
                  )}
                  className="p-0.5 hover:bg-slate-200 rounded-full transition-all"
                >
                  <Info className="w-3.5 h-3.5 text-indigo-600" />
                </button>
              </h4>
              <div className="space-y-2">
                <div className="bg-rose-50 rounded-lg border border-rose-200 p-2.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-800">エネルギー不足分</span>
                  <span className="text-sm font-bold text-rose-900">{carbsData.deficit.toLocaleString()} kcal</span>
                </div>
                <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-emerald-800">推奨糖質摂取量</span>
                    <span className="text-lg font-bold text-emerald-900">{carbsData.carbsNeeded}g</span>
                  </div>
                  <div className="text-xs text-emerald-700 text-right">レース中 約{carbsData.ratePerHour}g/h</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Nutrition Timeline */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-sm text-slate-800">2️⃣ 補給タイムライン</h3>
              <p className="text-xs text-slate-600 mt-0.5">フェーズ別の補給計画</p>
            </div>
            <button
              onClick={() => showInfoModal(
                '補給タイムラインの設計方針',
                '各フェーズの補給量は、種目ごとの消費エネルギー配分、消化吸収可能速度（g/h）、胃腸負担リスクを考慮して時間配分しています。特にバイクでは吸収可能量を最大化し、ランでは消化負担を抑える設計としています。前日と当日朝の摂取で体内グリコーゲンを最大化することで、レース中の補給負担を軽減します。'
              )}
              className="p-0.5 hover:bg-slate-200 rounded-full transition-all flex-shrink-0"
            >
              <Info className="w-3.5 h-3.5 text-indigo-600" />
            </button>
          </div>
          
          <div className="p-4">
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto -mx-4 px-4"
              style={{ scrollbarWidth: 'thin' }}
            >
              <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
                {phases.map((phase, index) => (
                  <div 
                    key={phase.id}
                    className={`flex-shrink-0 w-36 rounded-xl border-2 overflow-hidden ${
                      phase.carbsGrams > 0 ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className={`px-3 py-2 border-b ${
                      phase.carbsGrams > 0 ? 'bg-indigo-100 border-indigo-200' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <div className="text-xs font-bold text-slate-800">{phase.name}</div>
                      <div className="text-[10px] text-slate-600">{phase.duration}</div>
                    </div>
                    
                    <div className="p-3 space-y-2">
                      {phase.carbsGrams > 0 ? (
                        <>
                          <div className="bg-white rounded-lg border border-indigo-200 p-2">
                            <div className="text-[10px] text-slate-600 mb-0.5">糖質</div>
                            <div className="text-lg font-bold text-indigo-700">{phase.carbsGrams}g</div>
                          </div>
                          <div className="bg-white rounded-lg border border-slate-200 p-2">
                            <div className="text-[10px] text-slate-600 mb-0.5">形態</div>
                            <div className="text-xs font-semibold text-slate-800">{phase.type}</div>
                          </div>
                          {phase.notes && (
                            <div className="text-[10px] text-slate-600 italic">{phase.notes}</div>
                          )}
                        </>
                      ) : (
                        <div className="text-xs text-slate-500 text-center py-2">
                          補給なし
                        </div>
                      )}
                    </div>
                    
                    {index < phases.length - 1 && (
                      <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                        <ChevronRight className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-3 bg-blue-50 rounded-lg border border-blue-200 p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  タイムラインは左右にスクロールできます。次のステップで、各フェーズの補給プロダクト（ジェル・ドリンク等）を具体化します。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Hydration & Electrolytes */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-sm text-slate-800">3️⃣ 水分・電解質設計</h3>
              <p className="text-xs text-slate-600 mt-0.5">発汗テストと環境条件に基づく</p>
            </div>
            <button
              onClick={() => showInfoModal(
                '水分・電解質の算出方法',
                '水分量は、発汗量と気温・湿度から推定しています。電解質（Na）は、発汗中のナトリウム濃度に基づいて算出しています。発汗量は個人差が大きいため、事前の発汗テスト（体重測定による確認）が推奨されます。ナトリウム濃度も個人差があり、発汗テストキットで測定できます。推奨水分量は発汗量の80-90%を目安にし、完全に補わないことで胃腸負担を軽減します。'
              )}
              className="p-0.5 hover:bg-slate-200 rounded-full transition-all flex-shrink-0"
            >
              <Info className="w-3.5 h-3.5 text-indigo-600" />
            </button>
          </div>
          
          <div className="p-4 space-y-3">
            {/* Sweat Rate */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-cyan-600" />
                <h4 className="text-xs font-bold text-slate-800">発汗データ</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg border border-cyan-200 p-2">
                  <div className="text-[10px] text-slate-600 mb-0.5">発汗量</div>
                  <div className="text-sm font-bold text-cyan-700">{hydrationData.sweatRate} ml/h</div>
                </div>
                <div className="bg-white rounded-lg border border-cyan-200 p-2">
                  <div className="text-[10px] text-slate-600 mb-0.5">Na濃度</div>
                  <div className="text-sm font-bold text-cyan-700">{hydrationData.sodiumConcentration} mg/L</div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2">推奨摂取量</h4>
              <div className="space-y-2">
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-blue-800">水分</span>
                    <span className="text-lg font-bold text-blue-900">{hydrationData.recommendedWater} ml/h</span>
                  </div>
                  <div className="text-[10px] text-blue-700">発汗量の約88%を補給</div>
                </div>
                <div className="bg-purple-50 rounded-lg border border-purple-200 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-purple-800">ナトリウム</span>
                    <span className="text-lg font-bold text-purple-900">{hydrationData.recommendedSodium} mg/h</span>
                  </div>
                  <div className="text-[10px] text-purple-700">電解質バランス維持</div>
                </div>
              </div>
            </div>

            {/* AI Coach Note */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-3">
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-amber-900 leading-relaxed">
                    この気温条件（28℃・湿度75%）では、脱水リスクが高まります。バイク前半の水分摂取を意識的に増やし、15〜20分ごとに少量ずつ摂取してください。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Risk Assessment */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-2.5 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-800">4️⃣ 妥当性チェック</h3>
            <p className="text-xs text-slate-600 mt-0.5">補給計画のリスク評価</p>
          </div>
          
          <div className="p-4 space-y-3">
            {risks.map((risk, index) => (
              <div 
                key={index}
                className={`rounded-lg border-2 p-3 ${getRiskColor(risk.level)}`}
              >
                <div className="flex items-start gap-2">
                  {getRiskIcon(risk.level)}
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="text-xs font-bold text-slate-800">
                        {risk.type === 'carbs' && '糖質摂取'}
                        {risk.type === 'hydration' && '水分・電解質'}
                        {risk.type === 'overload' && '胃腸負担'}
                      </div>
                      {risk.type === 'overload' && (
                        <button
                          onClick={() => showInfoModal(
                            '胃腸負担の評価方法',
                            '胃腸耐性は個人差が大きいため、日常トレーニングでテストした「許容量上限」を参照しています。この評価は、設定された上限（g/h）を基準にしています。将来的には、糖質の種類（例：グルコース／フルクトース）別の評価にも対応可能です。トレーニング中に90g/hを問題なく摂取できた場合、レースでもその範囲内であれば安全と判断します。'
                          )}
                          className="p-0.5 hover:bg-slate-200 rounded-full transition-all"
                        >
                          <Info className="w-3 h-3 text-slate-600" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{risk.message}</p>
                    {risk.type === 'overload' && (
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white rounded-lg border border-slate-200 p-2">
                            <div className="text-[10px] text-slate-600 mb-0.5">現在の設計</div>
                            <div className="text-sm font-bold text-slate-900">{carbsData.ratePerHour} g/h</div>
                          </div>
                          <div className="bg-white rounded-lg border border-emerald-200 p-2">
                            <div className="text-[10px] text-slate-600 mb-0.5">許容量上限</div>
                            <div className="text-sm font-bold text-emerald-700">{userSettings.carbsTolerancePerHour} g/h</div>
                          </div>
                        </div>
                        <div className="mt-1.5 text-[10px] text-slate-600 italic">
                          トレーニングテスト結果より（個人設定）
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 mt-4">
              <div className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-800">総合評価：</strong>
                この補給計画は、設定したレース戦略を実現するために適切に設計されています。レース当日は、体調とコンディションに応じて柔軟に調整してください。
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg z-40">
        <div className="space-y-2">
          {onNext && (
            <button
              onClick={onNext}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
            >
              次へ：補給の具体化（プロダクト設計）
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onBack}
            className="w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            戦略（目標タイム）に戻る
          </button>
        </div>
        <p className="text-xs text-center text-slate-500 mt-2">
          次のステップでは、ジェルやドリンクの個数・持参計画を設計できます
        </p>
      </div>

      {/* Info Modal */}
      {infoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-5 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-800">{infoModal.title}</h3>
              <button
                onClick={closeInfoModal}
                className="p-1 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{infoModal.content}</p>
            <button
              onClick={closeInfoModal}
              className="w-full mt-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-xs hover:bg-indigo-700 transition-all"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}