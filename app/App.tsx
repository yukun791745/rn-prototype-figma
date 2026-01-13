import { DashboardScreen } from "./components/dashboard/DashboardScreen";
import { NewsScreen } from "./components/news/NewsScreen";
import { RaceSelectionScreen, SelectedRace } from "./components/race/RaceSelectionScreen";
import { RaceOverviewScreen } from "./components/race/RaceOverviewScreen";
import { RaceGoalSettingScreen } from "./components/race/RaceGoalSettingScreen";
import { NutritionPlanningScreen } from "./components/race/NutritionPlanningScreen";
import { SettingsScreen } from "./components/settings/SettingsScreen";
import { TrainingDashboardScreen } from "./components/training/TrainingDashboardScreen";
import { WeeklyScheduleScreen } from "./components/training/WeeklyScheduleScreen";
import { SessionDetailScreen } from "./components/training/SessionDetailScreen";
import { TrainingPlanScreen } from "./components/training/TrainingPlanScreen";
import { TrainingOverviewScreen } from "./components/training/TrainingOverviewScreen";
import { ActivityDetailScreen } from "./components/activities/ActivityDetailScreen";
import { AllSessionsScreen } from "./components/activities/AllSessionsScreen";
import { PeriodSelection } from "./components/training/types";
import React from "react";
import { Home, Dumbbell, Trophy, BotMessageSquare, Newspaper, Settings } from "lucide-react";
import { AICoachCard } from "./components/dashboard/AICoachCard";
import { FitnessMetricsCard } from "./components/dashboard/FitnessMetricsCard";
import { RecentActivityCard } from "./components/dashboard/RecentActivityCard";
import { UpcomingRacesCard } from "./components/dashboard/UpcomingRacesCard";
import { NewsCard } from "./components/dashboard/NewsCard";
import { ChatMessage } from "./components/ai-coach/ChatMessage";
import { ChatInput } from "./components/ai-coach/ChatInput";
import { FileAttachment, AttachedFile } from "./components/ai-coach/FileAttachment";
import { BottomNav } from "./components/navigation/BottomNav";
import { Header } from "./components/navigation/Header";

