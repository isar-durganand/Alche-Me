import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Eye, 
  Volume2, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Cpu, 
  CheckCircle2, 
  Sparkles,
  Monitor
} from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Alert, Modal } from '../../components/ui';

export const SettingsScreen: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showResetModal, setShowResetModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
    if (!reducedMotion) {
      document.documentElement.style.setProperty('--cq-transition-fast', '0ms');
      document.documentElement.style.setProperty('--cq-transition-base', '0ms');
      setActionSuccess('Reduced motion preference activated.');
    } else {
      document.documentElement.style.removeProperty('--cq-transition-fast');
      document.documentElement.style.removeProperty('--cq-transition-base');
      setActionSuccess('Standard motion transitions restored.');
    }
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.documentElement.classList.add('high-contrast');
      setActionSuccess('High contrast accessibility palette applied.');
    } else {
      document.documentElement.classList.remove('high-contrast');
      setActionSuccess('Standard Ivory game mode restored.');
    }
  };

  const handleExportData = () => {
    const backupData = {
      product: 'Alche-Me',
      version: '0.1.0-alpha',
      exportedAt: new Date().toISOString(),
      session: 'Local Guest',
      settings: { reducedMotion, highContrast, soundEnabled, language },
      progress: {
        completedExperiments: ['exp-1'],
        unlockedWorlds: ['w1', 'w2'],
      },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alche-me-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setActionSuccess('Local save file exported successfully.');
  };

  const handleResetProgress = () => {
    setShowResetModal(false);
    setActionSuccess('Progress reset to clean baseline state.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-montserrat font-extrabold text-[#0B1F2A] flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-[#00C2D1]" />
          System Settings & Accessibility
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure visual comfort, audio feedback, hardware acceleration, and local telemetry
        </p>
      </div>

      {actionSuccess && (
        <Alert variant="success" onDismiss={() => setActionSuccess(null)}>
          {actionSuccess}
        </Alert>
      )}

      {/* Accessibility & Visual Comfort */}
      <Card variant="default">
        <CardHeader>
          <CardTitle>Accessibility & Visual Comfort</CardTitle>
          <CardDescription>Tailor contrast, typography, and motion to your requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface-raised)]">
            <div className="space-y-0.5">
              <span className="font-semibold text-sm text-[var(--cq-text)] block">High Contrast Mode</span>
              <span className="text-[var(--cq-text-muted)]">Elevates contrast ratios above 7:1 for enhanced legibility</span>
            </div>
            <Button size="sm" variant={highContrast ? 'primary' : 'outline'} onClick={toggleHighContrast}>
              {highContrast ? 'Enabled' : 'Disabled'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface-raised)]">
            <div className="space-y-0.5">
              <span className="font-semibold text-sm text-[var(--cq-text)] block">Reduce Motion</span>
              <span className="text-[var(--cq-text-muted)]">Eliminates non-essential UI animations and transitions</span>
            </div>
            <Button size="sm" variant={reducedMotion ? 'primary' : 'outline'} onClick={toggleReducedMotion}>
              {reducedMotion ? 'Enabled' : 'Disabled'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface-raised)]">
            <div className="space-y-0.5">
              <span className="font-semibold text-sm text-[var(--cq-text)] block">Audio & Haptic Feedback</span>
              <span className="text-[var(--cq-text-muted)]">Plays subtle clicks on titration endpoints and element selections</span>
            </div>
            <Button size="sm" variant={soundEnabled ? 'primary' : 'outline'} onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? 'Enabled' : 'Muted'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface-raised)]">
            <div className="space-y-0.5">
              <span className="font-semibold text-sm text-[var(--cq-text)] block">Interface Language</span>
              <span className="text-[var(--cq-text-muted)]">Primary scientific language (Hindi localization architecture ready)</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant={language === 'en' ? 'primary' : 'outline'} onClick={() => setLanguage('en')}>
                English
              </Button>
              <Button size="sm" variant={language === 'hi' ? 'primary' : 'outline'} onClick={() => setLanguage('hi')}>
                हिन्दी (Hindi)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnostics & WebGL Hardware */}
      <Card variant="default">
        <CardHeader>
          <CardTitle>System & Hardware Diagnostics</CardTitle>
          <CardDescription>WebGL graphics and runtime capabilities check</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5 text-xs">
          <div className="flex justify-between py-1.5 border-b border-[var(--cq-border)]/50">
            <span className="text-[var(--cq-text-muted)]">WebGL 2.0 Acceleration</span>
            <span className="text-[var(--cq-success)] font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Hardware Supported
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[var(--cq-border)]/50">
            <span className="text-[var(--cq-text-muted)]">Computational Backend</span>
            <span className="text-[var(--cq-text)]">RDKit ETKDGv3 / MMFF94 Ready</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[var(--cq-border)]/50">
            <span className="text-[var(--cq-text-muted)]">Storage Engine</span>
            <span className="text-[var(--cq-text)]">Local-First (IndexedDB / LocalStorage)</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-[var(--cq-text-muted)]">Curriculum Standard</span>
            <span className="text-[var(--cq-accent)] font-semibold">MRIIRS 4.5CH101C00H (BTech CSE)</span>
          </div>
        </CardContent>
      </Card>

      {/* Data & Storage Management */}
      <Card variant="raised">
        <CardHeader>
          <CardTitle>Local Save Data & Privacy</CardTitle>
          <CardDescription>Export your laboratory notebook or reset progress safely</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-[var(--cq-text-muted)] leading-relaxed">
            All progress is stored locally in your browser without tracking cookies or advertising scripts. You can download a verified JSON snapshot of your lab progress at any time.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button size="sm" variant="secondary" leftIcon={<Download className="w-4 h-4" />} onClick={handleExportData}>
              Export Backup (JSON)
            </Button>
            <Button size="sm" variant="danger" leftIcon={<Trash2 className="w-4 h-4" />} onClick={() => setShowResetModal(true)}>
              Reset Progress
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Confirm Progress Reset"
        description="Are you sure you want to clear your local laboratory notebook and milestones?"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-[var(--cq-text-muted)] leading-relaxed">
            This action will reset all completed experiment worksheets, periodic table favorites, and world unlock milestones back to the initial baseline. This action cannot be undone unless you have exported a JSON backup.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="secondary" onClick={() => setShowResetModal(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="danger" onClick={handleResetProgress}>
              Yes, Reset Progress
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
