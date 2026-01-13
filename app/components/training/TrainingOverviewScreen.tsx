import React from 'react';
import { ChevronLeft, TrendingUp, Clock, Activity, Calendar, ChevronDown, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { PeriodPreset, PeriodSelection, getPeriodLabel, getWeeksFromPreset, getPeriodType } from './types';

interface TrainingOverviewScreenProps {
  onBack: () => void;
  initialPeriod?: PeriodSelection;
  raceDate?: string;
}

interface WeekData {
  week: string;
  swim: number;
  bike: number;
  run: number;
  other: number;
  total: number;
  // Zone distribution (percentages)
  z1Percent: number;
  z2Percent: number;
  z3Percent: number;
  z4Percent: number;
  z5Percent: number;
  // TSS by discipline
  swimTSS: number;
  bikeTSS: number;
  runTSS: number;
  otherTSS: number;
  totalTSS: number;
}

export function TrainingOverviewScreen({ 
  onBack, 
  initialPeriod,
  raceDate = '2026-01-18'
}: TrainingOverviewScreenProps) {
  const [selectedPeriod, setSelectedPeriod] = React.useState<PeriodPreset>(
    initialPeriod?.preset || '4weeks'
  );
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [customEndDate, setCustomEndDate] = React.useState(
    initialPeriod?.customEndDate || ''
  );
  const [customStartDate, setCustomStartDate] = React.useState('');
  const [customFullEndDate, setCustomFullEndDate] = React.useState('');
  const [selectedWeekData, setSelectedWeekData] = React.useState<WeekData | null>(null);

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

  // 週ごとのデータを生成
  const generateWeeklyData = (): WeekData[] => {
    const periodType = getPeriodType(selectedPeriod);
    let startDate: Date;
    let endDate: Date;

    if (periodType === 'custom') {
      if (customStartDate && customFullEndDate) {
        startDate = new Date(customStartDate);
        endDate = new Date(customFullEndDate);
      } else {
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 28);
        endDate = new Date(today);
      }
    } else {
      const weeks = getWeeksFromPreset(selectedPeriod);
      startDate = new Date(today);
      startDate.setDate(startDate.getDate() - (weeks * 7));

      if (periodType === 'past_only') {
        endDate = new Date(today);
      } else if (periodType === 'past_race') {
        endDate = raceDay;
      } else if (periodType === 'past_custom') {
        if (customEndDate) {
          endDate = new Date(customEndDate);
        } else {
          endDate = new Date(today);
        }
      } else {
        endDate = new Date(today);
      }
    }

    const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // 期間が2週間以内の場合は日単位、それ以上は週単位
    const isDailyView = days <= 14;
    const numPeriods = isDailyView ? Math.min(days, 14) : Math.min(Math.ceil(days / 7), 12);

    const weekData: WeekData[] = [];
    
    for (let i = 0; i < numPeriods; i++) {
      let periodStart: Date;
      let periodLabel: string;
      
      if (isDailyView) {
        // 日単位
        periodStart = new Date(startDate);
        periodStart.setDate(periodStart.getDate() + i);
        periodLabel = `${periodStart.getMonth() + 1}/${periodStart.getDate()}`;
      } else {
        // 週単位
        periodStart = new Date(startDate);
        periodStart.setDate(periodStart.getDate() + (i * 7));
        periodLabel = `${periodStart.getMonth() + 1}/${periodStart.getDate()}`;
      }
      
      // 基本データ（日単位か週単位かで調整）
      const multiplier = isDailyView ? 1 : 7;
      const baseSwim = (1.2 + (Math.sin(i) * 0.3)) * multiplier;
      const baseBike = (0.3 + (Math.cos(i) * 0.2)) * multiplier;
      const baseRun = (0.45 + (Math.sin(i + 1) * 0.25)) * multiplier;
      const baseOther = (0.1 + (Math.random() * 0.07)) * multiplier;
      
      const swim = parseFloat(baseSwim.toFixed(1));
      const bike = parseFloat(baseBike.toFixed(1));
      const run = parseFloat(baseRun.toFixed(1));
      const other = parseFloat(baseOther.toFixed(1));
      const total = parseFloat((swim + bike + run + other).toFixed(1));
      
      // Zone分布（週ごとに変動）
      const z1Base = 55 + (Math.random() * 10);
      const z2Base = 15 + (Math.random() * 10);
      const z3Base = 20 + (Math.random() * 15);
      const z4Base = Math.max(0, 10 - z2Base + z3Base - 25);
      const z5Base = Math.max(0, 100 - z1Base - z2Base - z3Base - z4Base);
      
      const z1Percent = Math.round(z1Base);
      const z2Percent = Math.round(z2Base);
      const z3Percent = Math.round(z3Base);
      const z4Percent = Math.round(z4Base);
      const z5Percent = Math.max(0, 100 - z1Percent - z2Percent - z3Percent - z4Percent);
      
      // TSS計算（種目別に異なる係数）
      const swimTSS = Math.round(swim * 50);
      const bikeTSS = Math.round(bike * 120);
      const runTSS = Math.round(run * 95);
      const otherTSS = Math.round(other * 40);
      const totalTSS = swimTSS + bikeTSS + runTSS + otherTSS;
      
      weekData.push({
        week: periodLabel,
        swim,
        bike,
        run,
        other,
        total,
        z1Percent,
        z2Percent,
        z3Percent,
        z4Percent,
        z5Percent,
        swimTSS,
        bikeTSS,
        runTSS,
        otherTSS,
        totalTSS
      });
    }
    
    return weekData;
  };

  const weeklyData = generateWeeklyData();

  // 期間統計の計算
  const calculatePeriodStats = () => {
    const totalHours = {
      swim: weeklyData.reduce((sum, w) => sum + w.swim, 0),
      bike: weeklyData.reduce((sum, w) => sum + w.bike, 0),
      run: weeklyData.reduce((sum, w) => sum + w.run, 0),
      other: weeklyData.reduce((sum, w) => sum + w.other, 0),
    };
    
    const totalTSS = {
      swim: weeklyData.reduce((sum, w) => sum + w.swimTSS, 0),
      bike: weeklyData.reduce((sum, w) => sum + w.bikeTSS, 0),
      run: weeklyData.reduce((sum, w) => sum + w.runTSS, 0),
      other: weeklyData.reduce((sum, w) => sum + w.otherTSS, 0),
    };
    
    const grandTotalHours = totalHours.swim + totalHours.bike + totalHours.run + totalHours.other;
    const grandTotalTSS = totalTSS.swim + totalTSS.bike + totalTSS.run + totalTSS.other;
    
    const numWeeks = weeklyData.length;
    
    const avgWeeklyHours = {
      swim: totalHours.swim / numWeeks,
      bike: totalHours.bike / numWeeks,
      run: totalHours.run / numWeeks,
      other: totalHours.other / numWeeks,
      total: grandTotalHours / numWeeks,
    };
    
    const avgWeeklyTSS = {
      swim: totalTSS.swim / numWeeks,
      bike: totalTSS.bike / numWeeks,
      run: totalTSS.run / numWeeks,
      other: totalTSS.other / numWeeks,
      total: grandTotalTSS / numWeeks,
    };
    
    // 期間平均のZONE分布率
    const avgZoneDistribution = {
      z1: Math.round(weeklyData.reduce((sum, w) => sum + w.z1Percent, 0) / numWeeks),
      z2: Math.round(weeklyData.reduce((sum, w) => sum + w.z2Percent, 0) / numWeeks),
      z3: Math.round(weeklyData.reduce((sum, w) => sum + w.z3Percent, 0) / numWeeks),
      z4: Math.round(weeklyData.reduce((sum, w) => sum + w.z4Percent, 0) / numWeeks),
      z5: Math.round(weeklyData.reduce((sum, w) => sum + w.z5Percent, 0) / numWeeks),
    };
    
    return {
      totalHours,
      totalTSS,
      grandTotalHours,
      grandTotalTSS,
      avgWeeklyHours,
      avgWeeklyTSS,
      avgZoneDistribution,
      numWeeks
    };
  };

  const stats = calculatePeriodStats();

  // 種目の色定義
  const disciplineColors = {
    swim: '#0066FF',    // ブルー
    bike: '#000099',    // ネイビー（ダークブルー）
    run: '#FF33CC',     // ピンク
    other: '#999999'    // グレー
  };

  // 心拍ゾーンのカラー定義
  const zoneColors = {
    z1: '#CCCCCC',      // ライトグレー
    z2: '#6666FF',      // ライトブルー
    z3: '#0066FF',      // ブルー
    z4: '#000099',      // ダークブルー
    z5: '#FF33CC'       // ピンク
  };

  // カスタムラベル（積み上げバーの各セグメント内に値を表示）
  const renderCustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    
    // 値が小さすぎる場合は表示しない
    if (height < 20 || value === 0) return null;
    
    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={11}
        fontWeight="600"
      >
        {value.toFixed(1)}
      </text>
    );
  };

  const renderCustomLabelTSS = (props: any) => {
    const { x, y, width, height, value } = props;
    
    if (height < 20 || value === 0) return null;
    
    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={11}
        fontWeight="600"
      >
        {value}
      </text>
    );
  };

  const renderCustomLabelPercent = (props: any) => {
    const { x, y, width, height, value } = props;
    
    if (height < 25 || value === 0) return null;
    
    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={11}
        fontWeight="600"
      >
        {value}%
      </text>
    );
  };

  const periodType = getPeriodType(selectedPeriod);
  const showCustomEndDateInput = periodType === 'past_custom';
  const showFullCustomInputs = periodType === 'custom';

  return (
    <div className="min-h-screen bg-white pb-20">
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
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h1 className="text-lg font-bold text-slate-800">トレーニングサマリー</h1>
            </div>
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
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-slate-200 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
                {periodOptions.map((option, index) => {
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

          {/* Custom End Date Input */}
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

          {/* Full Custom Date Range Inputs */}
          {showFullCustomInputs && (
            <div className="mt-2">
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
      </div>

      {/* Content */}
      <div className="px-4 pt-4 space-y-4">
        {/* 種目別トレーニング時間 */}
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 border-b border-slate-200">
            <h2 className="font-bold text-sm text-slate-800">種目別トレーニング時間</h2>
          </div>

          <div className="p-4 space-y-3">
            {/* グラフ */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height={256}>
                <BarChart data={weeklyData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    label={{ value: '時間 (h)', angle: -90, position: 'insideLeft', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ fontSize: 12 }}
                    formatter={(value: any) => `${value.toFixed(1)}h`}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: 11 }}
                    formatter={(value) => {
                      const labels: any = { swim: 'スイム', bike: 'バイク', run: 'ラン', other: 'その他' };
                      return labels[value] || value;
                    }}
                  />
                  <Bar dataKey="swim" stackId="a" fill={disciplineColors.swim} onClick={(data) => setSelectedWeekData(data as WeekData)} cursor="pointer" />
                  <Bar dataKey="bike" stackId="a" fill={disciplineColors.bike} onClick={(data) => setSelectedWeekData(data as WeekData)} cursor="pointer" />
                  <Bar dataKey="run" stackId="a" fill={disciplineColors.run} onClick={(data) => setSelectedWeekData(data as WeekData)} cursor="pointer" />
                  <Bar dataKey="other" stackId="a" fill={disciplineColors.other} onClick={(data) => setSelectedWeekData(data as WeekData)} cursor="pointer" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 統計情報（表形式） */}
            <div className="pt-3 border-t border-slate-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 text-slate-600 font-semibold"></th>
                    <th className="text-right py-2 text-slate-600 font-semibold">期間合計</th>
                    <th className="text-right py-2 text-slate-600 font-semibold">週平均</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: disciplineColors.swim }}></div>
                        <span className="text-slate-700">スイム</span>
                      </div>
                    </td>
                    <td className="text-right py-2 font-bold text-slate-800">{stats.totalHours.swim.toFixed(1)}h</td>
                    <td className="text-right py-2 font-bold text-slate-800">{stats.avgWeeklyHours.swim.toFixed(1)}h</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: disciplineColors.bike }}></div>
                        <span className="text-slate-700">バイク</span>
                      </div>
                    </td>
                    <td className="text-right py-2 font-bold text-slate-800">{stats.totalHours.bike.toFixed(1)}h</td>
                    <td className="text-right py-2 font-bold text-slate-800">{stats.avgWeeklyHours.bike.toFixed(1)}h</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: disciplineColors.run }}></div>
                        <span className="text-slate-700">ラン</span>
                      </div>
                    </td>
                    <td className="text-right py-2 font-bold text-slate-800">{stats.totalHours.run.toFixed(1)}h</td>
                    <td className="text-right py-2 font-bold text-slate-800">{stats.avgWeeklyHours.run.toFixed(1)}h</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: disciplineColors.other }}></div>
                        <span className="text-slate-700">その他</span>
                      </div>
                    </td>
                    <td className="text-right py-2 font-bold text-slate-800">{stats.totalHours.other.toFixed(1)}h</td>
                    <td className="text-right py-2 font-bold text-slate-800">{stats.avgWeeklyHours.other.toFixed(1)}h</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 心拍Zone別トレーニング時間 */}
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 border-b border-slate-200">
            <h2 className="font-bold text-sm text-slate-800">心拍Zone別トレーニング時間</h2>
          </div>

          <div className="p-4 space-y-3">
            {/* グラフ */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    label={{ value: '%', angle: -90, position: 'insideLeft', fontSize: 10 }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ fontSize: 12 }}
                    formatter={(value: any) => `${value}%`}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: 11 }}
                  />
                  <Bar dataKey="z1Percent" stackId="a" fill={zoneColors.z1} name="Z1" />
                  <Bar dataKey="z2Percent" stackId="a" fill={zoneColors.z2} name="Z2" />
                  <Bar dataKey="z3Percent" stackId="a" fill={zoneColors.z3} name="Z3" />
                  <Bar dataKey="z4Percent" stackId="a" fill={zoneColors.z4} name="Z4" />
                  <Bar dataKey="z5Percent" stackId="a" fill={zoneColors.z5} name="Z5" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 期間平均のZONE分布率 */}
            <div className="pt-3 border-t border-slate-200">
              <div className="text-xs text-slate-600 mb-2 font-semibold">期間平均のZONE分布率</div>
              <div className="space-y-2">
                {[
                  { zone: 'Z1', percent: stats.avgZoneDistribution.z1, color: zoneColors.z1 },
                  { zone: 'Z2', percent: stats.avgZoneDistribution.z2, color: zoneColors.z2 },
                  { zone: 'Z3', percent: stats.avgZoneDistribution.z3, color: zoneColors.z3 },
                  { zone: 'Z4', percent: stats.avgZoneDistribution.z4, color: zoneColors.z4 },
                  { zone: 'Z5', percent: stats.avgZoneDistribution.z5, color: zoneColors.z5 },
                ].map((item) => (
                  <div key={item.zone} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: item.color }}></div>
                        <span className="font-semibold text-slate-700">{item.zone}</span>
                      </div>
                      <span className="font-bold text-slate-800">{item.percent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full transition-all"
                        style={{ 
                          width: `${item.percent}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 種目別トレーニング負荷（TSS） */}
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-3 border-b border-slate-200">
            <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              種目別トレーニング負荷
              <span className="text-xs text-slate-500 font-normal">（※推定値）</span>
            </h2>
          </div>

          <div className="p-4 space-y-3">
            {/* グラフ */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                    label={{ value: 'TSS', angle: -90, position: 'insideLeft', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: 11 }}
                    formatter={(value) => {
                      const labels: any = { swimTSS: 'スイム', bikeTSS: 'バイク', runTSS: 'ラン', otherTSS: 'その他' };
                      return labels[value] || value;
                    }}
                  />
                  <Bar dataKey="swimTSS" stackId="a" fill={disciplineColors.swim} />
                  <Bar dataKey="bikeTSS" stackId="a" fill={disciplineColors.bike} />
                  <Bar dataKey="runTSS" stackId="a" fill={disciplineColors.run} />
                  <Bar dataKey="otherTSS" stackId="a" fill={disciplineColors.other} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 統計情報 */}
            <div className="pt-3 border-t border-slate-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 text-slate-600 font-semibold"></th>
                    <th className="text-right py-2 text-slate-600 font-semibold">期間合計</th>
                    <th className="text-right py-2 text-slate-600 font-semibold">週平均</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: disciplineColors.swim }}></div>
                        <span className="text-slate-700">スイム</span>
                      </div>
                    </td>
                    <td className="text-right py-2 font-bold text-slate-800">{stats.totalTSS.swim}</td>
                    <td className="text-right py-2 font-bold text-slate-800">{Math.round(stats.avgWeeklyTSS.swim)}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: disciplineColors.bike }}></div>
                        <span className="text-slate-700">バイク</span>
                      </div>
                    </td>
                    <td className="text-right py-2 font-bold text-slate-800">{stats.totalTSS.bike}</td>
                    <td className="text-right py-2 font-bold text-slate-800">{Math.round(stats.avgWeeklyTSS.bike)}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: disciplineColors.run }}></div>
                        <span className="text-slate-700">ラン</span>
                      </div>
                    </td>
                    <td className="text-right py-2 font-bold text-slate-800">{stats.totalTSS.run}</td>
                    <td className="text-right py-2 font-bold text-slate-800">{Math.round(stats.avgWeeklyTSS.run)}</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: disciplineColors.other }}></div>
                        <span className="text-slate-700">その他</span>
                      </div>
                    </td>
                    <td className="text-right py-2 font-bold text-slate-800">{stats.totalTSS.other}</td>
                    <td className="text-right py-2 font-bold text-slate-800">{Math.round(stats.avgWeeklyTSS.other)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}