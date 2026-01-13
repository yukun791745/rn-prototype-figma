import React from 'react';
import { RaceSelectionScreen, SelectedRace } from '../components/race/RaceSelectionScreen';
import { RaceOverviewScreen } from '../components/race/RaceOverviewScreen';
import { RaceGoalSettingScreen } from '../components/race/RaceGoalSettingScreen';
import { NutritionPlanningScreen } from '../components/race/NutritionPlanningScreen';

export function RaceScreen() {
  const [raceScreen, setRaceScreen] = React.useState<'overview' | 'selection' | 'goal-setting' | 'nutrition'>('overview');
  
  const [selectedRaces, setSelectedRaces] = React.useState<SelectedRace[]>(() => {
    const saved = localStorage.getItem('selectedRaces');
    return saved ? JSON.parse(saved) : [];
  });
  
  React.useEffect(() => {
    localStorage.setItem('selectedRaces', JSON.stringify(selectedRaces));
  }, [selectedRaces]);
  
  const [selectedRaceForGoal, setSelectedRaceForGoal] = React.useState<any | null>(null);

  if (raceScreen === 'overview') {
    return (
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
    );
  }

  if (raceScreen === 'selection') {
    return (
      <RaceSelectionScreen
        onBack={() => setRaceScreen('overview')}
        onRacesSelected={(races) => {
          setSelectedRaces(races);
          setRaceScreen('overview');
        }}
        initialSelectedRaces={selectedRaces}
      />
    );
  }

  if (raceScreen === 'goal-setting') {
    return (
      <RaceGoalSettingScreen
        onBack={() => setRaceScreen('overview')}
        onProceedToNutrition={() => {
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
    );
  }

  return (
    <NutritionPlanningScreen
      onBack={() => setRaceScreen('goal-setting')}
    />
  );
}
