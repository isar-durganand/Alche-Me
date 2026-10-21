import React, { useState } from 'react';
import { AppShell, NavRoute } from './components/layout/AppShell';
import { HubScreen } from './features/hub/HubScreen';
import { WorldMapScreen } from './features/worlds/WorldMapScreen';
import { WorldOverviewScreen } from './features/worlds/WorldOverviewScreen';
import { PeriodicTableScreen } from './features/periodic-table/PeriodicTableScreen';
import { VirtualLabScreen } from './features/virtual-lab/VirtualLabScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';
import { WorldSchema } from './domain/types/curriculum';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<NavRoute>('hub');
  const [selectedWorld, setSelectedWorld] = useState<WorldSchema | null>(null);

  const handleSelectWorld = (world: WorldSchema) => {
    setSelectedWorld(world);
  };

  const handleBackToWorldsMap = () => {
    setSelectedWorld(null);
  };

  const handleNavigate = (route: NavRoute) => {
    setSelectedWorld(null);
    setCurrentRoute(route);
  };

  const renderScreen = () => {
    switch (currentRoute) {
      case 'hub':
        return <HubScreen onNavigate={handleNavigate} />;
      case 'worlds':
        if (selectedWorld) {
          return (
            <WorldOverviewScreen
              world={selectedWorld}
              onBack={handleBackToWorldsMap}
            />
          );
        }
        return <WorldMapScreen onSelectWorld={handleSelectWorld} />;
      case 'periodic-table':
        return <PeriodicTableScreen />;
      case 'virtual-lab':
        return <VirtualLabScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HubScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <AppShell currentRoute={currentRoute} onRouteChange={handleNavigate}>
      {renderScreen()}
    </AppShell>
  );
};

export default App;
