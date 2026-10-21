import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Compass, 
  Atom, 
  FlaskConical, 
  Settings as SettingsIcon, 
  Layers, 
  BookOpen, 
  Sparkles, 
  Menu, 
  X, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Search,
  ExternalLink,
  ChevronRight,
  User,
  Award
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { progressAdapter, PlayerProfile } from '../../infrastructure/persistence/progressAdapter';
import { ProfileModal } from '../../features/profile/ProfileModal';

export type NavRoute = 'hub' | 'worlds' | 'periodic-table' | 'virtual-lab' | 'settings';

export interface AppShellProps {
  currentRoute: NavRoute;
  onRouteChange: (route: NavRoute) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentRoute,
  onRouteChange,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState<PlayerProfile>(progressAdapter.getPlayerProfile());

  useEffect(() => {
    return progressAdapter.subscribe(() => {
      setProfile(progressAdapter.getPlayerProfile());
    });
  }, []);

  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast);
    if (!isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const navItems = [
    {
      id: 'hub' as NavRoute,
      label: 'Home & Hub',
      icon: <Home className="w-4 h-4" />,
      badge: 'v0.1',
    },
    {
      id: 'worlds' as NavRoute,
      label: 'Adventure Worlds',
      icon: <Compass className="w-4 h-4" />,
      badge: '6 Realms',
    },
    {
      id: 'periodic-table' as NavRoute,
      label: 'Periodic Table',
      icon: <Atom className="w-4 h-4" />,
      badge: 'Elements',
    },
    {
      id: 'virtual-lab' as NavRoute,
      label: 'Virtual Laboratory',
      icon: <FlaskConical className="w-4 h-4" />,
      badge: '10 Practicals',
    },
    {
      id: 'settings' as NavRoute,
      label: 'Settings & Health',
      icon: <SettingsIcon className="w-4 h-4" />,
    },
  ];

  const handleNavClick = (route: NavRoute) => {
    onRouteChange(route);
    setMobileMenuOpen(false);
  };

  const activeItem = navItems.find((n) => n.id === currentRoute);

  return (
    <div className="min-h-screen bg-[var(--cq-bg)] text-[var(--cq-text)] flex flex-col font-sans">
      {/* Skip to Content for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--cq-accent)] focus:text-black focus:font-semibold focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Main Layout Grid */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar (Permanent) */}
        <aside
          aria-label="Desktop Navigation"
          className="hidden md:flex flex-col w-64 border-r border-[var(--cq-border)] bg-[var(--cq-surface)] shrink-0 z-20"
        >
          {/* Logo & Brand Header */}
          <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--cq-border)]">
            <img
              src="/assets/branding/alche-me-mark.svg"
              alt="Alche-Me Logo"
              className="w-8 h-8 rounded-lg border border-[var(--cq-border)] p-0.5 bg-[var(--cq-surface-raised)]"
            />
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-[var(--cq-text)]">
                Alche-Me
              </span>
              <span className="text-[10px] text-[var(--cq-text-muted)] font-mono">
                Scientific Adventure
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav aria-label="Main Navigation" className="p-3 space-y-1.5 flex-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--cq-text-muted)]">
              Core Navigation
            </div>
            {navItems.map((item) => {
              const isActive = item.id === currentRoute;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--cq-accent)] text-[#101317] font-semibold shadow-sm'
                      : 'text-[var(--cq-text-muted)] hover:text-[var(--cq-text)] hover:bg-[var(--cq-surface-raised)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                        isActive
                          ? 'bg-black/20 text-[#101317]'
                          : 'bg-[var(--cq-surface-raised)] text-[var(--cq-text-muted)] border border-[var(--cq-border)]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--cq-text-muted)]">
              Roadmap Modules
            </div>
            <div className="px-3 py-2 rounded-lg border border-[var(--cq-border)]/50 bg-[var(--cq-surface-raised)]/50 text-[11px] text-[var(--cq-text-muted)] space-y-1.5">
              <div className="flex items-center justify-between">
                <span>Molecule Studio</span>
                <Badge size="sm" variant="neutral">Phase 08</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Domain Engine</span>
                <Badge size="sm" variant="neutral">Phase 05</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Cloud Sync</span>
                <Badge size="sm" variant="neutral">Phase 04</Badge>
              </div>
            </div>
          </nav>

          {/* Sidebar Footer Info */}
          <div className="p-4 border-t border-[var(--cq-border)] space-y-2 text-xs">
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-full p-2.5 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] hover:border-[var(--cq-accent)] transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[var(--cq-accent-subtle)] text-[var(--cq-accent)] font-bold text-xs flex items-center justify-center">
                  {profile.level}
                </div>
                <div className="text-left">
                  <span className="font-semibold text-xs block text-[var(--cq-text)] truncate max-w-[100px]">
                    {profile.displayName}
                  </span>
                  <span className="text-[10px] text-[var(--cq-accent)] font-mono">{profile.xp} XP</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--cq-text-muted)]" />
            </button>
          </div>
        </aside>

        {/* Mobile / Tablet Top Header */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b border-[var(--cq-border)] bg-[var(--cq-surface)] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
            {/* Mobile Hamburger + Title */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-[var(--cq-text-muted)] hover:text-[var(--cq-text)] hover:bg-[var(--cq-surface-raised)] cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-2 text-xs text-[var(--cq-text-muted)]">
                <span className="font-semibold text-[var(--cq-text)] hidden sm:inline">Alche-Me</span>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--cq-border)] hidden sm:inline" />
                <span className="text-[var(--cq-accent)] font-medium">{activeItem?.label}</span>
              </div>
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center gap-2.5">
              {/* Profile XP Pill */}
              <button
                type="button"
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] hover:border-[var(--cq-accent)] transition-colors text-xs cursor-pointer"
                title="View Scholar Profile & Quests"
              >
                <Award className="w-3.5 h-3.5 text-[var(--cq-accent)]" />
                <span className="font-semibold text-[var(--cq-text)]">Lvl {profile.level}</span>
                <span className="text-[10px] font-mono text-[var(--cq-accent)]">{profile.xp} XP</span>
              </button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleHighContrast}
                title="Toggle High Contrast Mode"
                aria-label="Toggle High Contrast"
                className="text-xs"
              >
                {isHighContrast ? <Sun className="w-4 h-4 text-[var(--cq-warning)]" /> : <Moon className="w-4 h-4" />}
                <span className="hidden sm:inline">{isHighContrast ? 'Standard' : 'Contrast'}</span>
              </Button>
            </div>
          </header>

          {/* Mobile Drawer (When Open) */}
          {mobileMenuOpen && (
            <div
              className="md:hidden fixed inset-0 top-16 z-40 bg-black/80 backdrop-blur-sm animate-in fade-in"
              onClick={() => setMobileMenuOpen(false)}
            >
              <nav
                aria-label="Mobile Navigation Drawer"
                className="w-4/5 max-w-sm h-full bg-[var(--cq-surface)] border-r border-[var(--cq-border)] p-4 space-y-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--cq-text-muted)]">
                  Navigation
                </div>
                {navItems.map((item) => {
                  const isActive = item.id === currentRoute;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[var(--cq-accent)] text-[#101317] font-semibold'
                          : 'text-[var(--cq-text-muted)] hover:text-white hover:bg-[var(--cq-surface-raised)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/20 font-mono">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Main Content Workspace */}
          <main id="main-content" tabIndex={-1} className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8 focus:outline-none">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Thumb Navigation Bar */}
      <nav
        aria-label="Mobile Quick Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--cq-surface)] border-t border-[var(--cq-border)] px-4 flex items-center justify-around z-30"
      >
        {navItems.map((item) => {
          const isActive = item.id === currentRoute;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'text-[var(--cq-accent)] font-semibold'
                  : 'text-[var(--cq-text-muted)] hover:text-[var(--cq-text)]'
              }`}
            >
              {item.icon}
              <span className="text-[9px] tracking-tight truncate max-w-full">
                {item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Profile & Achievements Modal */}
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
};
