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
  Star
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
            <div className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/70 space-y-2">
              <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#00C2D1]">
                Core Theoretical Principle
              </span>
              <p className="text-[#0B1F2A] leading-relaxed text-sm font-medium">
                {lesson.conceptSummary}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#0B1F2A]">
                Key Learning Objectives
              </span>
              <ul className="space-y-2">
                {lesson.bulletPoints.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3.5 rounded-xl border-2 border-slate-100 bg-white shadow-sm text-[#0B1F2A] leading-relaxed"
                  >
                    <Check className="w-4 h-4 text-[#00C2D1] shrink-0 mt-0.5" />
                    <span className="text-xs">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {lesson.keyEquation && (
              <div className="p-4 rounded-2xl border-2 border-teal-100 bg-teal-50/60 space-y-1">
                <span className="text-[10px] font-montserrat font-extrabold uppercase tracking-wider text-teal-800">
                  Scientific Formula & Equation
                </span>
                <div className="font-mono font-bold text-sm text-[#0B1F2A]">
                  {lesson.keyEquation}
                </div>
                {lesson.accessibleText && (
                  <div className="text-[11px] text-teal-700">
                    Note: {lesson.accessibleText}
                  </div>
                )}
              </div>
            )}

            <div className="pt-3 flex justify-between items-center border-t border-slate-100">
              <span className="text-[11px] font-montserrat font-bold text-slate-500">
                {quiz.length} Assessment Questions Awaiting
              </span>
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setPhase('quiz')}
              >
                PROCEED TO ASSESSMENT
              </Button>
            </div>
          </div>
        )}

        {/* Phase 2: Assessment Quiz */}
        {phase === 'quiz' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-montserrat font-bold text-xs text-[#0B1F2A]">
                Curated Concept Questions ({quiz.length} Total)
              </span>
              <span className="text-xs font-montserrat font-extrabold text-[#00C2D1]">
                {Object.keys(selectedAnswers).length} / {quiz.length} Answered
              </span>
            </div>

            <div className="space-y-5">
              {quiz.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl border-2 border-slate-100 bg-slate-50/70 space-y-3"
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
                          className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer select-none ${
                            isSelected
                              ? 'border-[#00C2D1] bg-teal-50/80 text-[#0B1F2A] font-montserrat font-bold shadow-sm'
                              : 'border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="text-xs leading-relaxed">{opt}</span>
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
              <Button size="sm" variant="secondary" onClick={() => setPhase('lesson')}>
                BACK TO LESSON
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={!isAllAnswered}
                onClick={handleSubmitQuiz}
              >
                SUBMIT ANSWERS
              </Button>
            </div>
          </div>
        )}

        {/* Phase 3: Results & Pedagogical Remediation */}
        {phase === 'results' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Score Summary Box */}
            <div className="p-6 rounded-3xl border-2 border-slate-200/90 bg-white text-center space-y-3 shadow-sm">
              <div className="inline-flex p-3 rounded-2xl bg-teal-50 border-2 border-teal-200 text-[#00C2D1] shadow-sm">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="font-montserrat font-extrabold text-2xl text-[#0B1F2A]">
                {score >= 90 ? 'Mission Mastered!' : score >= 60 ? 'Mission Completed!' : 'Review Recommended'}
              </h3>
              <div className="flex items-center justify-center gap-6 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px] font-montserrat font-bold uppercase">Assessment Score</span>
                  <span className="text-3xl font-montserrat font-extrabold text-[#00C2D1]">{score}%</span>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[10px] font-montserrat font-bold uppercase">XP Earned</span>
                  <span className="text-3xl font-montserrat font-extrabold text-[#F5B942] flex items-center justify-center gap-1">
                    <Zap className="w-5 h-5 fill-current" /> +{level.xpReward}
                  </span>
                </div>
              </div>
            </div>

            {/* Answer-by-Answer Review */}
            <div className="space-y-3">
              <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#0B1F2A]">
                Solution Breakdown & Explanations
              </span>
              {quiz.map((q, qIdx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border-2 ${
                      isCorrect ? 'border-emerald-200 bg-emerald-50/60' : 'border-rose-200 bg-rose-50/60'
                    } space-y-2`}
                  >
                    <div className="flex items-start gap-2">
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
                        <span className="text-slate-500">Your choice: </span>
                        <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                          {q.options[userAns]}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div>
                          <span className="text-slate-500">Correct choice: </span>
                          <span className="text-emerald-700 font-bold">
                            {q.options[q.correctIndex]}
                          </span>
                        </div>
                      )}
                      <div className="pt-1.5 text-slate-700 leading-relaxed italic bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
                        💡 {q.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 flex justify-between items-center border-t border-slate-100">
              <Button size="sm" variant="secondary" leftIcon={<RotateCcw className="w-3.5 h-3.5" />} onClick={handleResetQuiz}>
                RETAKE QUIZ
              </Button>
              <Button variant="primary" size="md" onClick={handleFinish}>
                FINISH MISSION
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
