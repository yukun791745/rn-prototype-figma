import React from 'react';
import { AICoachCard } from '../components/dashboard/AICoachCard';
import { FitnessMetricsCard } from '../components/dashboard/FitnessMetricsCard';
import { RecentActivityCard } from '../components/dashboard/RecentActivityCard';
import { UpcomingRacesCard } from '../components/dashboard/UpcomingRacesCard';
import { NewsCard } from '../components/dashboard/NewsCard';
import { useNavigate } from 'react-router-dom';

export function HomeScreen() {
  const navigate = useNavigate();

  // データ
  const ctl = 87;
  const ctlDelta = 3;
  const atl = 62;
  const atlDelta = -8;
  const tsb = 25;
  const tsbDelta = 11;

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

  return (
    <main className="space-y-3 pb-20 px-4 pt-3">
      <AICoachCard
        comment="今日はコンディション良好。高強度トレーニングに最適です。レース前の勢いを維持するため、テンポランを推奨します。"
        onConsultClick={() => navigate('/ai-coach')}
      />

      <FitnessMetricsCard
        ctl={ctl}
        ctlDelta={ctlDelta}
        atl={atl}
        atlDelta={atlDelta}
        tsb={tsb}
        tsbDelta={tsbDelta}
        onDetailClick={() => navigate('/training')}
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
          navigate('/activities');
        }}
      />

      <UpcomingRacesCard 
        races={upcomingRaces}
        onViewAllClick={() => navigate('/race')}
      />

      <NewsCard 
        news={news} 
        onViewAllClick={() => navigate('/news')}
        onNewsItemClick={(item) => {
          if (item.language === 'en') {
            navigate('/news');
          } else {
            console.log('Opening article:', item.url);
          }
        }}
      />
    </main>
  );
}
