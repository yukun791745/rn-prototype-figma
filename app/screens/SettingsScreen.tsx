import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsScreen as SettingsComponent } from '../components/settings/SettingsScreen';

export function SettingsScreen() {
  const navigate = useNavigate();
  
  return <SettingsComponent onBack={() => navigate('/')} />;
}
