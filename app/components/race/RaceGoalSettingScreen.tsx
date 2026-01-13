import React from 'react';
import { ChevronLeft, MessageSquare, CheckCircle, Target, Zap, List, Sparkles, Edit3, RotateCcw } from 'lucide-react';

interface RaceGoalSettingScreenProps {
  onBack: () => void;
  onProceedToNutrition?: () => void;
  selectedGoal?: string | null;
  previousMetrics?: PerformanceMetrics;
  previousConditions?: RaceConditions;
}

export interface PerformanceMetrics {
  css: string;
  vo2max: number;
  ltPace: number;
  ltHR: number;
  ftp: number;
  marathonPB: string;
}

interface GeneralConditions {
  temperature: number;
  humidity: number;
  wind: 'light' | 'moderate' | 'strong';
  t1Time: string;
  t2Time: string;
}

export interface RaceConditions {
  general: GeneralConditions;
  swim: {
    wetsuit: boolean;
    seaCondition: 'calm' | 'normal' | 'rough';
    current: 'none' | 'with' | 'against';
  };
  bike: {
    elevation: number;
    roadCondition: 'good' | 'normal' | 'rough';
  };
  run: {
    elevation: number;
  };
}

interface ScenarioDetail {
  name: string;
  label: string;
  totalTime: string;
  swim: { time: string; pace: string };
  t1: string;
  bike: { time: string; avgSpeed: string; if: number };
  t2: string;
  run: { time: string; pace: string; degradation: number };
}

interface CustomGoal {
  totalTime: string;
  swim: { time: string; pace: string };
  t1: string;
  bike: { time: string; avgSpeed: string; if: number };
  t2: string;
  run: { time: string; pace: string; degradation: number };
}

