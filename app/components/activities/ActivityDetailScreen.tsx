import React from 'react';
import { ChevronLeft, Trash2, MessageSquare, Bike, Waves, Footprints, Dumbbell, ChevronDown, MapPin } from 'lucide-react';

interface ActivityDetail {
  id: string;
  date: string;
  discipline: 'swim' | 'bike' | 'run' | 'other';
  title: string;
  distance: number; // km
  duration: number; // minutes
  pace?: string;
  avgHeartRate?: number;
  avgCadence?: number;
  avgStride?: number;
  elevation?: number; // m
  tss: number;
  // 心拍ゾーン（分）
  hrZones?: {
    z1: number; // 回復
    z2: number; // 有酸素
    z3: number; // テンポ
    z4: number; // 閾値
    z5: number; // VO2max
  };
  // GPS地図用の座標（中心点）
  mapCenter?: {
    lat: number;
    lng: number;
  };
  // 時系列データ
  timeSeriesData?: {
    time: number[]; // 秒
    heartRate: number[];
    pace: number[]; // min/km
    elevation: number[]; // m
  };
}

interface TrainingPurpose {
  id: string;
  label: string;
  category: string;
}

interface AIComment {
  id: string;
  activityId: string;
  purpose: string;
  userNote?: string;
  messages: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[];
  createdAt: string;
}

interface ActivityDetailScreenProps {
  activityId: string;
  onBack: () => void;
}

