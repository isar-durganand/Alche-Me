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
  Flame, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  User, 
  Award,
  Zap,
  HelpCircle
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ParticleCanvas } from '../ui/ParticleCanvas';
import { progressAdapter, PlayerProfile } from '../../infrastructure/persistence/progressAdapter';
import { soundEngine } from '../../infrastructure/audio/soundEngine';
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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState<PlayerProfile>(progressAdapter.getPlayerProfile());

  useEffect(() => {
    return progressAdapter.subscribe(() => {
      setProfile(progressAdapter.getPlayerProfile());
    });
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setMuted(!next);
    if (next) {
      soundEngine.playTap();
    }
  };

  const navItems = [
    {
      id: 'hub' as NavRoute,
      label: 'Home & Hub',
      icon: <Home className="w-4 h-4 shrink-0" />,
      badge: 'Main',
    },
    {
      id: 'worlds' as NavRoute,
      label: 'Adventure Worlds',
      icon: <Compass className="w-4 h-4 shrink-0" />,
      badge: '8 Worlds',
    },
    {
      id: 'periodic-table' as NavRoute,
      label: 'Periodic Table',
      icon: <Atom className="w-4 h-4 shrink-0" />,
      badge: '118 Elements',
    },
    {
      id: 'virtual-lab' as NavRoute,
      label: 'Virtual Laboratory',
      icon: <FlaskConical className="w-4 h-4 shrink-0" />,
      badge: '10 Practicals',
    },
    {
      id: 'settings' as NavRoute,
      label: 'Settings & Health',
      icon: <SettingsIcon className="w-4 h-4 shrink-0" />,
    },
  ];

  const handleNavClick = (route: NavRoute) => {
    soundEngine.playTap();
    onRouteChange(route);
    setMobileMenuOpen(false);
  };

  const activeItem = navItems.find((n) => n.id === currentRoute);

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#0B1F2A] flex flex-col font-sans select-none relative">
      {/* Ambient Animated Chemistry Particle Canvas */}
      <ParticleCanvas />

      {/* Skip to Content for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00C2D1] focus:text-white focus:font-montserrat focus:font-bold focus:rounded-xl focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Main Layout Grid */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar (Permanent) */}
        <aside
          aria-label="Desktop Navigation"
          className="hidden md:flex flex-col w-64 border-r-2 border-slate-200/90 bg-white shrink-0 z-20 shadow-[2px_0_12px_rgba(11,31,42,0.03)]"
        >
          {/* Logo & Brand Header */}
          <div className="h-20 flex items-center gap-3 px-5 border-b-2 border-slate-100 bg-white">
            <div className="relative group cursor-pointer" onClick={() => handleNavClick('hub')}>
              <img
                src="/assets/branding/Alche-Me Logo.png"
                alt="Alche-Me Logo"
                className="w-11 h-11 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-montserrat font-extrabold text-lg tracking-tight text-[#0B1F2A] leading-tight">
                ALCHE-ME
              </span>
              <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-[#00C2D1]">
                Chemistry Adventure
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav aria-label="Main Navigation" className="p-3 space-y-1.5 flex-1">
            <div className="px-3 py-2 text-[10px] font-montserrat font-extrabold uppercase tracking-wider text-slate-400">
              Game Navigation
            </div>
            {navItems.map((item) => {
              const isActive = item.id === currentRoute;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#00C2D1] text-white border-b-2 border-[#008E9B] shadow-sm shadow-teal-500/20 translate-y-[-1px]'
                      : 'text-slate-600 hover:text-[#0B1F2A] hover:bg-slate-100/80 active:translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-montserrat font-extrabold ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 px-3 py-2 text-[10px] font-montserrat font-extrabold uppercase tracking-wider text-slate-400">
              Future Realms
            </div>
            <div className="p-3 rounded-xl border-2 border-slate-100 bg-slate-50/70 text-[11px] font-medium text-slate-500 space-y-2">
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
          <div className="p-4 border-t-2 border-slate-100 bg-slate-50/50 space-y-2 text-xs">
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-full p-3 rounded-xl border-2 border-slate-200/80 bg-white hover:border-[#00C2D1] shadow-sm transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-[#00C2D1] font-montserrat font-extrabold text-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                  {profile.level}
                </div>
                <div className="text-left">
                  <span className="font-montserrat font-bold text-xs block text-[#0B1F2A] truncate max-w-[100px]">
                    {profile.displayName}
                  </span>
                  <span className="text-[10px] font-montserrat font-extrabold text-[#F5B942] flex items-center gap-0.5">
                    <Zap className="w-3 h-3 fill-current" /> {profile.xp} XP
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00C2D1] transition-colors" />
            </button>
          </div>
        </aside>

        {/* Mobile / Tablet Top Header & Game HUD */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-20 border-b-2 border-slate-200/90 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-[0_2px_10px_rgba(11,31,42,0.03)]">
            {/* Mobile Hamburger + Title */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:text-[#0B1F2A] hover:bg-slate-100 cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-montserrat font-extrabold text-base text-[#0B1F2A] hidden sm:inline">
                  Alche-Me
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:inline" />
                <span className="font-montserrat font-bold text-sm text-[#00C2D1]">
                  {activeItem?.label}
                </span>
              </div>
            </div>

            {/* Gamified HUD Top Bar Elements */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Daily Streak Flame */}
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200/80 text-orange-600 shadow-sm"
                title="Current Daily Streak"
              >
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
                <span className="font-montserrat font-extrabold text-xs text-orange-700">
                  {profile.streakDays} {profile.streakDays === 1 ? 'Day' : 'Days'}
                </span>
              </div>

              {/* Energy / XP Gold Pill */}
              <button
                type="button"
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border-2 border-amber-300/80 hover:bg-amber-100 transition-colors cursor-pointer shadow-sm"
                title="Scholar XP & Level Progress"
              >
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="font-montserrat font-extrabold text-xs text-amber-900">
                  {profile.xp} XP
                </span>
                <span className="text-[10px] font-montserrat font-bold px-1.5 py-0.2 rounded-full bg-amber-200/60 text-amber-950">
                  Lvl {profile.level}
                </span>
              </button>

              {/* Sound Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSound}
                title={soundEnabled ? 'Mute Game Audio' : 'Unmute Game Audio'}
                aria-label={soundEnabled ? 'Mute audio' : 'Unmute audio'}
                className="p-2 min-h-0 text-slate-600 hover:text-[#0B1F2A]"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-teal-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
              </Button>
            </div>
          </header>

          {/* Mobile Drawer (When Open) */}
          {mobileMenuOpen && (
            <div
              className="md:hidden fixed inset-0 top-20 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in"
              onClick={() => setMobileMenuOpen(false)}
            >
              <nav
                aria-label="Mobile Navigation Drawer"
                className="w-4/5 max-w-sm h-full bg-white border-r-2 border-slate-200 p-4 space-y-2 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 text-[11px] font-montserrat font-extrabold uppercase tracking-wider text-slate-400">
                  Game Navigation
                </div>
                {navItems.map((item) => {
                  const isActive = item.id === currentRoute;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-montserrat font-bold transition-all ${
                        isActive
                          ? 'bg-[#00C2D1] text-white border-b-2 border-[#008E9B] shadow-sm'
                          : 'text-slate-600 hover:text-[#0B1F2A] hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-montserrat font-extrabold">
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
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t-2 border-slate-200 px-4 flex items-center justify-around z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"
      >
        {navItems.map((item) => {
          const isActive = item.id === currentRoute;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#00C2D1] font-montserrat font-extrabold scale-105'
                  : 'text-slate-500 hover:text-[#0B1F2A]'
              }`}
            >
              {item.icon}
              <span className="text-[9px] font-montserrat font-bold tracking-tight truncate max-w-full">
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
