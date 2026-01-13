import React from 'react';
import { TrendingUp, ChevronRight, Calendar, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { PeriodPreset, PeriodSelection, getPeriodLabel, getWeeksFromPreset, getPeriodType } from './types';

interface FitnessDataPoint {
  date: string;
  fullDate: Date;
  ctl: number;
  atl: number;
  tsb: number;
  isPrediction?: boolean;
}

interface FitnessChartCardProps {
  currentCTL: number;
  currentATL: number;
  currentTSB: number;
  ctlDelta: number;
  atlDelta: number;
  tsbDelta: number;
  raceDate?: string; // Aレースの日付 (YYYY-MM-DD形式)
  initialPeriod?: PeriodSelection;
  onPeriodChange?: (period: PeriodSelection) => void;
  onViewDetails?: () => void;
}

export function FitnessChartCard({
  currentCTL,
  currentATL,
  currentTSB,
  ctlDelta,
  atlDelta,
  tsbDelta,
  raceDate = '2026-01-18',
  initialPeriod,
  onPeriodChange,
  onViewDetails
}: FitnessChartCardProps) {
  const [selectedPeriod, setSelectedPeriod] = React.useState<PeriodPreset>(
    initialPeriod?.preset || '2weeks'
  );
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [customEndDate, setCustomEndDate] = React.useState(
    initialPeriod?.customEndDate || ''
  );
  const [customStartDate, setCustomStartDate] = React.useState('');
  const [customFullEndDate, setCustomFullEndDate] = React.useState('');

  const today = new Date('2026-01-10');
  const raceDay = new Date(raceDate);

  // 期間オプション（グループ化）
  const periodOptions = [
    { value: '1week', label: '過去1週間' },
    { value: '1week_custom', label: '過去1週間＋カスタム日まで' },
    { value: '1week_race', label: '過去1週間＋Aレースまで' },
    { value: '2weeks', label: '過去2週間' },
    { value: '2weeks_custom', label: '過去2週間＋カスタム日まで' },
    { value: '2weeks_race', label: '過去2週間＋Aレースまで' },
    { value: '4weeks', label: '過去4週間' },
    { value: '4weeks_custom', label: '過去4週間＋カスタム日まで' },
    { value: '4weeks_race', label: '過去4週間＋Aレースまで' },
    { value: '9weeks', label: '過去9週間' },
    { value: '9weeks_custom', label: '過去9週間＋カスタム日まで' },
    { value: '9weeks_race', label: '過去9週間＋Aレースまで' },
    { value: '12weeks', label: '過去12週間' },
    { value: '12weeks_custom', label: '過去12週間＋カスタム日まで' },
    { value: '12weeks_race', label: '過去12週間＋Aレースまで' },
    { value: '24weeks', label: '過去24週間' },
    { value: '24weeks_custom', label: '過去24週間＋カスタム日まで' },
    { value: '24weeks_race', label: '過去24週間＋Aレースまで' },
    { value: '52weeks', label: '過去52週間' },
    { value: '52weeks_custom', label: '過去52週間＋カスタム日まで' },
    { value: '52weeks_race', label: '過去52週間＋Aレースまで' },
    { value: 'custom', label: 'カスタム期間' },
  ];

  // 期間が変更されたら親に通知
  React.useEffect(() => {
    if (onPeriodChange) {
      onPeriodChange({
        preset: selectedPeriod,
        customEndDate: getPeriodType(selectedPeriod) === 'past_custom' ? customEndDate : undefined
      });
    }
  }, [selectedPeriod, customEndDate, onPeriodChange]);

  // 全データを生成する関数（過去52週間からAレースまで）
  const generateFullData = (): FitnessDataPoint[] => {
    const data: FitnessDataPoint[] = [];
    const fiftyTwoWeeksAgo = new Date(today);
    fiftyTwoWeeksAgo.setDate(fiftyTwoWeeksAgo.getDate() - (52 * 7));

    // 過去52週間のデータを生成
    let currentDate = new Date(fiftyTwoWeeksAgo);
    let ctl = 55; // 52週間前の初期値
    let atl = 45;
    let tsb = 10;

    while (currentDate <= raceDay) {
      const isToday = currentDate.toDateString() === today.toDateString();
      const isPrediction = currentDate > today;

      if (isToday) {
        ctl = currentCTL;
        atl = currentATL;
        tsb = currentTSB;
      } else if (!isPrediction) {
        // 過去データのシミュレーション（徐々に上昇）
        const daysSinceStart = Math.floor((currentDate.getTime() - fiftyTwoWeeksAgo.getTime()) / (1000 * 60 * 60 * 24));
        ctl = 55 + daysSinceStart * 0.088 + Math.sin(daysSinceStart / 7) * 3;
        atl = 45 + daysSinceStart * 0.047 + Math.sin(daysSinceStart / 3) * 5;
        tsb = ctl - atl;
      } else {
        // 予測データ（テーパーを考慮）
        const daysToRace = Math.floor((raceDay.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysToRace <= 14) {
          // テーパー期間
          ctl = ctl * 0.98;
          atl = atl * 0.85;
          tsb = ctl - atl;
        } else {
          // 通常のビルド期
          ctl = ctl + 0.5;
          atl = atl + 0.3;
          tsb = ctl - atl;
        }
      }

      data.push({
        date: formatDate(currentDate),
        fullDate: new Date(currentDate),
        ctl: Math.round(ctl),
        atl: Math.round(atl),
        tsb: Math.round(tsb),
        isPrediction
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  };

  const formatDate = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  const fullData = generateFullData();

  // 期間に応じてデータをフィルタリング
  const getFilteredData = (): FitnessDataPoint[] => {
    const periodType = getPeriodType(selectedPeriod);
    let startDate: Date;
    let endDate: Date;

    if (periodType === 'custom') {
      // 完全カスタム期間
      if (customStartDate && customFullEndDate) {
        startDate = new Date(customStartDate);
        endDate = new Date(customFullEndDate);
      } else {
        // デフォルトは過去2週間
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 14);
        endDate = new Date(today);
      }
    } else {
      // 週数ベースの期間
      const weeks = getWeeksFromPreset(selectedPeriod);
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - (weeks * 7));

      if (periodType === 'past_only') {
        // 過去のみ
        endDate = new Date(today);
      } else if (periodType === 'past_race') {
        // Aレースまで
        endDate = raceDay;
      } else if (periodType === 'past_custom') {
        // カスタム日まで
        if (customEndDate) {
          endDate = new Date(customEndDate);
        } else {
          endDate = new Date(today);
        }
      } else {
        endDate = new Date(today);
      }
    }

    return fullData.filter(d => 
      d.fullDate >= startDate && d.fullDate <= endDate
    );
  };

  const filteredData = getFilteredData();

  // データポイントが多い場合は間引く
  const getDisplayData = (): FitnessDataPoint[] => {
    if (filteredData.length <= 90) return filteredData;
    
    // データポイントが多い場合、一定間隔で間引く
    const interval = Math.ceil(filteredData.length / 90);
    return filteredData.filter((_, index) => index % interval === 0);
  };

  const displayData = getDisplayData();

  const getDeltaColor = (delta: number) => {
    if (delta > 0) return 'text-green-600';
    if (delta < 0) return 'text-rose-600';
    return 'text-slate-600';
  };

  const getDeltaSymbol = (delta: number) => {
    if (delta > 0) return '+';
    if (delta < 0) return '';
    return '';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border-2 border-slate-200 rounded-lg shadow-lg p-3">
          <p className="text-xs font-semibold text-slate-800 mb-2">
            {data.date}
            {data.isPrediction && <span className="ml-1 text-indigo-600">(予測)</span>}
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-indigo-600">フィットネス:</span>
              <span className="font-bold text-slate-800">{data.ctl}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-rose-600">疲労:</span>
              <span className="font-bold text-slate-800">{data.atl}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-green-600">コンディション:</span>
              <span className="font-bold text-slate-800">{data.tsb}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // 今日とレース日のマーカーを表示するかチェック
  const todayMarker = displayData.find(d => d.fullDate.toDateString() === today.toDateString());
  const raceMarker = displayData.find(d => d.fullDate.toDateString() === raceDay.toDateString());

  const periodType = getPeriodType(selectedPeriod);
  const showCustomEndDateInput = periodType === 'past_custom';
  const showFullCustomInputs = periodType === 'custom';

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-sm text-slate-800">フィットネス指標の推移</h2>
          </div>
          <button
            onClick={onViewDetails}
            className="text-xs text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-1"
          >
            詳細
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Period Selector */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{getPeriodLabel(selectedPeriod)}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-slate-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
              {periodOptions.map((option, index) => {
                // グループの区切り線を追加
                const isGroupStart = index > 0 && index % 3 === 0;
                return (
                  <div key={option.value}>
                    {isGroupStart && <div className="border-t border-slate-200 my-1"></div>}
                    <button
                      onClick={() => {
                        setSelectedPeriod(option.value as PeriodPreset);
                        setShowDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 transition-all ${
                        selectedPeriod === option.value ? 'bg-indigo-100 font-semibold text-indigo-700' : 'text-slate-700'
                      } ${option.value.includes('_') ? 'pl-5' : ''}`}
                    >
                      {option.label}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Custom End Date Input (for past_custom type) */}
        {showCustomEndDateInput && (
          <div className="mt-2">
            <label className="text-[10px] text-slate-600 mb-1 block">終了日を指定</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              min={today.toISOString().split('T')[0]}
              max={raceDate}
              className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Full Custom Date Range Inputs (for custom type) */}
        {showFullCustomInputs && (
          <div className="mt-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-600 mb-1 block">開始日</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  max={today.toISOString().split('T')[0]}
                  min={new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).toISOString().split('T')[0]}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-600 mb-1 block">終了日</label>
                <input
                  type="date"
                  value={customFullEndDate}
                  onChange={(e) => setCustomFullEndDate(e.target.value)}
                  min={customStartDate || today.toISOString().split('T')[0]}
                  max={raceDate}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Current Values */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-lg p-3 border border-[#0066FF] flex items-center justify-center">
            <div className="w-full">
              <div className="text-[10px] text-slate-500 font-semibold mb-2 text-center">フィットネス</div>
              <div className="flex items-end justify-center gap-3 mb-1">
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-[#0066FF] tabular-nums leading-none mb-1">{currentCTL}</div>
                  <div className="text-[9px] text-slate-400 tracking-wide">CTL</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`text-base font-semibold tabular-nums leading-none mb-1 ${ctlDelta >= 0 ? 'text-[#0066FF]' : 'text-slate-400'}`}>
                    {getDeltaSymbol(ctlDelta)}{ctlDelta}
                  </div>
                  <div className="text-[8px] text-slate-400 tracking-wide whitespace-nowrap">前日比</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-[#FF33CC] flex items-center justify-center">
            <div className="w-full">
              <div className="text-[10px] text-slate-500 font-semibold mb-2 text-center">疲労</div>
              <div className="flex items-end justify-center gap-3 mb-1">
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-[#FF33CC] tabular-nums leading-none mb-1">{currentATL}</div>
                  <div className="text-[9px] text-slate-400 tracking-wide">ATL</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`text-base font-semibold tabular-nums leading-none mb-1 ${atlDelta < 0 ? 'text-[#FF33CC]' : 'text-slate-400'}`}>
                    {getDeltaSymbol(atlDelta)}{atlDelta}
                  </div>
                  <div className="text-[8px] text-slate-400 tracking-wide whitespace-nowrap">前日比</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border-2 border-[#6666FF] flex items-center justify-center">
            <div className="w-full">
              <div className="text-[10px] text-[#6666FF] font-semibold mb-2 text-center">コンディション</div>
              <div className="flex items-end justify-center gap-3 mb-1">
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-[#6666FF] tabular-nums leading-none mb-1">{currentTSB}</div>
                  <div className="text-[9px] text-[#6666FF] tracking-wide">TSB</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-base font-semibold tabular-nums leading-none mb-1 text-[#6666FF]">
                    {getDeltaSymbol(tsbDelta)}{tsbDelta}
                  </div>
                  <div className="text-[8px] text-[#6666FF] tracking-wide whitespace-nowrap">前日比</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-48 -mx-2">
          <ResponsiveContainer width="100%" height={192}>
            <LineChart data={displayData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                interval={Math.ceil(displayData.length / 8)}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* 今日の線 */}
              {todayMarker && (
                <ReferenceLine 
                  x={todayMarker.date}
                  stroke="#6366f1" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ value: '今日', position: 'top', fontSize: 10, fill: '#6366f1', fontWeight: 'bold' }}
                />
              )}
              
              {/* レース当日の線 */}
              {raceMarker && (
                <ReferenceLine 
                  x={raceMarker.date}
                  stroke="#f43f5e" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{ value: 'レース', position: 'top', fontSize: 10, fill: '#f43f5e', fontWeight: 'bold' }}
                />
              )}
              
              {/* CTL (体力) - 青 */}
              <Line 
                type="monotone" 
                dataKey="ctl" 
                stroke="#0066FF" 
                strokeWidth={2.5}
                dot={false}
                strokeDasharray={(entry: any) => entry.isPrediction ? "5 5" : "0"}
                name="体力 (CTL)"
                isAnimationActive={false}
                connectNulls
              />
              
              {/* ATL (疲労) - ピンク */}
              <Line 
                type="monotone" 
                dataKey="atl" 
                stroke="#FF33CC" 
                strokeWidth={2.5}
                dot={false}
                strokeDasharray={(entry: any) => entry.isPrediction ? "5 5" : "0"}
                name="疲労 (ATL)"
                isAnimationActive={false}
                connectNulls
              />
              
              {/* TSB (コンディション) - ライトブルー */}
              <Line 
                type="monotone" 
                dataKey="tsb" 
                stroke="#6666FF" 
                strokeWidth={2.5}
                dot={false}
                strokeDasharray={(entry: any) => entry.isPrediction ? "5 5" : "0"}
                name="コンディション (TSB)"
                isAnimationActive={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-[#0066FF]"></div>
            <span className="text-xs text-slate-600">フィットネス</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-[#FF33CC]"></div>
            <span className="text-xs text-slate-600">疲労</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-[#6666FF]"></div>
            <span className="text-xs text-slate-600">コンディション</span>
          </div>
        </div>

        {/* Prediction Note */}
        {filteredData.some(d => d.isPrediction) && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <div className="w-4 h-0.5 border-t border-dashed border-slate-400"></div>
            <span>破線は計画に基づく予測値</span>
          </div>
        )}
      </div>
    </div>
  );
}