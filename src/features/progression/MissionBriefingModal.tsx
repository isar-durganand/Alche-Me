import React from 'react';
import { 
  Play, 
  Clock, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  FileText,
  Zap 
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
          <Badge variant="gold">Reward: +{level.xpReward} XP</Badge>
          <Badge variant="neutral">Curriculum Sourced (MRIIRS)</Badge>
        </div>

        {/* Mission Context */}
        <div className="space-y-1.5">
          <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#00C2D1]">
            Mission Objective
          </span>
          <p className="p-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50/70 text-[#0B1F2A] leading-relaxed text-sm font-medium">
            {level.summary}
          </p>
        </div>

        {/* Learning Sequence Checklist */}
        <div className="space-y-1.5">
          <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#00C2D1]">
            Mission Sequence
          </span>
          <div className="space-y-2.5 p-4 rounded-2xl border-2 border-slate-100 bg-white shadow-sm">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center font-montserrat font-bold text-xs text-[#00C2D1] shrink-0">
                1
              </span>
              <div>
                <span className="font-montserrat font-bold text-xs text-[#0B1F2A] block">Scientific Principles & Equations</span>
                <span className="text-slate-500 text-[11px]">
                  Review curated foundational principles and physical equations.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center font-montserrat font-bold text-xs text-amber-700 shrink-0">
                2
              </span>
              <div>
                <span className="font-montserrat font-bold text-xs text-[#0B1F2A] block">Concept Quiz & Assessment</span>
                <span className="text-slate-500 text-[11px]">
                  Solve real engineering chemistry questions with instant explanatory feedback.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center font-montserrat font-bold text-xs text-emerald-700 shrink-0">
                3
              </span>
              <div>
                <span className="font-montserrat font-bold text-xs text-[#0B1F2A] block">Mastery Score & Save Progression</span>
                <span className="text-slate-500 text-[11px]">
                  Earn XP rewards and unlock the next sequence in the curriculum.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-100">
          <Button size="sm" variant="secondary" onClick={onClose}>
            POSTPONE
          </Button>
          <Button
            size="sm"
            variant="primary"
            rightIcon={<Play className="w-4 h-4 fill-current" />}
            onClick={() => onLaunch(level)}
          >
            LAUNCH MISSION
          </Button>
        </div>
      </div>
    </Modal>
  );
};
