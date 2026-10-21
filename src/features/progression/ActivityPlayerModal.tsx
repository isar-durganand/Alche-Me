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
  Check
} from 'lucide-react';
import { CurriculumLevel } from '../../data/curriculumData';
import { progressAdapter } from '../../infrastructure/persistence/progressAdapter';
import { Modal, Button, Badge, ProgressBar, Alert } from '../../components/ui';

export interface ActivityPlayerModalProps {
  level: CurriculumLevel;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const ActivityPlayerModal: React.FC<ActivityPlayerModalProps> = ({
  level,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'lesson' | 'quiz' | 'results'>('lesson');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState<number>(0);

  const { activity } = level;
  const { lesson, quiz } = activity;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const isAllAnswered = quiz.every((q) => selectedAnswers[q.id] !== undefined);

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / quiz.length) * 100);
    setScore(calculatedScore);

    // Persist progress deterministically behind our adapter
    progressAdapter.completeActivity(level.id, calculatedScore, level.xpReward);

    setPhase('results');
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setScore(0);
    setPhase('quiz');
  };

  const handleFinish = () => {
    onComplete();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        phase === 'lesson'
          ? `Lesson: ${lesson.title}`
          : phase === 'quiz'
          ? `Concept Assessment: ${level.title}`
          : `Mission Results: ${level.title}`
      }
      description={`Mission 0${level.num} • ${level.xpReward} XP Reward`}
      size="lg"
    >
      <div className="space-y-5 text-xs">
        {/* Phase 1: Lesson Presentation */}
        {phase === 'lesson' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] space-y-2">
              <span className="font-bold text-xs uppercase tracking-wider text-[var(--cq-accent)]">
                Core Theoretical Principle
              </span>
              <p className="text-[var(--cq-text)] leading-relaxed">
                {lesson.conceptSummary}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-xs uppercase tracking-wider text-[var(--cq-text)]">
                Key Learning Objectives
              </span>
              <ul className="space-y-2">
                {lesson.bulletPoints.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-lg border border-[var(--cq-border)]/70 bg-[var(--cq-bg)] text-[var(--cq-text)] leading-relaxed"
                  >
                    <Check className="w-4 h-4 text-[var(--cq-accent)] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {lesson.keyEquation && (
              <div className="p-3.5 rounded-xl border border-[var(--cq-accent)]/40 bg-[var(--cq-accent-subtle)] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--cq-accent)]">
                  Scientific Formula & Equation
                </span>
                <div className="font-mono font-bold text-sm text-[var(--cq-text)]">
                  {lesson.keyEquation}
                </div>
                {lesson.accessibleText && (
                  <div className="text-[11px] text-[var(--cq-text-muted)]">
                    Note: {lesson.accessibleText}
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex justify-between items-center border-t border-[var(--cq-border)]/60">
              <span className="text-[11px] text-[var(--cq-text-muted)] font-mono">
                {quiz.length} Assessment Questions Awaiting
              </span>
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setPhase('quiz')}
              >
                Proceed to Assessment
              </Button>
            </div>
          </div>
        )}

        {/* Phase 2: Assessment Quiz */}
        {phase === 'quiz' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--cq-border)]/60">
              <span className="font-semibold text-xs text-[var(--cq-text)]">
                Curated Concept Questions ({quiz.length} Total)
              </span>
              <span className="text-[11px] text-[var(--cq-accent)] font-mono">
                {Object.keys(selectedAnswers).length} / {quiz.length} Answered
              </span>
            </div>

            <div className="space-y-5">
              {quiz.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] space-y-3"
                >
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold text-[var(--cq-accent)] text-xs">
                      Q{qIdx + 1}.
                    </span>
                    <h4 className="font-semibold text-sm text-[var(--cq-text)] leading-snug">
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
                          className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all cursor-pointer select-none ${
                            isSelected
                              ? 'border-[var(--cq-accent)] bg-[var(--cq-accent-subtle)] text-[var(--cq-text)] font-medium shadow-sm'
                              : 'border-[var(--cq-border)] bg-[var(--cq-surface)] hover:bg-[var(--cq-surface-hover)] text-[var(--cq-text-muted)] hover:text-white'
                          }`}
                        >
                          <span className="text-xs leading-relaxed">{opt}</span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                              isSelected
                                ? 'border-[var(--cq-accent)] bg-[var(--cq-accent)] text-black'
                                : 'border-[var(--cq-border)]'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-[var(--cq-border)]/60">
              <Button size="sm" variant="ghost" onClick={() => setPhase('lesson')}>
                Back to Lesson
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={!isAllAnswered}
                onClick={handleSubmitQuiz}
              >
                Submit Answers
              </Button>
            </div>
          </div>
        )}

        {/* Phase 3: Results & Pedagogical Remediation */}
        {phase === 'results' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Score Summary Box */}
            <div className="p-5 rounded-2xl border border-[var(--cq-border)] bg-[var(--cq-surface-raised)] text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-[var(--cq-accent-subtle)] border border-[var(--cq-accent)]/30 text-[var(--cq-accent)]">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-xl text-[var(--cq-text)]">
                {score >= 90 ? 'Mission Mastered!' : score >= 60 ? 'Mission Completed!' : 'Review Recommended'}
              </h3>
              <div className="flex items-center justify-center gap-4 text-xs">
                <div>
                  <span className="text-[var(--cq-text-muted)] block text-[10px]">Assessment Score</span>
                  <span className="text-2xl font-black font-mono text-[var(--cq-accent)]">{score}%</span>
                </div>
                <div className="w-px h-8 bg-[var(--cq-border)]" />
                <div>
                  <span className="text-[var(--cq-text-muted)] block text-[10px]">XP Earned</span>
                  <span className="text-2xl font-black font-mono text-[var(--cq-success)]">+{level.xpReward}</span>
                </div>
              </div>
            </div>

            {/* Answer-by-Answer Review */}
            <div className="space-y-3">
              <span className="font-bold text-xs uppercase tracking-wider text-[var(--cq-text)]">
                Pedagogical Solution Breakdown
              </span>
              {quiz.map((q, qIdx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-xl border ${
                      isCorrect ? 'border-[var(--cq-success)]/40 bg-[var(--cq-success-subtle)]' : 'border-[var(--cq-danger)]/40 bg-[var(--cq-danger-subtle)]'
                    } space-y-2`}
                  >
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-[var(--cq-success)] shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[var(--cq-danger)] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-semibold text-xs text-[var(--cq-text)]">
                          Q{qIdx + 1}: {q.question}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] space-y-1 pl-6">
                      <div>
                        <span className="text-[var(--cq-text-muted)]">Your choice: </span>
                        <span className={isCorrect ? 'text-[var(--cq-success)] font-medium' : 'text-[var(--cq-danger)] font-medium'}>
                          {q.options[userAns]}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div>
                          <span className="text-[var(--cq-text-muted)]">Correct choice: </span>
                          <span className="text-[var(--cq-success)] font-semibold">
                            {q.options[q.correctIndex]}
                          </span>
                        </div>
                      )}
                      <div className="pt-1 text-[var(--cq-text)] leading-relaxed italic bg-black/20 p-2 rounded">
                        💡 {q.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-[var(--cq-border)]/60">
              <Button size="sm" variant="ghost" leftIcon={<RotateCcw className="w-3.5 h-3.5" />} onClick={handleResetQuiz}>
                Retake Assessment
              </Button>
              <Button variant="primary" size="md" onClick={handleFinish}>
                Finish Mission & Return
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
