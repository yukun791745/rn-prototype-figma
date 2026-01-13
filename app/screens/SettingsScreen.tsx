import React from 'react';
import { SettingsScreen as SettingsComponent } from '../components/settings/SettingsScreen';
import { useNavigate } from 'react-router-dom';

export function SettingsScreen() {
  const navigate = useNavigate();

  return (
    <SettingsComponent onBack={() => navigate('/')} />
  );
}
