import React from 'react';
import { AllSessionsScreen } from '../components/activities/AllSessionsScreen';
import { ActivityDetailScreen } from '../components/activities/ActivityDetailScreen';

export function ActivitiesScreen() {
  const [selectedActivityId, setSelectedActivityId] = React.useState<string | null>(null);

  if (selectedActivityId) {
    return (
      <ActivityDetailScreen
        activityId={selectedActivityId}
        onBack={() => setSelectedActivityId(null)}
      />
    );
  }

  return (
    <AllSessionsScreen
      onBack={() => {}}
      onActivityClick={(id) => setSelectedActivityId(id)}
    />
  );
}
