import React from 'react';
import { RaceOverviewScreen } from '../components/race/RaceOverviewScreen';
import { RaceSelectionScreen, SelectedRace } from '../components/race/RaceSelectionScreen';
import { RaceGoalSettingScreen } from '../components/race/RaceGoalSettingScreen';
import { NutritionPlanningScreen } from '../components/race/NutritionPlanningScreen';
import { useNavigate, useParams } from 'react-router-dom';

export function RaceScreen() {
  const navigate = useNavigate();
  const { screen } = useParams();

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
        previousMessages={JSON.parse(localStorage.getItem('raceGoalMessages') || '[]').map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))}
        previousMetrics={JSON.parse(localStorage.getItem('raceGoalMetrics') || 'null')}
        previousConditions={JSON.parse(localStorage.getItem('raceGoalConditions') || 'null')}
        previousConfirmedSections={JSON.parse(localStorage.getItem('raceGoalConfirmedSections') || 'null')}
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
