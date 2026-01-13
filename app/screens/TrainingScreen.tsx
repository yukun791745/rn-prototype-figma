import React from 'react';
import { TrainingDashboardScreen } from '../components/training/TrainingDashboardScreen';
import { WeeklyScheduleScreen } from '../components/training/WeeklyScheduleScreen';
import { SessionDetailScreen } from '../components/training/SessionDetailScreen';
import { TrainingPlanScreen } from '../components/training/TrainingPlanScreen';
import { TrainingOverviewScreen } from '../components/training/TrainingOverviewScreen';
import { AllSessionsScreen } from '../components/activities/AllSessionsScreen';
import { ActivityDetailScreen } from '../components/activities/ActivityDetailScreen';
import { PeriodSelection } from '../components/training/types';

export function TrainingScreen() {
  const [trainingScreen, setTrainingScreen] = React.useState<
    'dashboard' | 'schedule' | 'session' | 'plan' | 'overview' | 'allSessions' | 'activityDetail'
  >('dashboard');
  const [selectedSessionId, setSelectedSessionId] = React.useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = React.useState<string | null>(null);

  const [selectedPeriod, setSelectedPeriod] = React.useState<PeriodSelection>({
    preset: '2weeks'
  });

  const ctl = 87;
  const ctlDelta = 3;
  const atl = 62;
  const atlDelta = -8;
  const tsb = 25;
  const tsbDelta = 11;

  if (trainingScreen === 'dashboard') {
    return (
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
    );
  }

  if (trainingScreen === 'schedule') {
    return (
      <WeeklyScheduleScreen
        onBack={() => setTrainingScreen('dashboard')}
        onSessionClick={(id) => {
          setSelectedSessionId(id);
          setTrainingScreen('session');
        }}
      />
    );
  }

  if (trainingScreen === 'session') {
    return (
      <SessionDetailScreen
        sessionId={selectedSessionId || ''}
        onBack={() => setTrainingScreen('dashboard')}
      />
    );
  }

  if (trainingScreen === 'plan') {
    return (
      <TrainingPlanScreen
        onBack={() => setTrainingScreen('dashboard')}
      />
    );
  }

  if (trainingScreen === 'overview') {
    return (
      <TrainingOverviewScreen
        onBack={() => setTrainingScreen('dashboard')}
        initialPeriod={selectedPeriod}
      />
    );
  }

  if (trainingScreen === 'allSessions') {
    return (
      <AllSessionsScreen
        onBack={() => setTrainingScreen('dashboard')}
        onActivityClick={(id) => {
          setSelectedActivityId(id);
          setTrainingScreen('activityDetail');
        }}
      />
    );
  }

  return (
    <ActivityDetailScreen
      activityId={selectedActivityId || ''}
      onBack={() => setTrainingScreen('dashboard')}
    />
  );
}
