import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Home, Dumbbell, Trophy, BotMessageSquare, Newspaper, Settings, Activity } from 'lucide-react';
import { BottomNav } from '../components/navigation/BottomNav';
import { Header } from '../components/navigation/Header';
import { HomeScreen } from '../screens/HomeScreen';
import { TrainingScreen } from '../screens/TrainingScreen';
import { ActivitiesScreen } from '../screens/ActivitiesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { NewsScreen } from '../screens/NewsScreen';
import { RaceScreen } from '../screens/RaceScreen';
import { AICoachScreen } from '../screens/AICoachScreen';

// Navigation tabs configuration
const navTabs = [
  { id: 'home', label: 'ホーム', icon: Home, path: '/' },
  { id: 'training', label: 'トレーニング', icon: Dumbbell, path: '/training' },
  { id: 'activities', label: 'アクティビティ', icon: Activity, path: '/activities' },
  { id: 'race', label: 'レース', icon: Trophy, path: '/race' },
  { id: 'ai-coach', label: 'AIコーチ', icon: BotMessageSquare, path: '/ai-coach' },
  { id: 'news', label: 'ニュース', icon: Newspaper, path: '/news' },
  { id: 'settings', label: '設定', icon: Settings, path: '/settings' }
];

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const today = "2026年1月10日（金）";

  // Determine active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname;
    const matchedTab = navTabs.find(tab => {
      if (tab.path === '/') return path === '/';
      return path.startsWith(tab.path);
    });
    return matchedTab?.id || 'home';
  };

  const activeTab = getActiveTab();

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    const tab = navTabs.find(t => t.id === tabId);
    if (tab) {
      navigate(tab.path);
    }
  };

  // Determine if we should show the header
  const shouldShowHeader = () => {
    // Don't show header on news screen
    if (location.pathname.startsWith('/news')) return false;
    // Don't show header on AI coach screen (it has its own)
    if (location.pathname.startsWith('/ai-coach')) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Mobile Container */}
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        {/* Conditional Header */}
        {shouldShowHeader() && <Header date={today} />}

        {/* Main Content Area */}
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/training" element={<TrainingScreen />} />
          <Route path="/training/:screen" element={<TrainingScreen />} />
          <Route path="/training/:screen/:id" element={<TrainingScreen />} />
          <Route path="/activities" element={<ActivitiesScreen />} />
          <Route path="/activities/:id" element={<ActivitiesScreen />} />
          <Route path="/race" element={<RaceScreen />} />
          <Route path="/race/:screen" element={<RaceScreen />} />
          <Route path="/ai-coach" element={<AICoachScreen />} />
          <Route path="/news" element={<NewsScreen />} />
          <Route path="/news/:id" element={<NewsScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>

        {/* Fixed Bottom Navigation Bar */}
        <BottomNav 
          tabs={navTabs.map(({ id, label, icon }) => ({ id, label, icon }))} 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
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
