import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Home, Dumbbell, Trophy, BotMessageSquare, Newspaper, Settings } from 'lucide-react';
import { HomeScreen } from '../screens/HomeScreen';
import { TrainingScreen } from '../screens/TrainingScreen';
import { ActivitiesScreen } from '../screens/ActivitiesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { NewsScreen } from '../screens/NewsScreen';
import { RaceScreen } from '../screens/RaceScreen';
import { AICoachScreen } from '../screens/AICoachScreen';
import { BottomNav } from '../components/navigation/BottomNav';
import { Header } from '../components/navigation/Header';

function AppContent() {
  const location = useLocation();
  const today = "2026年1月10日（金）";
  const tsb = 25;
  const tsbDelta = 11;
  const atl = 62;

  // Determine active tab based on current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/' || path === '/home') return 'home';
    if (path.startsWith('/training')) return 'training';
    if (path.startsWith('/activities')) return 'activities';
    if (path.startsWith('/race')) return 'race';
    if (path.startsWith('/ai-coach')) return 'ai-coach';
    if (path.startsWith('/news')) return 'news';
    if (path.startsWith('/settings')) return 'settings';
    return 'home';
  };

  const activeTab = getActiveTab();
  const navigate = useNavigate();

  // Navigation tabs configuration
  const navTabs = [
    { id: 'home', label: 'ホーム', icon: Home },
    { id: 'training', label: 'トレーニング', icon: Dumbbell },
    { id: 'race', label: 'レース', icon: Trophy },
    { id: 'ai-coach', label: 'AIコーチ', icon: BotMessageSquare },
    { id: 'news', label: 'ニュース', icon: Newspaper },
    { id: 'settings', label: '設定', icon: Settings }
  ];

  const handleTabChange = (tabId: string) => {
    if (tabId === 'home') navigate('/');
    else navigate(`/${tabId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
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

        {/* Main Content with Routes */}
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/training" element={<TrainingScreen />} />
          <Route path="/activities" element={<ActivitiesScreen />} />
          <Route path="/race" element={<RaceScreen />} />
          <Route path="/ai-coach" element={<AICoachScreen />} />
          <Route path="/news" element={<NewsScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>

        {/* Fixed Bottom Navigation Bar */}
        <BottomNav tabs={navTabs} activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}

export function Navigation() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
