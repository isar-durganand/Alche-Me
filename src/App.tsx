import React, { useState } from 'react';
import { AppShell, NavRoute } from './components/layout/AppShell';
import { HubScreen } from './features/hub/HubScreen';
import { WorldMapScreen } from './features/worlds/WorldMapScreen';
import { WorldOverviewScreen } from './features/worlds/WorldOverviewScreen';
import { PeriodicTableScreen } from './features/periodic-table/PeriodicTableScreen';
import { VirtualLabScreen } from './features/virtual-lab/VirtualLabScreen';
import { MoleculeStudioScreen } from './features/molecule-studio/MoleculeStudioScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';
import { WorldSchema } from './domain/types/curriculum';

export const App: React.FC = () => {
  const getInitialRoute = (): NavRoute => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '') as NavRoute;
      if (['hub', 'worlds', 'periodic-table', 'virtual-lab', 'molecule-studio', 'settings'].includes(hash)) {
        return hash;
      }
    }
    return 'hub';
  };

  const [currentRoute, setCurrentRoute] = useState<NavRoute>(getInitialRoute);
  const [selectedWorld, setSelectedWorld] = useState<WorldSchema | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Sync hash changes
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as NavRoute;
      if (['hub', 'worlds', 'periodic-table', 'virtual-lab', 'molecule-studio', 'settings'].includes(hash)) {
        setCurrentRoute(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectWorld = (world: WorldSchema) => {
    setSelectedWorld(world);
  };

  const handleBackToWorldsMap = () => {
    setSelectedWorld(null);
  };

  const handleNavigate = (route: NavRoute) => {
    setSelectedWorld(null);
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      window.location.hash = route;
    }
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
      case 'molecule-studio':
        return (
          <MoleculeStudioScreen 
            onNavigate={handleNavigate} 
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />
        );
      case 'virtual-lab':
        return <VirtualLabScreen onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HubScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <AppShell 
      currentRoute={currentRoute} 
      onRouteChange={handleNavigate}
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
    >
      {renderScreen()}
    </AppShell>
  );
};

export default App;
