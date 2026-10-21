import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Award, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Zap, 
  Star,
  Play,
  Clock,
  ShieldCheck,
  Compass,
  Lock,
  ChevronRight,
  Flame
} from 'lucide-react';
import { LevelSchema } from '../../domain/types/curriculum';
import { progressAdapter } from '../../infrastructure/persistence/progressAdapter';
import { soundEngine } from '../../infrastructure/audio/soundEngine';
import { Modal, Button, Badge, ProgressBar } from '../../components/ui';
import { ConfettiCanvas } from '../../components/ui/ConfettiCanvas';
import { ClassificationActivity } from './activities/ClassificationActivity';

export interface LevelRunnerModalProps {
  level: LevelSchema;
  isOpen: boolean;
  onClose: () => void;
  onLevelCompleted?: (levelId: string, score: number) => void;
}

export type RunnerStep = 'briefing' | 'lesson' | 'activity' | 'assessment' | 'mastery';

export const LevelRunnerModal: React.FC<LevelRunnerModalProps> = ({
  level,
  isOpen,
  onClose,
  onLevelCompleted,
}) => {
  const [step, setStep] = useState<RunnerStep>('briefing');
  const [activityScore, setActivityScore] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const { lessonSections, assessment, rewards, scoringRules, masteryThreshold } = level;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (assessmentSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const isAllAssessmentAnswered =
    assessment.questions.length > 0 &&
    assessment.questions.every((q) => selectedAnswers[q.id] !== undefined);

  const handleActivityDone = (score: number) => {
    setActivityScore(score);
    if (assessment.questions.length > 0) {
      setStep('assessment');
    } else {
      finalizeMission(score, 100);
    }
  };

  const handleAssessmentSubmit = () => {
    let correctCount = 0;
    assessment.questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected !== undefined && q.options[selected]?.isCorrect) {
        correctCount++;
      }
    });

    const assessScore = Math.round((correctCount / assessment.questions.length) * 100);
    setAssessmentSubmitted(true);
    finalizeMission(activityScore, assessScore);
  };

  const finalizeMission = (actScore: number, assessScore: number) => {
    const weightedScore = Math.round(
      actScore * scoringRules.activityWeight + assessScore * scoringRules.assessmentWeight
    );
    setFinalScore(weightedScore);

    // Persist progression deterministically
    progressAdapter.completeActivity(level.id, weightedScore, rewards.xp);

    // If badge reward exists, award achievement
    if (rewards.badgeId) {
      const profile = progressAdapter.getPlayerProfile();
      if (!profile.earnedAchievements.includes(rewards.badgeId)) {
        profile.earnedAchievements.push(rewards.badgeId);
        progressAdapter.savePlayerProfile(profile);
      }
    }

    if (onLevelCompleted) {
      onLevelCompleted(level.id, weightedScore);
    }

    soundEngine.playVictory();
    setStep('mastery');
  };

  const handleResetAssessment = () => {
    setSelectedAnswers({});
    setAssessmentSubmitted(false);
  };

  const isMastered = finalScore >= masteryThreshold;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        step === 'briefing'
          ? `Mission Briefing: ${level.title}`
          : step === 'lesson'
          ? `Scientific Principles: ${level.title}`
          : step === 'activity'
          ? `Interactive Investigation: ${level.title}`
          : step === 'assessment'
          ? `Mastery Assessment: ${level.title}`
          : `Mission Clearance: ${level.title}`
      }
      description={`Mission 0${level.order} • Estimated Duration: ${level.estimatedMinutes} Mins • +${rewards.xp} XP`}
      size="xl"
    >
      <div className="space-y-6 text-xs">
        {/* Step Indicator Progress Bar */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-montserrat font-bold ${
                step === 'briefing'
                  ? 'bg-[#00C2D1] text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              1. Briefing
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span
              className={`px-3 py-1 rounded-full text-xs font-montserrat font-bold ${
                step === 'lesson'
                  ? 'bg-[#00C2D1] text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              2. Discovery
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span
              className={`px-3 py-1 rounded-full text-xs font-montserrat font-bold ${
                step === 'activity'
                  ? 'bg-[#00C2D1] text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              3. Investigation
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span
              className={`px-3 py-1 rounded-full text-xs font-montserrat font-bold ${
                step === 'assessment' || step === 'mastery'
                  ? 'bg-[#00C2D1] text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              4. Mastery
            </span>
          </div>

          <Badge variant="gold" size="sm">
            +{rewards.xp} XP Reward
          </Badge>
        </div>

        {/* STEP 1: BRIEFING */}
        {step === 'briefing' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-5 rounded-3xl border-2 border-slate-100 bg-teal-50/40 space-y-2">
              <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#00C2D1]">
                Mission Scenario & Learning Objectives
              </span>
              <p className="text-[#0B1F2A] leading-relaxed text-sm font-medium">
                {level.shortDescription}
              </p>
            </div>

            <div className="space-y-2.5">
              <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#0B1F2A]">
                Key Learning Competencies
              </span>
              <ul className="space-y-2">
                {level.learningObjectives.map((obj, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl border-2 border-slate-100 bg-white shadow-sm text-[#0B1F2A] leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#00C2D1] shrink-0 mt-0.5" />
                    <span className="text-xs font-medium">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-2xl border-2 border-slate-100 bg-slate-50/70">
                <span className="text-slate-500 block text-[11px] font-medium">Estimated Time</span>
                <span className="font-montserrat font-bold text-sm text-[#0B1F2A]">{level.estimatedMinutes} Minutes</span>
              </div>
              <div className="p-3 rounded-2xl border-2 border-slate-100 bg-amber-50/50">
                <span className="text-amber-800 block text-[11px] font-medium">Target Reward</span>
                <span className="font-montserrat font-extrabold text-sm text-amber-700 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-current" /> +{rewards.xp} XP
                </span>
              </div>
              <div className="p-3 rounded-2xl border-2 border-slate-100 bg-slate-50/70">
                <span className="text-slate-500 block text-[11px] font-medium">Curriculum Standards</span>
                <span className="font-montserrat font-bold text-xs text-[#0B1F2A]">MRIIRS / OpenStax</span>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-100">
              <Button size="sm" variant="secondary" onClick={onClose}>
                POSTPONE
              </Button>
              <Button
                variant="primary"
                size="md"
                rightIcon={<Play className="w-4 h-4 fill-current" />}
                onClick={() => setStep('lesson')}
              >
                BEGIN LESSON
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: LESSON & DISCOVERY */}
        {step === 'lesson' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {lessonSections.map((sec) => (
              <div
                key={sec.id}
                className="p-5 rounded-3xl border-2 border-slate-100 bg-white shadow-sm space-y-3"
              >
                <h3 className="font-montserrat font-extrabold text-base text-[#0B1F2A]">
                  {sec.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                  {sec.content}
                </p>

                {sec.keyTakeaways && sec.keyTakeaways.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-1.5">
                    <span className="text-[10px] font-montserrat font-extrabold uppercase tracking-wider text-teal-800">
                      Scientific Takeaways
                    </span>
                    <ul className="space-y-1 text-[11px] text-teal-950 font-medium">
                      {sec.keyTakeaways.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span className="text-[#00C2D1] font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 flex justify-between items-center border-t border-slate-100">
              <Button size="sm" variant="secondary" onClick={() => setStep('briefing')}>
                BACK TO BRIEFING
              </Button>
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setStep('activity')}
              >
                ENTER INVESTIGATION WORKBENCH
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: INTERACTIVE ACTIVITY WORKBENCH */}
        {step === 'activity' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {level.activityConfig && level.activityConfig.type === 'observation_classification' ? (
              <ClassificationActivity
                config={level.activityConfig as any}
                onComplete={handleActivityDone}
              />
            ) : (
              <div className="p-8 text-center rounded-3xl border-2 border-slate-200 bg-white">
                <p className="text-slate-600">Activity configuration ready for launch.</p>
                <Button variant="primary" className="mt-4" onClick={() => handleActivityDone(100)}>
                  Continue to Assessment
                </Button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: MASTERY ASSESSMENT */}
        {step === 'assessment' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-montserrat font-bold text-xs text-[#0B1F2A]">
                {assessment.title} ({assessment.questions.length} Questions)
              </span>
              <span className="text-xs font-montserrat font-extrabold text-[#00C2D1]">
                {Object.keys(selectedAnswers).length} / {assessment.questions.length} Answered
              </span>
            </div>

            <div className="space-y-5">
              {assessment.questions.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="p-5 rounded-3xl border-2 border-slate-100 bg-slate-50/70 space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-montserrat font-extrabold text-[#00C2D1] text-sm">
                      Q{qIdx + 1}.
                    </span>
                    <h4 className="font-montserrat font-bold text-sm text-[#0B1F2A] leading-snug">
                      {q.question}
                    </h4>
                  </div>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer select-none ${
                            isSelected
                              ? 'border-[#00C2D1] bg-teal-50/80 text-[#0B1F2A] font-montserrat font-bold shadow-sm'
                              : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="text-xs leading-relaxed">{opt.text}</span>
                          <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 ${
                              isSelected
                                ? 'border-[#00C2D1] bg-[#00C2D1] text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 flex justify-between items-center border-t border-slate-100">
              <Button size="sm" variant="secondary" onClick={() => setStep('activity')}>
                BACK TO WORKBENCH
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={!isAllAssessmentAnswered}
                onClick={handleAssessmentSubmit}
              >
                SUBMIT ASSESSMENT
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: MASTERY & REWARDS CELEBRATION */}
        {step === 'mastery' && (
          <div className="space-y-5 animate-in fade-in duration-200 relative">
            {isMastered && <ConfettiCanvas />}

            {/* Score & Honors Summary Card */}
            <div className="p-6 rounded-3xl border-2 border-slate-200/90 bg-white text-center space-y-4 shadow-sm">
              <div className="inline-flex p-3 rounded-2xl bg-amber-50 border-2 border-amber-200 text-[#F5B942] shadow-sm">
                <Award className="w-12 h-12" />
              </div>
              
              <div className="space-y-1">
                <Badge variant={isMastered ? 'success' : 'gold'} size="md">
                  {isMastered ? 'CURRICULUM LEVEL MASTERED' : 'CURRICULUM LEVEL COMPLETED'}
                </Badge>
                <h3 className="font-montserrat font-extrabold text-2xl text-[#0B1F2A]">
                  {level.title}
                </h3>
              </div>

              <div className="flex items-center justify-center gap-8 text-xs pt-2">
                <div>
                  <span className="text-slate-400 block text-[10px] font-montserrat font-bold uppercase">Weighted Score</span>
                  <span className="text-3xl font-montserrat font-extrabold text-[#00C2D1]">{finalScore}%</span>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[10px] font-montserrat font-bold uppercase">Experience Reward</span>
                  <span className="text-3xl font-montserrat font-extrabold text-[#F5B942] flex items-center justify-center gap-1">
                    <Zap className="w-5 h-5 fill-current" /> +{rewards.xp} XP
                  </span>
                </div>
              </div>

              {/* Unlocked Badge / Tool */}
              {rewards.badgeTitle && isMastered && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200/80 max-w-md mx-auto flex items-center gap-3 text-left">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-montserrat font-extrabold text-xs text-amber-950 block">
                      Honor Unlocked: {rewards.badgeTitle}
                    </span>
                    <span className="text-[11px] text-amber-800">
                      Added to your Scholar Profile and Field Journal.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Assessment Solution Rationale Breakdown */}
            <div className="space-y-3">
              <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#0B1F2A]">
                Reviewed Assessment Solutions
              </span>
              {assessment.questions.map((q, qIdx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns !== undefined && q.options[userAns]?.isCorrect;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border-2 ${
                      isCorrect ? 'border-emerald-200 bg-emerald-50/60' : 'border-rose-200 bg-rose-50/60'
                    } space-y-2`}
                  >
                    <div className="flex items-start gap-2.5">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-montserrat font-bold text-xs text-[#0B1F2A]">
                          Q{qIdx + 1}: {q.question}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] space-y-1 pl-6">
                      <div>
                        <span className="text-slate-500">Your Answer: </span>
                        <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                          {userAns !== undefined ? q.options[userAns].text : 'Unanswered'}
                        </span>
                      </div>
                      <div className="pt-1.5 text-slate-700 leading-relaxed italic bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
                        💡 {q.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 flex justify-between items-center border-t border-slate-100">
              <Button size="sm" variant="secondary" onClick={onClose}>
                RETURN TO WORLDS MAP
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={onClose}
              >
                PROCEED ON YOUR ADVENTURE
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
