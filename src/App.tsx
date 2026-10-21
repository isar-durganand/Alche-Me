import React, { useState } from 'react';
import { AppShell, NavRoute } from './components/layout/AppShell';
import { HubScreen } from './features/hub/HubScreen';
import { PeriodicTableScreen } from './features/periodic-table/PeriodicTableScreen';
import { VirtualLabScreen } from './features/virtual-lab/VirtualLabScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<NavRoute>('hub');

  const renderScreen = () => {
    switch (currentRoute) {
      case 'hub':
        return <HubScreen onNavigate={setCurrentRoute} />;
      case 'periodic-table':
        return <PeriodicTableScreen />;
      case 'virtual-lab':
        return <VirtualLabScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HubScreen onNavigate={setCurrentRoute} />;
    }
  };

  return (
    <AppShell currentRoute={currentRoute} onRouteChange={setCurrentRoute}>
      {renderScreen()}
    </AppShell>
  );
};

export default App;
