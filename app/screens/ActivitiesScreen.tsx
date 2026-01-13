import React from 'react';
import { AllSessionsScreen } from '../components/activities/AllSessionsScreen';
import { ActivityDetailScreen } from '../components/activities/ActivityDetailScreen';
import { useNavigate, useParams } from 'react-router-dom';

export function ActivitiesScreen() {
  const navigate = useNavigate();
  const { id } = useParams();

  if (id) {
    return (
      <ActivityDetailScreen
        activityId={id}
        onBack={() => navigate('/activities')}
      />
    );
  }

  return (
    <AllSessionsScreen
      onBack={() => navigate('/')}
      onActivityClick={(activityId) => navigate(`/activities/${activityId}`)}
    />
  );
}