export function RaceGoalSettingScreen({ 
  onBack, 
  onProceedToNutrition,
  selectedGoal: initialSelectedGoal,
  previousMetrics,
  previousConditions,
}: RaceGoalSettingScreenProps) {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>(previousMetrics || {
    css: '1:23',
    vo2max: 58.5,
    ltPace: 4.15,
    ltHR: 165,
    ftp: 285,
    marathonPB: '3:15:00',
  });

  const [conditions, setConditions] = React.useState<RaceConditions>(previousConditions || {
    general: {
      temperature: 28,
      humidity: 75,
      wind: 'moderate',
      t1Time: '0:03:00',
      t2Time: '0:02:00',
    },
    swim: {
      wetsuit: true,
      seaCondition: 'normal',
      current: 'none',
    },
    bike: {
      elevation: 850,
      roadCondition: 'normal',
    },
    run: {
      elevation: 120,
    },
  });

  const [showPrediction, setShowPrediction] = React.useState(!!previousMetrics);
  const [selectedGoal, setSelectedGoal] = React.useState<string | null>(initialSelectedGoal || null);
  const [showCustomForm, setShowCustomForm] = React.useState(false);
  const [customGoal, setCustomGoal] = React.useState<CustomGoal>({
    totalTime: '10:00:00',
    swim: { time: '1:05:00', pace: '1:42' },
    t1: '0:03:00',
    bike: { time: '5:30:00', avgSpeed: '32.7', if: 0.75 },
    t2: '0:02:00',
    run: { time: '3:20:00', pace: '4:43', degradation: 20 },
  });
  const [finalGoal, setFinalGoal] = React.useState<ScenarioDetail | CustomGoal | null>(null);

  const scenarios: ScenarioDetail[] = [
    {
      name: 'conservative',
      label: '安全に完走',
      totalTime: '11:10:00',
      swim: { time: '1:08:00', pace: '1:47' },
      t1: '0:03:00',
      bike: { time: '5:45:00', avgSpeed: '31.3', if: 0.68 },
      t2: '0:02:00',
      run: { time: '4:12:00', pace: '5:58', degradation: 28 },
    },
    {
      name: 'base',
      label: '現実的なベスト',
      totalTime: '10:45:00',
      swim: { time: '1:05:00', pace: '1:42' },
      t1: '0:03:00',
      bike: { time: '5:35:00', avgSpeed: '32.2', if: 0.72 },
      t2: '0:02:00',
      run: { time: '4:00:00', pace: '5:40', degradation: 22 },
    },
    {
      name: 'aggressive',
      label: '攻めた戦略',
      totalTime: '10:20:00',
      swim: { time: '1:02:00', pace: '1:37' },
      t1: '0:02:30',
      bike: { time: '5:20:00', avgSpeed: '33.8', if: 0.78 },
      t2: '0:01:30',
      run: { time: '3:54:00', pace: '5:32', degradation: 18 },
    },
  ];

  const handlePredict = () => {
    setShowPrediction(true);
    setSelectedGoal(null);
    setFinalGoal(null);
    setShowCustomForm(false);
    
    localStorage.setItem('raceGoalMetrics', JSON.stringify(metrics));
    localStorage.setItem('raceGoalConditions', JSON.stringify(conditions));
    
    setTimeout(() => {
      document.getElementById('prediction-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSelectGoal = (goal: string) => {
    setSelectedGoal(goal);
    setShowCustomForm(false);
    
    const selectedScenario = scenarios.find(s => s.name === goal);
    if (selectedScenario) {
      setFinalGoal(selectedScenario);
      localStorage.setItem('raceGoalTime', selectedScenario.totalTime);
      localStorage.setItem('raceGoalScenario', goal);
    }
    
    setTimeout(() => {
      document.getElementById('final-goal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleShowCustomForm = () => {
    setShowCustomForm(true);
    setSelectedGoal('custom');
    
    setTimeout(() => {
      document.getElementById('custom-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSaveCustomGoal = () => {
    setFinalGoal(customGoal);
    localStorage.setItem('raceGoalTime', customGoal.totalTime);
    localStorage.setItem('raceGoalScenario', 'custom');
    
    setTimeout(() => {
      document.getElementById('final-goal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleRePredict = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCommentForGoal = (goal: string) => {
    switch (goal) {
      case 'conservative':
        return '素晴らしい選択です！この目標なら余裕を持って完走できるでしょう。安全マージンがあるので、レース当日のコンディション変化にも柔軟に対応できます。';
      case 'base':
        return '素晴らしい選択です！現実的な到達可能範囲を目標として設定しました。適切なリスク管理と実現可能性のバランスが取れた目標です。';
      case 'aggressive':
        return 'すばらしい！挑戦する姿勢が成長につながります。ただし、レースペース配分には十分注意し、前半の入り方を慎重にしましょう。';
      case 'custom':
        return 'カスタム目標を設定しました。ご自身のペース感覚に基づいた目標で、レースに臨みましょう。';
      default:
        return '';
    }
  };

  const renderScenarioCard = (scenario: ScenarioDetail, isSelected: boolean = false) => (
    <div
      className={`rounded-xl border-2 overflow-hidden transition-all ${
        isSelected ? 'border-indigo-500 shadow-lg' : 'border-slate-200'
      }`}
    >
      <div className={`px-4 py-3 border-b ${
        scenario.name === 'conservative' ? 'bg-emerald-50 border-emerald-200' :
        scenario.name === 'base' ? 'bg-blue-50 border-blue-200' :
        'bg-rose-50 border-rose-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {scenario.name === 'conservative' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
            {scenario.name === 'base' && <Target className="w-5 h-5 text-blue-600" />}
            {scenario.name === 'aggressive' && <Zap className="w-5 h-5 text-rose-600" />}
            <h4 className="font-bold text-sm text-slate-800">{scenario.label}</h4>
          </div>
          <div className="text-xl font-bold text-slate-900">{scenario.totalTime}</div>
        </div>
      </div>
      
      <div className="p-4 space-y-2.5">
        {/* Swim */}
        <div className="bg-[#0066FF]/5 rounded-lg p-2.5 border border-[#0066FF]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">🏊‍♂️ スイム</span>
            <span className="text-sm font-bold text-slate-900">{scenario.swim.time}</span>
          </div>
          <div className="text-xs text-slate-600 mt-0.5">ペース: {scenario.swim.pace}/100m</div>
        </div>

        {/* T1 */}
        <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">T1</span>
            <span className="text-sm font-bold text-slate-800">{scenario.t1}</span>
          </div>
        </div>

        {/* Bike */}
        <div className="bg-[#000099]/5 rounded-lg p-2.5 border border-[#000099]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">🚴‍♂️ バイク</span>
            <span className="text-sm font-bold text-slate-900">{scenario.bike.time}</span>
          </div>
          <div className="text-xs text-slate-600 mt-0.5">{scenario.bike.avgSpeed}km/h · IF {scenario.bike.if.toFixed(2)}</div>
        </div>

        {/* T2 */}
        <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">T2</span>
            <span className="text-sm font-bold text-slate-800">{scenario.t2}</span>
          </div>
        </div>

        {/* Run */}
        <div className="bg-[#FF33CC]/5 rounded-lg p-2.5 border border-[#FF33CC]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">🏃‍♂️ ラン</span>
            <span className="text-sm font-bold text-slate-900">{scenario.run.time}</span>
          </div>
          <div className="text-xs text-slate-600 mt-0.5">{scenario.run.pace}/km · 劣化率{scenario.run.degradation}%</div>
        </div>
      </div>
    </div>
  );

  const renderGoalCard = (goal: ScenarioDetail | CustomGoal, title: string) => (
    <div className="rounded-xl border-2 border-indigo-500 overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 border-b border-indigo-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-white" />
            <h4 className="font-bold text-sm text-white">{title}</h4>
          </div>
          <div className="text-xl font-bold text-white">{goal.totalTime}</div>
        </div>
      </div>
      
      <div className="p-4 space-y-2.5 bg-white">
        {/* Swim */}
        <div className="bg-[#0066FF]/5 rounded-lg p-2.5 border border-[#0066FF]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">🏊‍♂️ スイム</span>
            <span className="text-sm font-bold text-slate-900">{goal.swim.time}</span>
          </div>
          <div className="text-xs text-slate-600 mt-0.5">ペース: {goal.swim.pace}/100m</div>
        </div>

        {/* T1 */}
        <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">T1</span>
            <span className="text-sm font-bold text-slate-800">{goal.t1}</span>
          </div>
        </div>

        {/* Bike */}
        <div className="bg-[#000099]/5 rounded-lg p-2.5 border border-[#000099]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">🚴‍♂️ バイク</span>
            <span className="text-sm font-bold text-slate-900">{goal.bike.time}</span>
          </div>
          <div className="text-xs text-slate-600 mt-0.5">{goal.bike.avgSpeed}km/h · IF {goal.bike.if.toFixed(2)}</div>
        </div>

        {/* T2 */}
        <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">T2</span>
            <span className="text-sm font-bold text-slate-800">{goal.t2}</span>
          </div>
        </div>

        {/* Run */}
        <div className="bg-[#FF33CC]/5 rounded-lg p-2.5 border border-[#FF33CC]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">🏃‍♂️ ラン</span>
            <span className="text-sm font-bold text-slate-900">{goal.run.time}</span>
          </div>
          <div className="text-xs text-slate-600 mt-0.5">{goal.run.pace}/km · 劣化率{goal.run.degradation}%</div>
        </div>
      </div>
    </div>
  );

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
            <h1 className="text-base font-bold">目標タイム設定</h1>
            <p className="text-xs opacity-90">AIコーチによるシナリオ予測</p>
          </div>
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 pb-24">
        {/* Introduction */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 shadow-sm p-4">
          <div className="flex gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-800 leading-relaxed">
                あなたの現在のフィットネスレベルとレース環境条件から、3つのシナリオで到達可能タイムを予測します。
              </p>
            </div>
          </div>
        </div>

        {/* Performance Metrics Section */}
        <div id="conditions-section" className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-2.5 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-800">1️⃣ パフォーマンス指標</h3>
            <p className="text-xs text-slate-600 mt-0.5">現在の設定値を表示しています。上書きして更新できます。</p>
          </div>
          
          <div className="p-3 space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-semibold text-slate-700 mb-1 block">CSS</label>
                <input
                  type="text"
                  value={metrics.css}
                  onChange={(e) => setMetrics({ ...metrics, css: e.target.value })}
                  className="w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                  placeholder="1:23"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">/100m</p>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-700 mb-1 block">VO2max</label>
                <input
                  type="number"
                  step="0.1"
                  value={metrics.vo2max}
                  onChange={(e) => setMetrics({ ...metrics, vo2max: parseFloat(e.target.value) })}
                  className="w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">ml/kg/min</p>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-700 mb-1 block">閾値ペース</label>
                <input
                  type="number"
                  step="0.01"
                  value={metrics.ltPace}
                  onChange={(e) => setMetrics({ ...metrics, ltPace: parseFloat(e.target.value) })}
                  className="w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">/km</p>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-700 mb-1 block">閾値心拍</label>
                <input
                  type="number"
                  value={metrics.ltHR}
                  onChange={(e) => setMetrics({ ...metrics, ltHR: parseInt(e.target.value) })}
                  className="w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">bpm</p>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-700 mb-1 block">FTP</label>
                <input
                  type="number"
                  value={metrics.ftp}
                  onChange={(e) => setMetrics({ ...metrics, ftp: parseInt(e.target.value) })}
                  className="w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">W</p>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-700 mb-1 block">マラソンPB</label>
                <input
                  type="text"
                  value={metrics.marathonPB}
                  onChange={(e) => setMetrics({ ...metrics, marathonPB: e.target.value })}
                  className="w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                  placeholder="3:15:00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Race Conditions Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-2.5 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-800">2️⃣ レース条件</h3>
          </div>
          
          <div className="p-3 space-y-3">
            {/* General Conditions */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2">全体環境</h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 mb-1 block">気温℃</label>
                  <input
                    type="number"
                    value={conditions.general.temperature}
                    onChange={(e) => setConditions(prev => ({ ...prev, general: { ...prev.general, temperature: parseInt(e.target.value) } }))}
                    className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 mb-1 block">湿度%</label>
                  <input
                    type="number"
                    value={conditions.general.humidity}
                    onChange={(e) => setConditions(prev => ({ ...prev, general: { ...prev.general, humidity: parseInt(e.target.value) } }))}
                    className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 mb-1 block">風</label>
                  <select
                    value={conditions.general.wind}
                    onChange={(e) => setConditions(prev => ({ ...prev, general: { ...prev.general, wind: e.target.value as 'light' | 'moderate' | 'strong' } }))}
                    className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="light">弱</option>
                    <option value="moderate">中</option>
                    <option value="strong">強</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Swim Conditions */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2">🏊‍♂️ スイム</h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 mb-1 block">ウェット</label>
                  <select
                    value={conditions.swim.wetsuit ? 'on' : 'off'}
                    onChange={(e) => setConditions(prev => ({ ...prev, swim: { ...prev.swim, wetsuit: e.target.value === 'on' } }))}
                    className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="on">ON</option>
                    <option value="off">OFF</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 mb-1 block">海況</label>
                  <select
                    value={conditions.swim.seaCondition}
                    onChange={(e) => setConditions(prev => ({ ...prev, swim: { ...prev.swim, seaCondition: e.target.value as 'calm' | 'normal' | 'rough' } }))}
                    className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="calm">穏</option>
                    <option value="normal">普通</option>
                    <option value="rough">荒</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 mb-1 block">潮流</label>
                  <select
                    value={conditions.swim.current}
                    onChange={(e) => setConditions(prev => ({ ...prev, swim: { ...prev.swim, current: e.target.value as 'none' | 'with' | 'against' } }))}
                    className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="none">なし</option>
                    <option value="with">追潮</option>
                    <option value="against">逆潮</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bike Conditions */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2">🚴‍♂️ バイク</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 mb-1 block">獲得標高m</label>
                  <input
                    type="number"
                    value={conditions.bike.elevation}
                    onChange={(e) => setConditions(prev => ({ ...prev, bike: { ...prev.bike, elevation: parseInt(e.target.value) } }))}
                    className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 mb-1 block">路面</label>
                  <select
                    value={conditions.bike.roadCondition}
                    onChange={(e) => setConditions(prev => ({ ...prev, bike: { ...prev.bike, roadCondition: e.target.value as 'good' | 'normal' | 'rough' } }))}
                    className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="good">良好</option>
                    <option value="normal">普通</option>
                    <option value="rough">荒</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Run Conditions */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2">🏃‍♂️ ラン</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 mb-1 block">獲得標高m</label>
                  <input
                    type="number"
                    value={conditions.run.elevation}
                    onChange={(e) => setConditions(prev => ({ ...prev, run: { ...prev.run, elevation: parseInt(e.target.value) } }))}
                    className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* T1 & T2 Times */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2">トランジション想定タイム</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 mb-1 block">T1</label>
                  <input
                    type="text"
                    value={conditions.general.t1Time}
                    onChange={(e) => setConditions(prev => ({ ...prev, general: { ...prev.general, t1Time: e.target.value } }))}
                    className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                    placeholder="0:03:00"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 mb-1 block">T2</label>
                  <input
                    type="text"
                    value={conditions.general.t2Time}
                    onChange={(e) => setConditions(prev => ({ ...prev, general: { ...prev.general, t2Time: e.target.value } }))}
                    className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                    placeholder="0:02:00"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Predict Button */}
        <button
          onClick={handlePredict}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          この条件で予測する
        </button>

        {/* Prediction Results */}
        {showPrediction && (
          <div id="prediction-results" className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-2.5 border-b border-indigo-200">
                <h3 className="font-bold text-sm text-slate-800">3️⃣ 予測シナリオ</h3>
              </div>
              
              <div className="p-4 space-y-3">
                {scenarios.map((scenario) => (
                  <div key={scenario.name}>
                    {renderScenarioCard(scenario, selectedGoal === scenario.name)}
                  </div>
                ))}
              </div>
            </div>

            {/* Goal Selection */}
            {!finalGoal && (
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 shadow-sm p-4">
                <div className="flex gap-3 mb-3">
                  <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-800 leading-relaxed font-semibold">
                      どのシナリオを目標にしますか？または、自分で設定しますか？
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleSelectGoal('conservative')}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all ${
                      selectedGoal === 'conservative'
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    安全に完走（11:10:00）を採用する
                  </button>
                  <button
                    onClick={() => handleSelectGoal('base')}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all ${
                      selectedGoal === 'base'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    現実的なベスト（10:45:00）を採用する
                  </button>
                  <button
                    onClick={() => handleSelectGoal('aggressive')}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all ${
                      selectedGoal === 'aggressive'
                        ? 'bg-rose-600 text-white shadow-lg'
                        : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    攻めた戦略（10:20:00）を採用する
                  </button>
                  <button
                    onClick={handleShowCustomForm}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all ${
                      selectedGoal === 'custom'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    自分で目標を設定する
                  </button>
                </div>
              </div>
            )}

            {/* Custom Goal Form */}
            {showCustomForm && !finalGoal && (
              <div id="custom-form" className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-2.5 border-b border-purple-200 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800">カスタム目標を設定</h3>
                  <Edit3 className="w-4 h-4 text-purple-600" />
                </div>
                
                <div className="p-4 space-y-3">
                  {/* Total Time */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">総合タイム</label>
                    <input
                      type="text"
                      value={customGoal.totalTime}
                      onChange={(e) => setCustomGoal({ ...customGoal, totalTime: e.target.value })}
                      className="w-full py-2 px-3 rounded-lg text-sm font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                      placeholder="10:00:00"
                    />
                  </div>

                  {/* Swim */}
                  <div className="bg-[#0066FF]/5 rounded-lg p-3 border border-[#0066FF]/20">
                    <h4 className="text-xs font-bold text-slate-700 mb-2">🏊‍♂️ スイム</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 mb-1 block">タイム</label>
                        <input
                          type="text"
                          value={customGoal.swim.time}
                          onChange={(e) => setCustomGoal({ ...customGoal, swim: { ...customGoal.swim, time: e.target.value } })}
                          className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 mb-1 block">ペース/100m</label>
                        <input
                          type="text"
                          value={customGoal.swim.pace}
                          onChange={(e) => setCustomGoal({ ...customGoal, swim: { ...customGoal.swim, pace: e.target.value } })}
                          className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* T1 */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">T1（トランジション1）</label>
                    <input
                      type="text"
                      value={customGoal.t1}
                      onChange={(e) => setCustomGoal({ ...customGoal, t1: e.target.value })}
                      className="w-full py-2 px-3 rounded-lg text-sm font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Bike */}
                  <div className="bg-[#000099]/5 rounded-lg p-3 border border-[#000099]/20">
                    <h4 className="text-xs font-bold text-slate-700 mb-2">🚴‍♂️ バイク</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 mb-1 block">タイム</label>
                        <input
                          type="text"
                          value={customGoal.bike.time}
                          onChange={(e) => setCustomGoal({ ...customGoal, bike: { ...customGoal.bike, time: e.target.value } })}
                          className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 mb-1 block">平均速度</label>
                        <input
                          type="text"
                          value={customGoal.bike.avgSpeed}
                          onChange={(e) => setCustomGoal({ ...customGoal, bike: { ...customGoal.bike, avgSpeed: e.target.value } })}
                          className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 mb-1 block">IF</label>
                        <input
                          type="number"
                          step="0.01"
                          value={customGoal.bike.if}
                          onChange={(e) => setCustomGoal({ ...customGoal, bike: { ...customGoal.bike, if: parseFloat(e.target.value) } })}
                          className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* T2 */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1.5 block">T2（トランジション2）</label>
                    <input
                      type="text"
                      value={customGoal.t2}
                      onChange={(e) => setCustomGoal({ ...customGoal, t2: e.target.value })}
                      className="w-full py-2 px-3 rounded-lg text-sm font-semibold bg-slate-50 text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Run */}
                  <div className="bg-[#FF33CC]/5 rounded-lg p-3 border border-[#FF33CC]/20">
                    <h4 className="text-xs font-bold text-slate-700 mb-2">🏃‍♂️ ラン</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 mb-1 block">タイム</label>
                        <input
                          type="text"
                          value={customGoal.run.time}
                          onChange={(e) => setCustomGoal({ ...customGoal, run: { ...customGoal.run, time: e.target.value } })}
                          className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 mb-1 block">ペース/km</label>
                        <input
                          type="text"
                          value={customGoal.run.pace}
                          onChange={(e) => setCustomGoal({ ...customGoal, run: { ...customGoal.run, pace: e.target.value } })}
                          className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-600 mb-1 block">劣化率%</label>
                        <input
                          type="number"
                          value={customGoal.run.degradation}
                          onChange={(e) => setCustomGoal({ ...customGoal, run: { ...customGoal.run, degradation: parseInt(e.target.value) } })}
                          className="w-full py-1.5 px-2 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-300 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveCustomGoal}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
                  >
                    この目標を確定する
                  </button>
                </div>
              </div>
            )}

            {/* Final Goal Display */}
            {finalGoal && (
              <div id="final-goal" className="space-y-4">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 shadow-sm p-4">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-800 leading-relaxed">
                        {getCommentForGoal(selectedGoal || 'custom')}
                      </p>
                    </div>
                  </div>
                </div>

                {renderGoalCard(finalGoal, 'あなたの目標')}

                {/* Next Actions */}
                <div className="space-y-2">
                  {onProceedToNutrition && (
                    <button
                      onClick={onProceedToNutrition}
                      className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold text-sm hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg"
                    >
                      補給戦略を立てる
                    </button>
                  )}
                  <button
                    onClick={onBack}
                    className="w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                  >
                    <List className="w-4 h-4" />
                    参加予定レース一覧に戻る
                  </button>
                  <button
                    onClick={handleRePredict}
                    className="w-full py-3 px-4 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    予測をやり直す
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}