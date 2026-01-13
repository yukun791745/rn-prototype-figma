import React from 'react';
import { RaceOverviewScreen } from '../components/race/RaceOverviewScreen';
import { RaceSelectionScreen, SelectedRace } from '../components/race/RaceSelectionScreen';
import { RaceGoalSettingScreen } from '../components/race/RaceGoalSettingScreen';
import { NutritionPlanningScreen } from '../components/race/NutritionPlanningScreen';
import { useNavigate, useParams } from 'react-router-dom';
import { safeGetLocalStorage } from '../utils/localStorage';

export function RaceScreen() {
  const navigate = useNavigate();
  const { screen } = useParams();

  // Selected races state - to persist selected races across screens
  // Load from localStorage on mount with safe parsing
  const [selectedRaces, setSelectedRaces] = React.useState<SelectedRace[]>(() => {
    return safeGetLocalStorage<SelectedRace[]>('selectedRaces', []);
  });

  // Save selected races to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('selectedRaces', JSON.stringify(selectedRaces));
  }, [selectedRaces]);

  const currentScreen = screen || 'overview';

  if (currentScreen === 'selection') {
    return (
      <RaceSelectionScreen
        onBack={() => navigate('/race')}
        onRacesSelected={(races) => {
          setSelectedRaces(races);
          navigate('/race');
        }}
        initialSelectedRaces={selectedRaces}
      />
    );
  }

  if (currentScreen === 'goal-setting') {
    return (
      <RaceGoalSettingScreen
        onBack={() => navigate('/race')}
        onProceedToNutrition={() => navigate('/race/nutrition')}
        selectedGoal={localStorage.getItem('raceGoalScenario')}
        previousMessages={safeGetLocalStorage<any[]>('raceGoalMessages', []).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))}
        previousMetrics={safeGetLocalStorage<any>('raceGoalMetrics', null)}
        previousConditions={safeGetLocalStorage<any>('raceGoalConditions', null)}
        previousConfirmedSections={safeGetLocalStorage<any>('raceGoalConfirmedSections', null)}
      />
    );
  }

  if (currentScreen === 'nutrition') {
    return (
      <NutritionPlanningScreen
        onBack={() => navigate('/race/goal-setting')}
      />
    );
  }

  // Default to overview
  return (
    <RaceOverviewScreen
      onSelectRaces={() => navigate('/race/selection')}
      onSetGoal={() => navigate('/race/goal-setting')}
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
  );
}
