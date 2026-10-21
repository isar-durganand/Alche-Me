import React from 'react';
import { 
  Play, 
  Clock, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';
import { CurriculumLevel } from '../../data/curriculumData';
import { Modal, Button, Badge } from '../../components/ui';

export interface MissionBriefingModalProps {
  level: CurriculumLevel;
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (level: CurriculumLevel) => void;
}

export const MissionBriefingModal: React.FC<MissionBriefingModalProps> = ({
  level,
  isOpen,
  onClose,
  onLaunch,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Mission Briefing: ${level.title}`}
      description={`Mission 0${level.num} • Estimated time: ${level.estimatedMinutes} min`}
      size="md"
    >
      <div className="space-y-5 text-xs">
        {/* Badges bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">Difficulty: {level.difficulty}</Badge>
          <Badge variant="success">Reward: +{level.xpReward} XP</Badge>
          <Badge variant="neutral">Curriculum Sourced (MRIIRS)</Badge>
        </div>

        {/* Mission Context */}
        <div className="space-y-1.5">
          <span className="font-bold text-xs uppercase tracking-wider text-[var(--cq-accent)]">
            Mission Objective
          </span>
          <p className="p-3.5 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] text-[var(--cq-text)] leading-relaxed">
            {level.summary}
          </p>
        </div>

        {/* Learning Sequence Checklist */}
        <div className="space-y-1.5">
          <span className="font-bold text-xs uppercase tracking-wider text-[var(--cq-accent)]">
            Mission Sequence
          </span>
          <div className="space-y-2 p-3.5 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-bg)]">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[var(--cq-surface-raised)] border border-[var(--cq-border)] flex items-center justify-center font-mono text-[10px] text-[var(--cq-accent)] shrink-0">
                1
              </span>
              <div>
                <span className="font-semibold text-[var(--cq-text)] block">Scientific Theory & Equations</span>
                <span className="text-[var(--cq-text-muted)] text-[11px]">
                  Review curated foundational principles and physical equations.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[var(--cq-surface-raised)] border border-[var(--cq-border)] flex items-center justify-center font-mono text-[10px] text-[var(--cq-accent)] shrink-0">
                2
              </span>
              <div>
                <span className="font-semibold text-[var(--cq-text)] block">Curated Concept Assessment</span>
                <span className="text-[var(--cq-text-muted)] text-[11px]">
                  Solve real engineering chemistry questions with instant explanatory feedback.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[var(--cq-surface-raised)] border border-[var(--cq-border)] flex items-center justify-center font-mono text-[10px] text-[var(--cq-accent)] shrink-0">
                3
              </span>
              <div>
                <span className="font-semibold text-[var(--cq-text)] block">Mastery Score & Local Progress Save</span>
                <span className="text-[var(--cq-text-muted)] text-[11px]">
                  Earn XP rewards and unlock the next sequence in the curriculum.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex justify-end gap-2.5 border-t border-[var(--cq-border)]/60">
          <Button size="sm" variant="ghost" onClick={onClose}>
            Postpone
          </Button>
          <Button
            size="sm"
            variant="primary"
            rightIcon={<Play className="w-4 h-4" />}
            onClick={() => onLaunch(level)}
          >
            Launch Activity
          </Button>
        </div>
      </div>
    </Modal>
  );
};
