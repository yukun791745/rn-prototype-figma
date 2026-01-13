import React from 'react';
import { ChevronLeft, Info, User, Heart, Droplets, Zap, Activity, Apple, Thermometer } from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  // State for all settings
  const [accountName, setAccountName] = React.useState('山田太郎');
  const [email, setEmail] = React.useState('yamada@example.com');
  const [password, setPassword] = React.useState('');
  
  const [height, setHeight] = React.useState('175');
  const [weight, setWeight] = React.useState('68');
  const [age, setAge] = React.useState('35');
  const [gender, setGender] = React.useState('male');
  
  const [maxHeartRate, setMaxHeartRate] = React.useState('185');
  const [restingHeartRate, setRestingHeartRate] = React.useState('52');
  
  const [cssMinutes, setCssMinutes] = React.useState('1');
  const [cssSeconds, setCssSeconds] = React.useState('28');
  
  const [runThresholdPaceMin, setRunThresholdPaceMin] = React.useState('4');
  const [runThresholdPaceSec, setRunThresholdPaceSec] = React.useState('15');
  const [runThresholdHR, setRunThresholdHR] = React.useState('168');
  
  const [ftp, setFtp] = React.useState('250');
  const [powerWeightRatio, setPowerWeightRatio] = React.useState('3.68');
  
  const [maxCarbIntake, setMaxCarbIntake] = React.useState('90');
  
  const [sweatRate, setSweatRate] = React.useState('1.2');
  const [testTemp, setTestTemp] = React.useState('25');
  const [testHumidity, setTestHumidity] = React.useState('60');
  const [testIntensity, setTestIntensity] = React.useState('medium');
  
  const [sodiumConcentration, setSodiumConcentration] = React.useState('1200');
  
  const [showInfoModal, setShowInfoModal] = React.useState<string | null>(null);

  const handleSave = () => {
    // TODO: Implement save functionality
    const settings = {
      account: { name: accountName, email, password },
      body: { height, weight, age, gender },
      heartRate: { max: maxHeartRate, resting: restingHeartRate },
      swim: { css: `${cssMinutes}:${cssSeconds}` },
      run: { thresholdPace: `${runThresholdPaceMin}:${runThresholdPaceSec}`, thresholdHR: runThresholdHR },
      bike: { ftp, powerWeightRatio },
      nutrition: { maxCarbIntake, sweatRate, testTemp, testHumidity, testIntensity, sodiumConcentration }
    };
    console.log('Settings saved:', settings);
    // Show success message
    alert('設定を保存しました');
  };

  const handleReset = () => {
    if (confirm('すべての設定をデフォルトに戻しますか？')) {
      // Reset to default values
      setAccountName('山田太郎');
      setEmail('yamada@example.com');
      setPassword('');
      setHeight('175');
      setWeight('68');
      setAge('35');
      setGender('male');
      setMaxHeartRate('185');
      setRestingHeartRate('52');
      setCssMinutes('1');
      setCssSeconds('28');
      setRunThresholdPaceMin('4');
      setRunThresholdPaceSec('15');
      setRunThresholdHR('168');
      setFtp('250');
      setPowerWeightRatio('3.68');
      setMaxCarbIntake('90');
      setSweatRate('1.2');
      setTestTemp('25');
      setTestHumidity('60');
      setTestIntensity('medium');
      setSodiumConcentration('1200');
    }
  };

  const InfoIcon = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="p-1 hover:bg-slate-100 rounded-full transition-all"
    >
      <Info className="w-4 h-4 text-slate-400" />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-800">設定</h1>
              <p className="text-xs text-slate-500 mt-0.5">プロフィールとトレーニング指標の管理</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pt-4 space-y-3">
        {/* 1. Account Information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-base font-bold text-slate-800">アカウント情報</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">アカウント名</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">メールア��レス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">パスワード（変更時のみ）</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="新しいパスワード"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>
        </div>

        {/* 2. Body Information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-base font-bold text-slate-800">身体情報</h2>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">正確な消費エネルギー・代謝計算に使用</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">身長（cm）</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">体重（kg）</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">年齢</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">性別</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="male">男性</option>
                <option value="female">女性</option>
                <option value="other">その他</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Heart Rate Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-rose-600" />
            </div>
            <h2 className="text-base font-bold text-slate-800">心拍数設定</h2>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">心拍ゾーン・hrTSS計算に使用</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">最大心拍数（bpm）</label>
              <input
                type="number"
                value={maxHeartRate}
                onChange={(e) => setMaxHeartRate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">安静時心拍数（bpm）</label>
              <input
                type="number"
                value={restingHeartRate}
                onChange={(e) => setRestingHeartRate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>
        </div>

        {/* 4. Swim Threshold (CSS) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Droplets className="w-4 h-4 text-cyan-600" />
            </div>
            <h2 className="text-base font-bold text-slate-800">スイム閾値（CSS）</h2>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">400m＋200mテスト、または閾値強度で泳げるペース</p>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">CSS（分:秒 / 100m）</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={cssMinutes}
                onChange={(e) => setCssMinutes(e.target.value)}
                className="w-16 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-center"
                placeholder="分"
              />
              <span className="text-slate-600 font-semibold">:</span>
              <input
                type="number"
                value={cssSeconds}
                onChange={(e) => setCssSeconds(e.target.value)}
                className="w-16 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-center"
                placeholder="秒"
              />
              <span className="text-xs text-slate-500 ml-1">/ 100m</span>
            </div>
          </div>
        </div>

        {/* 5. Run Threshold */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-orange-600" />
            </div>
            <h2 className="text-base font-bold text-slate-800">ラン閾値</h2>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">1時間持続可能なペース、または10kmレースペース</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">閾値ペース（分:秒 / km）</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={runThresholdPaceMin}
                  onChange={(e) => setRunThresholdPaceMin(e.target.value)}
                  className="w-16 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-center"
                  placeholder="分"
                />
                <span className="text-slate-600 font-semibold">:</span>
                <input
                  type="number"
                  value={runThresholdPaceSec}
                  onChange={(e) => setRunThresholdPaceSec(e.target.value)}
                  className="w-16 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-center"
                  placeholder="秒"
                />
                <span className="text-xs text-slate-500 ml-1">/ km</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">閾値心拍数（bpm）</label>
              <input
                type="number"
                value={runThresholdHR}
                onChange={(e) => setRunThresholdHR(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>
        </div>

        {/* 6. Bike Threshold */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="text-base font-bold text-slate-800">バイク閾値</h2>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">20分テストの平均パワー×0.95、または1時間持続可能パワー</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">FTP（W）</label>
              <input
                type="number"
                value={ftp}
                onChange={(e) => {
                  setFtp(e.target.value);
                  // Auto-calculate power-to-weight ratio
                  if (weight && e.target.value) {
                    setPowerWeightRatio((parseFloat(e.target.value) / parseFloat(weight)).toFixed(2));
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">W/kg</label>
              <input
                type="number"
                value={powerWeightRatio}
                onChange={(e) => setPowerWeightRatio(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* 7. Carbohydrate Tolerance */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Apple className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="text-base font-bold text-slate-800">糖質許容量</h2>
            </div>
            <InfoIcon onClick={() => setShowInfoModal(`補給計画では、あなたの糖質許容量（${maxCarbIntake} g/時）を上限として、レース中の摂取量を評価します。この値を超えると胃腸トラブルのリスクが高まります。`)} />
          </div>
          <p className="text-[11px] text-slate-500 mb-3">日々の練習でテストした、胃腸トラブルを起こさずに摂取可能な上限</p>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">最大糖質摂取量（g/時）</label>
            <input
              type="number"
              value={maxCarbIntake}
              onChange={(e) => setMaxCarbIntake(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>

        {/* 8. Sweat Test Results */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Droplets className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-base font-bold text-slate-800">発汗テスト結果</h2>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">体重変化・摂取量・尿量から算出</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">発汗量（L/時）</label>
              <input
                type="number"
                value={sweatRate}
                onChange={(e) => setSweatRate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                step="0.1"
              />
            </div>
            <div className="bg-slate-50 rounded-lg p-3 space-y-2">
              <p className="text-xs font-semibold text-slate-700 mb-2">テスト条件</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-600 mb-1">気温（℃）</label>
                  <input
                    type="number"
                    value={testTemp}
                    onChange={(e) => setTestTemp(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-600 mb-1">湿度（%）</label>
                  <input
                    type="number"
                    value={testHumidity}
                    onChange={(e) => setTestHumidity(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-slate-600 mb-1">運動強度</label>
                <select
                  value={testIntensity}
                  onChange={(e) => setTestIntensity(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-300"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 9. Sodium Concentration */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Thermometer className="w-4 h-4 text-amber-600" />
              </div>
              <h2 className="text-base font-bold text-slate-800">ナトリウム濃度</h2>
            </div>
            <InfoIcon onClick={() => setShowInfoModal(`水分補給量 × あなたのナトリウム濃度（${sodiumConcentration} mg/L）に基づき、レース中の電解質補給量を算出します。個人差が大きいため、スウェットテストでの測定が推奨されます。`)} />
          </div>
          <p className="text-[11px] text-slate-500 mb-3">スウェットテスト、または市販パッチ測定値</p>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">ナトリウム濃度（mg/L）</label>
            <input
              type="number"
              value={sodiumConcentration}
              onChange={(e) => setSodiumConcentration(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all"
          >
            デフォルトに戻す
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-semibold text-sm hover:from-indigo-700 hover:to-blue-700 transition-all shadow-md"
          >
            設定を保存
          </button>
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-5 max-w-sm w-full mx-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base text-slate-800 mb-2">詳細情報</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{showInfoModal}</p>
              </div>
            </div>
            <button
              onClick={() => setShowInfoModal(null)}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-all"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}