export default function App() {
  // データ
  const today = "2026年1月10日（金）";
  const ctl = 87;
  const ctlDelta = 3;
  const atl = 62;
  const atlDelta = -8;
  const tsb = 25;
  const tsbDelta = 11;
  
  // Navigation state
  const [activeTab, setActiveTab] = React.useState('home');
  
  // Race screen state - to track which race screen to show
  const [raceScreen, setRaceScreen] = React.useState<'overview' | 'selection' | 'goal-setting' | 'nutrition'>('overview');
  
  // Selected races state - to persist selected races across screens
  // Load from localStorage on mount
  const [selectedRaces, setSelectedRaces] = React.useState<SelectedRace[]>(() => {
    const saved = localStorage.getItem('selectedRaces');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Save selected races to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('selectedRaces', JSON.stringify(selectedRaces));
  }, [selectedRaces]);
  
  // Selected race for goal setting
  const [selectedRaceForGoal, setSelectedRaceForGoal] = React.useState<any | null>(null);
  
  // Training screen state - to track which training screen to show
  const [trainingScreen, setTrainingScreen] = React.useState<
    'dashboard' | 'schedule' | 'session' | 'plan' | 'overview' | 'allSessions' | 'activityDetail'
  >('dashboard');
  const [selectedSessionId, setSelectedSessionId] = React.useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = React.useState<string | null>(null);
  
  // News screen state - to track selected article for summary view
  const [selectedNewsArticleId, setSelectedNewsArticleId] = React.useState<string | null>(null);
  
  // Period selection state - shared between training dashboard and overview
  const [selectedPeriod, setSelectedPeriod] = React.useState<PeriodSelection>({
    preset: '2weeks'
  });
  
  // Chat input state
  const [chatInput, setChatInput] = React.useState('');
  
  // File attachment state
  const [attachedFiles, setAttachedFiles] = React.useState<AttachedFile[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  
  // Handle file selection
  const handleFileSelect = async (files: FileList) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    const newFiles: AttachedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = getFileType(file);
      
      const attachedFile: AttachedFile = {
        id: `${Date.now()}-${i}`,
        file,
        type: fileType,
        size: file.size,
        name: file.name
      };
      
      // Generate preview for images
      if (fileType === 'image') {
        attachedFile.preview = await generateImagePreview(file);
      }
      
      newFiles.push(attachedFile);
    }
    
    setAttachedFiles(prev => [...prev, ...newFiles]);
    setIsUploading(false);
  };
  
  // Get file type from file
  const getFileType = (file: File): AttachedFile['type'] => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext || '')) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (ext === 'csv') return 'csv';
    if (ext === 'txt') return 'txt';
    return 'other';
  };
  
  // Generate image preview
  const generateImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };
  
  // Remove attached file
  const removeAttachedFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };
  
  // Handle send message
  const handleSendMessage = () => {
    if (!chatInput.trim() && attachedFiles.length === 0) return;
    
    // TODO: Implement actual message sending with FormData
    const formData = new FormData();
    formData.append('message', chatInput);
    attachedFiles.forEach((file, index) => {
      formData.append(`file${index}`, file.file);
    });
    
    console.log('Sending message:', chatInput, 'with', attachedFiles.length, 'files');
    
    // Reset
    setChatInput('');
    setAttachedFiles([]);
  };
  
  // レースデータ
  const upcomingRaces = [
    {
      id: 1,
      name: "オリンピックディスタンス・トライアスロン",
      date: "2026年1月18日（日）",
      daysLeft: 8,
      targetTime: "2:30:00",
      predictedTime: "2:28:15",
      priority: 'A' as const
    },
    {
      id: 2,
      name: "スプリント・トライアスロン大会",
      date: "2026年2月15日（日）",
      daysLeft: 36,
      targetTime: "1:15:00",
      predictedTime: "1:13:42",
      priority: 'B' as const
    }
  ];

  // ニュースデータ
  const news = [
    { 
      id: 'news-1', 
      title: '2026アイアンマン世界選手権プレビュー：注目すべきトップ候補選手',
      source: 'Triathlete',
      language: 'en' as const,
      url: 'https://www.triathlete.com/example'
    },
    { 
      id: 'news-2', 
      title: '冬のトレーニング戦略：オフシーズンを無駄にしない方法',
      source: 'Triathlon Magazine',
      language: 'jp' as const,
      url: 'https://www.triathlon-magazine.jp/example'
    },
    { 
      id: 'news-4', 
      title: 'バイクフィットの基礎：なぜプロフェッショナルなフィッティングが重要なのか',
      source: 'Slowtwitch',
      language: 'en' as const,
      url: 'https://www.slowtwitch.com/example'
    }
  ];

  // Navigation tabs configuration
  const navTabs = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'training', label: 'トレーニング', icon: Dumbbell },
    { id: 'race', label: 'レース', icon: Trophy },
    { id: 'ai-coach', label: 'AIコーチ', icon: BotMessageSquare },
    { id: 'news', label: 'ニュース', icon: Newspaper },
    { id: 'settings', label: '設定', icon: Settings }
  ];

  // Reset race screen when switching tabs
  React.useEffect(() => {
    if (activeTab === 'race') {
      setRaceScreen('overview');
    }
    // Don't reset training screen if we're navigating to a specific activity
    if (activeTab === 'training' && trainingScreen !== 'activityDetail') {
      setTrainingScreen('dashboard');
      setSelectedSessionId(null);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Mobile Container */}
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {/* Conditional Header Based on Active Tab */}
        {activeTab === 'ai-coach' ? (
          <Header
            date={today}
            title="AIコーチ"
            subtitle={`今日のコンディション：良好（TSB +${tsbDelta}） / 疲労：やや高（ATL ${atl}）`}
          />
        ) : activeTab === 'news' ? null : (
          <Header date={today} />
        )}

        {/* Conditional Main Content Based on Active Tab */}
        {activeTab === 'news' ? (
          // News Screen
          <NewsScreen initialSelectedArticleId={selectedNewsArticleId} />
        ) : activeTab === 'training' ? (
          // Training Screens
          trainingScreen === 'dashboard' ? (
            <TrainingDashboardScreen
              currentCTL={ctl}
              currentATL={atl}
              currentTSB={tsb}
              ctlDelta={ctlDelta}
              atlDelta={atlDelta}
              tsbDelta={tsbDelta}
              onViewSchedule={() => setTrainingScreen('schedule')}
              onViewAllSessions={() => setTrainingScreen('allSessions')}
              onViewPlan={() => setTrainingScreen('plan')}
              onViewOverview={() => setTrainingScreen('overview')}
              onSessionClick={(id) => {
                setSelectedActivityId(id);
                setTrainingScreen('activityDetail');
              }}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          ) : trainingScreen === 'schedule' ? (
            <WeeklyScheduleScreen
              onBack={() => setTrainingScreen('dashboard')}
              onSessionClick={(id) => {
                setSelectedSessionId(id);
                setTrainingScreen('session');
              }}
            />
          ) : trainingScreen === 'session' ? (
            <SessionDetailScreen
              sessionId={selectedSessionId || ''}
              onBack={() => setTrainingScreen('dashboard')}
            />
          ) : trainingScreen === 'plan' ? (
            <TrainingPlanScreen
              onBack={() => setTrainingScreen('dashboard')}
            />
          ) : trainingScreen === 'overview' ? (
            <TrainingOverviewScreen
              onBack={() => setTrainingScreen('dashboard')}
              initialPeriod={selectedPeriod}
            />
          ) : trainingScreen === 'allSessions' ? (
            <AllSessionsScreen
              onBack={() => setTrainingScreen('dashboard')}
              onActivityClick={(id) => {
                setSelectedActivityId(id);
                setTrainingScreen('activityDetail');
              }}
            />
          ) : (
            <ActivityDetailScreen
              activityId={selectedActivityId || ''}
              onBack={() => {
                // 前の画面に戻る：allSessionsから来た場合はallSessionsに、dashboardから来た場合はdashboardに
                if (trainingScreen === 'activityDetail') {
                  setTrainingScreen('dashboard');
                }
              }}
            />
          )
        ) : activeTab === 'race' ? (
          // Race Screens - Toggle between Overview, Selection, and Strategy
          raceScreen === 'overview' ? (
            <RaceOverviewScreen
              onSelectRaces={() => setRaceScreen('selection')}
              onSetGoal={(race) => {
                setSelectedRaceForGoal(race);
                setRaceScreen('goal-setting');
              }}
              selectedRaces={selectedRaces.map(r => ({
                ...r,
                category: 'トライアスロン',
                targetTime: '',
                daysUntilRace: Math.ceil((new Date(r.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              }))}
              onDeleteRace={(raceId) => {
                setSelectedRaces(prev => prev.filter(r => r.id !== raceId));
              }}
            />
          ) : raceScreen === 'selection' ? (
            <RaceSelectionScreen
              onBack={() => setRaceScreen('overview')}
              onRacesSelected={(races) => {
                setSelectedRaces(races);
                setRaceScreen('overview');
              }}
              initialSelectedRaces={selectedRaces}
            />
          ) : raceScreen === 'goal-setting' ? (
            <RaceGoalSettingScreen
              onBack={() => setRaceScreen('overview')}
              onProceedToNutrition={() => {
                // TODO: Navigate to nutrition screen
                console.log('Proceeding to nutrition strategy');
                setRaceScreen('nutrition');
              }}
              selectedGoal={localStorage.getItem('raceGoalScenario')}
              previousMessages={JSON.parse(localStorage.getItem('raceGoalMessages') || '[]').map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              }))}
              previousMetrics={JSON.parse(localStorage.getItem('raceGoalMetrics') || 'null')}
              previousConditions={JSON.parse(localStorage.getItem('raceGoalConditions') || 'null')}
              previousConfirmedSections={JSON.parse(localStorage.getItem('raceGoalConfirmedSections') || 'null')}
            />
          ) : (
            <NutritionPlanningScreen
              onBack={() => setRaceScreen('goal-setting')}
            />
          )
        ) : activeTab === 'ai-coach' ? (
          // AI Coach Chat Screen
          <main className="flex flex-col h-[calc(100vh-8rem)] pb-2">
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <ChatMessage
                role="assistant"
                content="こんにちは。トレーニング計画やレース戦略、補給や回復の相談、運動生理学に関する疑問など、どんなことでもお気軽に相談してください。あなたのデータも参考にしながら、一緒に考えていきましょう。"
                timestamp="9:20"
              />
            </div>

            {/* Attached Files Preview */}
            <FileAttachment files={attachedFiles} onRemove={removeAttachedFile} />

            {/* Input Bar */}
            <ChatInput
              value={chatInput}
              onChange={setChatInput}
              onSend={handleSendMessage}
              attachedFiles={attachedFiles}
              onFileSelect={handleFileSelect}
              isUploading={isUploading}
            />
          </main>
        ) : activeTab === 'settings' ? (
          // Settings Screen
          <SettingsScreen onBack={() => setActiveTab('home')} />
        ) : (
          // Dashboard Content
          <main className="space-y-3 pb-20 px-4 pt-3">
            <AICoachCard
              comment="今日はコンディション良好。高強度トレーニングに最適です。レース前の勢いを維持するため、テンポランを推奨します。"
              onConsultClick={() => setActiveTab('ai-coach')}
            />

            <FitnessMetricsCard
              ctl={ctl}
              ctlDelta={ctlDelta}
              atl={atl}
              atlDelta={atlDelta}
              tsb={tsb}
              tsbDelta={tsbDelta}
              onDetailClick={() => {
                setActiveTab('training');
                setTrainingScreen('dashboard');
              }}
            />

            <RecentActivityCard
              name="持久力スイムセッション"
              date="2026年1月9日（木）17:30"
              type="スイム"
              typeColor="bg-indigo-300/80 text-indigo-700"
              distance="3.2"
              duration="1:24"
              pace="2:38"
              tss={68}
              activityId="activity-recent-1"
              onCommentClick={() => {
                setSelectedActivityId("activity-recent-1");
                setTrainingScreen('activityDetail');
                setActiveTab('training');
              }}
            />

            <UpcomingRacesCard 
              races={upcomingRaces}
              onViewAllClick={() => {
                setActiveTab('race');
                setRaceScreen('overview');
              }}
            />

            <NewsCard 
              news={news} 
              onViewAllClick={() => setActiveTab('news')}
              onNewsItemClick={(item) => {
                if (item.language === 'en') {
                  // 英語の記事の場合、ニュース画面に遷移して要約を表示
                  setSelectedNewsArticleId(item.id);
                  setActiveTab('news');
                } else {
                  // 日本語の記事の場合、直接記事を開く（将来実装）
                  console.log('Opening article:', item.url);
                  // window.open(item.url, '_blank');
                }
              }}
            />
          </main>
        )}

        {/* Fixed Bottom Navigation Bar */}
        <BottomNav tabs={navTabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
