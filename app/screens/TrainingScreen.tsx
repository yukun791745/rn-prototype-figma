import React from 'react';
import { TrainingDashboardScreen } from '../components/training/TrainingDashboardScreen';
import { WeeklyScheduleScreen } from '../components/training/WeeklyScheduleScreen';
import { SessionDetailScreen } from '../components/training/SessionDetailScreen';
import { TrainingPlanScreen } from '../components/training/TrainingPlanScreen';
import { TrainingOverviewScreen } from '../components/training/TrainingOverviewScreen';
import { AllSessionsScreen } from '../components/activities/AllSessionsScreen';
import { ActivityDetailScreen } from '../components/activities/ActivityDetailScreen';
import { PeriodSelection } from '../components/training/types';
import { useNavigate, useParams } from 'react-router-dom';

export function TrainingScreen() {
  const navigate = useNavigate();
  const { screen, id } = useParams();
  
  // データ
  const ctl = 87;
  const ctlDelta = 3;
  const atl = 62;
  const atlDelta = -8;
  const tsb = 25;
  const tsbDelta = 11;

  // Period selection state - shared between training dashboard and overview
  const [selectedPeriod, setSelectedPeriod] = React.useState<PeriodSelection>({
    preset: '2weeks'
  });

  // Determine which screen to show based on route params
  const currentScreen = screen || 'dashboard';
  const itemId = id || '';

  if (currentScreen === 'schedule') {
    return (
      <WeeklyScheduleScreen
        onBack={() => navigate('/training')}
        onSessionClick={(sessionId) => navigate(`/training/session/${sessionId}`)}
      />
    );
  }

  if (currentScreen === 'session') {
    return (
      <SessionDetailScreen
        sessionId={itemId}
        onBack={() => navigate('/training')}
      />
    );
  }

  if (currentScreen === 'plan') {
    return (
      <TrainingPlanScreen
        onBack={() => navigate('/training')}
      />
    );
  }

  if (currentScreen === 'overview') {
    return (
      <TrainingOverviewScreen
        onBack={() => navigate('/training')}
        initialPeriod={selectedPeriod}
      />
    );
  }

  if (currentScreen === 'all-sessions') {
    return (
      <AllSessionsScreen
        onBack={() => navigate('/training')}
        onActivityClick={(activityId) => navigate(`/training/activity/${activityId}`)}
      />
    );
  }

  if (currentScreen === 'activity') {
    return (
      <ActivityDetailScreen
        activityId={itemId}
        onBack={() => navigate('/training')}
      />
    );
  }

  // Default to dashboard
  return (
    <TrainingDashboardScreen
      currentCTL={ctl}
      currentATL={atl}
      currentTSB={tsb}
      ctlDelta={ctlDelta}
      atlDelta={atlDelta}
      tsbDelta={tsbDelta}
      onViewSchedule={() => navigate('/training/schedule')}
      onViewAllSessions={() => navigate('/training/all-sessions')}
      onViewPlan={() => navigate('/training/plan')}
      onViewOverview={() => navigate('/training/overview')}
      onSessionClick={(sessionId) => navigate(`/training/activity/${sessionId}`)}
      selectedPeriod={selectedPeriod}
      onPeriodChange={setSelectedPeriod}
    />
  );
}