export function ActivityDetailScreen({ activityId, onBack }: ActivityDetailScreenProps) {
  const [selectedPurpose, setSelectedPurpose] = React.useState<string | null>(null);
  const [userNote, setUserNote] = React.useState('');
  const [showComments, setShowComments] = React.useState(false);
  const [aiComments, setAiComments] = React.useState<AIComment | null>(null);
  const [isLoadingComment, setIsLoadingComment] = React.useState(false);
  const [newQuestion, setNewQuestion] = React.useState('');
  const [showPurposeDropdown, setShowPurposeDropdown] = React.useState(false);
  const [selectedChartTab, setSelectedChartTab] = React.useState<'pace' | 'heartRate' | 'gap' | 'cadence'>('heartRate');

  // トレーニング目的の選択肢
  const trainingPurposes: TrainingPurpose[] = [
    { id: 'easy', label: 'イージージョグ', category: '基礎ペース' },
    { id: 'long', label: 'ロング走', category: '持久力' },
    { id: 'tempo', label: 'テンポ/閾値走', category: 'ペース' },
    { id: 'interval', label: 'インターバル', category: '高強度訓練' },
    { id: 'fartlek', label: 'ファルトレク', category: 'バースト訓練' },
    { id: 'hill', label: '坂道トレーニング', category: '筋力/パワー練習' },
    { id: 'brick', label: 'ブリック（バイク後）', category: 'バイク連動' },
    { id: 'recovery', label: 'リカバリー', category: '疲労回復' },
    { id: 'test', label: 'テスト/TT', category: 'タイム計測' },
    { id: 'race', label: 'レース大会', category: '本番' },
    { id: 'other', label: 'その他', category: '上記以外' },
  ];

  // 時系列データを生成（モック）
  const generateTimeSeriesData = (duration: number) => {
    const points = 150; // データポイント数
    const time: number[] = [];
    const heartRate: number[] = [];
    const pace: number[] = [];
    const elevation: number[] = [];

    for (let i = 0; i < points; i++) {
      const t = (duration * 60 * i) / points; // 秒
      time.push(t);

      // 心拍数（136bpm前後で変動）
      const hrBase = 136;
      const hrVariation = Math.sin(i / 10) * 8 + Math.random() * 4;
      heartRate.push(hrBase + hrVariation);

      // ペース（5:42/km = 5.7分/km前後で変動）
      const paceBase = 5.7;
      const paceVariation = Math.sin(i / 15) * 0.3 + Math.random() * 0.2;
      pace.push(paceBase + paceVariation);

      // 標高（0-120mで緩やかな起伏）
      const elevBase = 60;
      const elevVariation = Math.sin(i / 20) * 40 + Math.sin(i / 8) * 20;
      elevation.push(Math.max(0, elevBase + elevVariation));
    }

    return { time, heartRate, pace, elevation };
  };

  // モックデータ（実際のデータに置き換え）
  const getActivityData = (id: string): ActivityDetail => {
    // TrainingDashboardScreenとホーム画面のセッションに対応するデータ
    switch (id) {
      case '4':
      case 'activity-recent-1':
        // 持久力スイムセッション
        return {
          id,
          date: '2026-01-09T17:30:00',
          discipline: 'swim',
          title: '持久力スイムセッション',
          distance: 3.2,
          duration: 84, // 1:24:00
          pace: '2:38 /100m',
          avgHeartRate: 128,
          avgCadence: 52,
          avgStride: undefined,
          elevation: 0,
          tss: 68,
          hrZones: {
            z1: 8.5,
            z2: 42.3,
            z3: 28.7,
            z4: 4.5,
            z5: 0,
          },
          mapCenter: {
            lat: 35.6812,
            lng: 139.7671,
          },
          timeSeriesData: generateTimeSeriesData(84),
        };
      case '5':
        // イージーラン
        return {
          id,
          date: '2026-01-08T18:00:00',
          discipline: 'run',
          title: 'イージーラン',
          distance: 8,
          duration: 48, // 48分
          pace: '6:00 /km',
          avgHeartRate: 125,
          avgCadence: 168,
          avgStride: 0.99,
          elevation: 32,
          tss: 42,
          hrZones: {
            z1: 5.2,
            z2: 35.8,
            z3: 7.0,
            z4: 0,
            z5: 0,
          },
          mapCenter: {
            lat: 35.6812,
            lng: 139.7671,
          },
          timeSeriesData: generateTimeSeriesData(48),
        };
      case '6':
        // テンポライド
        return {
          id,
          date: '2026-01-07T09:00:00',
          discipline: 'bike',
          title: 'テンポライド',
          distance: 45,
          duration: 90, // 1:30:00
          pace: '30.0 km/h',
          avgHeartRate: 142,
          avgCadence: 88,
          avgStride: undefined,
          elevation: 245,
          tss: 78,
          hrZones: {
            z1: 2.5,
            z2: 18.2,
            z3: 52.8,
            z4: 16.5,
            z5: 0,
          },
          mapCenter: {
            lat: 35.6812,
            lng: 139.7671,
          },
          timeSeriesData: generateTimeSeriesData(90),
        };
      default:
        // デフォルトのランニングセッション
        return {
          id,
          date: '2026-01-11T13:59:00',
          discipline: 'run',
          title: '午後のランニング',
          distance: 12.18,
          duration: 69.47, // 1:09:28
          pace: '5:42 /km',
          avgHeartRate: 136,
          avgCadence: 171,
          avgStride: 1.03,
          elevation: 84,
          tss: 98,
          hrZones: {
            z1: 10.97,
            z2: 23.75,
            z3: 26.83,
            z4: 14.72,
            z5: 0,
          },
          mapCenter: {
            lat: 35.6812,
            lng: 139.7671,
          },
          timeSeriesData: generateTimeSeriesData(69.47),
        };
    }
  };

  const activity: ActivityDetail = getActivityData(activityId);

  // モックのAIコメント会話を読み込み
  React.useEffect(() => {
    const saved = localStorage.getItem(`ai-comment-${activityId}`);
    if (saved) {
      const data = JSON.parse(saved);
      setAiComments(data);
      setShowComments(true);
      setSelectedPurpose(data.purpose);
      setUserNote(data.userNote || '');
    }
    // 初回訪問時はモックデータを設定せず、ユーザーに選択させる
  }, [activityId]);

  const getDisciplineIcon = (discipline: string) => {
    switch (discipline) {
      case 'swim':
        return <Waves className="w-5 h-5" />;
      case 'bike':
        return <Bike className="w-5 h-5" />;
      case 'run':
        return <Footprints className="w-5 h-5" />;
      case 'other':
        return <Dumbbell className="w-5 h-5" />;
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
      default:
        return '';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.round((minutes % 1) * 60);
    if (hours > 0) {
      return `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${year}年${month}月${day}日（${weekday}）${hours}:${String(minutes).padStart(2, '0')}`;
  };

  const handleGenerateComment = async () => {
    if (!selectedPurpose) return;

    setIsLoadingComment(true);
    setShowComments(true);

    // AIコメントを生成（モック）
    const purpose = trainingPurposes.find((p) => p.id === selectedPurpose);
    const mockComment = generateMockAIComment(activity, purpose!.label, userNote);

    setTimeout(() => {
      const newComment: AIComment = {
        id: `comment-${Date.now()}`,
        activityId: activity.id,
        purpose: purpose!.label,
        userNote: userNote || undefined,
        messages: [
          {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: mockComment,
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
      };

      setAiComments(newComment);
      localStorage.setItem(`ai-comment-${activityId}`, JSON.stringify(newComment));
      setIsLoadingComment(false);
    }, 1500);
  };

  const handleAskQuestion = async () => {
    if (!newQuestion.trim() || !aiComments) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      content: newQuestion,
      timestamp: new Date().toISOString(),
    };

    const updatedComments = {
      ...aiComments,
      messages: [...aiComments.messages, userMessage],
    };

    setAiComments(updatedComments);
    setNewQuestion('');

    // AI応答を生成（モック）
    setTimeout(() => {
      const aiResponse = {
        id: `msg-${Date.now()}`,
        role: 'assistant' as const,
        content: generateMockFollowUpResponse(newQuestion),
        timestamp: new Date().toISOString(),
      };

      const finalComments = {
        ...updatedComments,
        messages: [...updatedComments.messages, aiResponse],
      };

      setAiComments(finalComments);
      localStorage.setItem(`ai-comment-${activityId}`, JSON.stringify(finalComments));
    }, 1000);
  };

  const handleDeleteComments = () => {
    if (window.confirm('AIコーチのコメントを削除しますか？')) {
      setAiComments(null);
      setShowComments(false);
      setSelectedPurpose(null);
      setUserNote('');
      localStorage.removeItem(`ai-comment-${activityId}`);
    }
  };

  const generateMockAIComment = (activity: ActivityDetail, purpose: string, note: string): string => {
    const comments = [
      `${purpose}として良い内容ですね。距離${activity.distance}km、平均ペース${activity.pace}で走り切れています。`,
      `心拍数の平均が${activity.avgHeartRate}bpmで、${purpose}の目的に対して適切な強度で実施できていると思います。`,
      `ピッチが${activity.avgCadence}spmとリズムよく走れていますね。ストライドも${activity.avgStride}mで効率的です。`,
      `TSS${activity.tss}のトレーニング負荷は、現在の体力レベルに対してちょうど良いと考えられます。`,
    ];

    if (note) {
      comments.push(`「${note}」とのことですが、この状態でこれだけのパフォーマンスが出せているのは素晴らしいです。`);
    }

    if (activity.hrZones) {
      const totalMinutes =
        activity.hrZones.z1 + activity.hrZones.z2 + activity.hrZones.z3 + activity.hrZones.z4 + activity.hrZones.z5;
      const z2Percentage = Math.round((activity.hrZones.z2 / totalMinutes) * 100);
      const z3Percentage = Math.round((activity.hrZones.z3 / totalMinutes) * 100);

      if (purpose === 'イージージョグ' && z2Percentage > 50) {
        comments.push(`心拍ゾーンZ2が${z2Percentage}%を占めており、イージージョグとして理想的な配分です。`);
      } else if (purpose === 'テンポ/閾値走' && z3Percentage > 30) {
        comments.push(`心拍ゾーンZ3が${z3Percentage}%を占めており、テンポ走の強度として適切です。`);
      }
    }

    comments.push('次回も同じペースを維持しつつ、徐々に距離を伸ばしていくと良いでしょう。');

    return comments.join('\n\n');
  };

  const generateMockFollowUpResponse = (question: string): string => {
    const responses = [
      'それは良い質問ですね。トレーニングの進捗状況を見ながら、徐々に負荷を上げていくことをお勧めします。',
      '現在のペースを基準にして、週に1回は少し強度を上げたセッションを入れると効果的です。',
      '回復日も大切なので、無理せず体の声を聞きながら調整していきましょう。',
      '心拍数やペースのデータを見る限り、順調に進んでいると思います。このペースを維持してください。',
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getHRZoneColor = (zone: number) => {
    switch (zone) {
      case 1:
        return 'bg-[#CCCCCC]';
      case 2:
        return 'bg-[#6666FF]';
      case 3:
        return 'bg-[#0066FF]';
      case 4:
        return 'bg-[#000099]';
      case 5:
        return 'bg-[#FF33CC]';
      default:
        return 'bg-slate-400';
    }
  };

  const getHRZoneLabel = (zone: number) => {
    switch (zone) {
      case 1:
        return 'Z1 回復';
      case 2:
        return 'Z2 有酸素';
      case 3:
        return 'Z3 テンポ';
      case 4:
        return 'Z4 閾値';
      case 5:
        return 'Z5 VO2max';
      default:
        return '';
    }
  };

  // 簡易的なチャートのレンダリング（SVG）
  const renderChart = () => {
    if (!activity.timeSeriesData) return null;

    const { time, heartRate, pace, elevation } = activity.timeSeriesData;
    const width = 800;
    const height = 200;
    const padding = { top: 20, right: 40, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // データの範囲
    const maxTime = Math.max(...time);
    const minHR = Math.min(...heartRate);
    const maxHR = Math.max(...heartRate);
    const minPace = Math.min(...pace);
    const maxPace = Math.max(...pace);
    const maxElevation = Math.max(...elevation);

    // スケール関数
    const scaleX = (t: number) => (t / maxTime) * chartWidth + padding.left;
    const scaleHR = (hr: number) => chartHeight - ((hr - minHR) / (maxHR - minHR)) * chartHeight + padding.top;
    const scaleElevation = (elev: number) => chartHeight - (elev / maxElevation) * chartHeight + padding.top;

    // 標高エリア（背景）
    const elevationPath =
      `M ${scaleX(0)},${chartHeight + padding.top} ` +
      elevation.map((e, i) => `L ${scaleX(time[i])},${scaleElevation(e)}`).join(' ') +
      ` L ${scaleX(maxTime)},${chartHeight + padding.top} Z`;

    // 心拍ライン
    const hrPath =
      `M ${scaleX(time[0])},${scaleHR(heartRate[0])} ` +
      heartRate.slice(1).map((hr, i) => `L ${scaleX(time[i + 1])},${scaleHR(hr)}`).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* 背景 */}
        <rect x={padding.left} y={padding.top} width={chartWidth} height={chartHeight} fill="#f8fafc" />

        {/* グリッド線 */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1={padding.left}
            y1={padding.top + chartHeight * ratio}
            x2={width - padding.right}
            y2={padding.top + chartHeight * ratio}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        {/* 標高エリア（グレー） */}
        <path d={elevationPath} fill="#cbd5e1" opacity="0.3" />

        {/* 心拍ライン */}
        <path d={hrPath} fill="none" stroke="#ef4444" strokeWidth="2" />

        {/* X軸 */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#94a3b8"
          strokeWidth="1"
        />

        {/* Y軸 */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#94a3b8"
          strokeWidth="1"
        />

        {/* ラベル */}
        <text x={padding.left - 5} y={padding.top - 5} fontSize="10" fill="#64748b" textAnchor="end">
          {Math.round(maxHR)} bpm
        </text>
        <text x={padding.left - 5} y={height - padding.bottom + 5} fontSize="10" fill="#64748b" textAnchor="end">
          {Math.round(minHR)} bpm
        </text>
        <text x={width - padding.right + 5} y={height - padding.bottom + 15} fontSize="10" fill="#64748b">
          {Math.floor(maxTime / 60)} min
        </text>
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F5FF] via-[#F5F9FF] to-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="px-4 py-3">
          <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-lg transition-all mb-3">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-semibold ${getDisciplineColor(
                    activity.discipline
                  )}`}
                >
                  {getDisciplineIcon(activity.discipline)}
                  <span>{getDisciplineLabel(activity.discipline)}</span>
                </div>
              </div>
              <h1 className="text-lg font-bold text-slate-800 mb-1">{activity.title}</h1>
              <p className="text-xs text-slate-500">{formatDate(activity.date)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* GPS Map */}
      {activity.mapCenter && (
        <div className="px-4 pt-4">
          <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 relative">
              {/* 簡易的な地図のモック */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* 地図のプレースホルダー */}
                  <div className="absolute inset-0 opacity-20">
                    <svg viewBox="0 0 400 300" className="w-full h-full">
                      {/* ルートライン（曲線） */}
                      <path
                        d="M 50 150 Q 100 100, 150 120 T 250 140 T 350 160"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      {/* スタート地点 */}
                      <circle cx="50" cy="150" r="8" fill="#22c55e" stroke="white" strokeWidth="2" />
                      {/* ゴール地点 */}
                      <circle cx="350" cy="160" r="8" fill="#ef4444" stroke="white" strokeWidth="2" />
                    </svg>
                  </div>
                  {/* 地図ラベル */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-600" />
                    <span className="text-[10px] font-semibold text-slate-700">ルートマップ</span>
                  </div>
                  {/* 距離表示 */}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                    <span className="text-xs font-bold text-slate-800">{activity.distance} km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="px-4 pt-4">
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{activity.distance}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">距離(km)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{formatDuration(activity.duration)}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">時間</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{activity.pace}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">ペース</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-700">{activity.tss}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">TSS</div>
            </div>
          </div>

          {activity.avgHeartRate && (
            <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200">
              <div className="text-center">
                <div className="text-xl font-bold text-slate-800">{activity.avgHeartRate}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">平均心拍(bpm)</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-slate-800">{activity.avgCadence}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">ピッチ(spm)</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-slate-800">{activity.avgStride}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">ストライド(m)</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-slate-800">{activity.elevation}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">獲得標高(m)</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Time Series Chart */}
      {activity.timeSeriesData && (
        <div className="px-4 pt-4">
          <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-4">
            {/* Chart Tabs */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-slate-800">📈</span>
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedChartTab('heartRate')}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                    selectedChartTab === 'heartRate'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  心拍数
                </button>
                <button
                  onClick={() => setSelectedChartTab('pace')}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                    selectedChartTab === 'pace'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  ペース
                </button>
                <button
                  onClick={() => setSelectedChartTab('gap')}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                    selectedChartTab === 'gap'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  GAP
                </button>
                {activity.discipline === 'run' && (
                  <button
                    onClick={() => setSelectedChartTab('cadence')}
                    className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                      selectedChartTab === 'cadence'
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    ピッチ
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-2">{renderChart()}</div>
            <div className="mt-2 flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-red-500"></div>
                <span className="text-slate-600">
                  {selectedChartTab === 'heartRate' && '心拍数'}
                  {selectedChartTab === 'pace' && 'ペース'}
                  {selectedChartTab === 'gap' && 'GAP'}
                  {selectedChartTab === 'cadence' && 'ピッチ'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-slate-400 opacity-30"></div>
                <span className="text-slate-600">標高</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Heart Rate Zones */}
      {activity.hrZones && (
        <div className="px-4 pt-4">
          <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span>💓</span>
              心拍ゾーン分布
            </h3>

            {/* Zone bars */}
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((zone) => {
                const minutes = activity.hrZones![`z${zone}` as keyof typeof activity.hrZones];
                const totalMinutes = Object.values(activity.hrZones!).reduce((a, b) => a + b, 0);
                const percentage = totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0;

                return (
                  <div key={zone}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600">{getHRZoneLabel(zone)}</span>
                      <span className="font-bold text-slate-800">
                        {Math.floor(minutes)}:{String(Math.round((minutes % 1) * 60)).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className={`h-full ${getHRZoneColor(zone)} transition-all`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* AI Coach Section */}
      <div className="px-4 pt-4 pb-4">
        <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-white/95 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-500" />
                AIコーチ
              </h3>
              {showComments && aiComments && (
                <button
                  onClick={handleDeleteComments}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                  削除
                </button>
              )}
            </div>

            {!showComments ? (
              <>
                {/* Training Purpose Dropdown */}
                <div className="mb-4">
                  <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-1">
                    <span>🎯</span>
                    今日のトレーニングの目的は？
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowPurposeDropdown(!showPurposeDropdown)}
                      className="w-full flex items-center justify-between bg-white border-2 border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 hover:border-indigo-400 focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <span className={selectedPurpose ? 'text-slate-800 font-semibold' : 'text-slate-400'}>
                        {selectedPurpose
                          ? trainingPurposes.find((p) => p.id === selectedPurpose)?.label
                          : '目的を選択してください...'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showPurposeDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showPurposeDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-slate-200 rounded-lg shadow-xl z-30 max-h-64 overflow-y-auto">
                        {trainingPurposes.map((purpose) => (
                          <button
                            key={purpose.id}
                            onClick={() => {
                              setSelectedPurpose(purpose.id);
                              setShowPurposeDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 transition-all ${
                              selectedPurpose === purpose.id ? 'bg-indigo-100 font-semibold text-indigo-700' : 'text-slate-700'
                            }`}
                          >
                            <div>{purpose.label}</div>
                            <div className="text-[10px] text-slate-500 font-normal mt-0.5">{purpose.category}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* User Note */}
                <div className="mb-4">
                  <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-1">
                    <span>📝</span>
                    備考・コメント（任意）
                  </label>
                  <textarea
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    placeholder="例：膝に少し違和感があったのでペースを抑えめにしました"
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                    rows={3}
                  />
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateComment}
                  disabled={!selectedPurpose || isLoadingComment}
                  className={`w-full py-3 rounded-lg font-bold text-white text-sm transition-all ${
                    !selectedPurpose || isLoadingComment
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md'
                  }`}
                >
                  {isLoadingComment ? 'コメントを生成中...' : 'AIコーチのコメントを見る'}
                </button>
              </>
            ) : (
              <>
                {/* Display selected purpose and note */}
                <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="text-xs text-indigo-700 mb-1">
                    <span className="font-semibold">トレーニング目的：</span>
                    {trainingPurposes.find((p) => p.id === selectedPurpose)?.label || aiComments?.purpose}
                  </div>
                  {(userNote || aiComments?.userNote) && (
                    <div className="text-xs text-slate-600 mt-2">
                      <span className="font-semibold">備考：</span>
                      {userNote || aiComments?.userNote}
                    </div>
                  )}
                </div>

                {/* Chat Messages */}
                <div className="space-y-3 mb-4 max-h-[500px] overflow-y-auto">
                  {aiComments?.messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`${
                        message.role === 'assistant' ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'
                      } border-2 rounded-lg p-3`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {message.role === 'assistant' ? (
                          <>
                            <MessageSquare className="w-4 h-4 text-indigo-600" />
                            <span className="text-xs font-bold text-indigo-700">AIコーチ</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-bold text-slate-700">あなた</span>
                          </>
                        )}
                        <span className="text-[10px] text-slate-400 ml-auto">
                          {new Date(message.timestamp).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{message.content}</p>
                    </div>
                  ))}
                </div>

                {/* Follow-up Question */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">追加で質問する</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAskQuestion();
                        }
                      }}
                      placeholder="質問を入力..."
                      className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleAskQuestion}
                      disabled={!newQuestion.trim()}
                      className={`px-4 py-2 rounded-lg font-bold text-white text-sm transition-all ${
                        !newQuestion.trim() ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      送信
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}