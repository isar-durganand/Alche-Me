import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  ArrowRight,
  Eye,
  BrainCircuit,
  Info
} from 'lucide-react';
import { ClassificationActivityConfig, ClassificationItem } from '../../../domain/types/curriculum';
import { Button, Badge } from '../../../components/ui';

export interface ClassificationActivityProps {
  config: ClassificationActivityConfig;
  onComplete: (score: number) => void;
}

export const ClassificationActivity: React.FC<ClassificationActivityProps> = ({
  config,
  onComplete,
}) => {
  // Mapping of item ID -> selected category ID
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeHintId, setActiveHintId] = useState<string | null>(null);

  const { items, categories, instruction } = config;

  const handlePlaceItem = (itemId: string, categoryId: string) => {
    if (submitted) return;
    setPlacements((prev) => ({
      ...prev,
      [itemId]: categoryId,
    }));
  };

  const handleReset = () => {
    setPlacements({});
    setSubmitted(false);
    setActiveHintId(null);
  };

  const totalItems = items.length;
  const placedCount = Object.keys(placements).length;
  const isAllPlaced = placedCount === totalItems;

  const calculateScore = () => {
    let correctCount = 0;
    items.forEach((item) => {
      if (placements[item.id] === item.category) {
        correctCount++;
      }
    });
    return Math.round((correctCount / totalItems) * 100);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const finalScore = submitted ? calculateScore() : 0;
  const isMastered = finalScore >= 80;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Instructions Bar */}
      <div className="p-4 rounded-2xl border-2 border-slate-100 bg-teal-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-start gap-2.5">
          <Info className="w-5 h-5 text-[#00C2D1] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-montserrat font-bold text-xs text-[#0B1F2A] block">
              Interactive Investigation Workbench
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              {instruction}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="accent" size="sm">
            {placedCount} of {totalItems} Classified
          </Badge>
          {!submitted && (
            <Button size="sm" variant="ghost" onClick={handleReset} title="Reset workbench">
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            </Button>
          )}
        </div>
      </div>

      {/* Target Category Bins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const itemsInCat = items.filter((i) => placements[i.id] === cat.id);
          const isTeal = cat.id === 'direct_observation';

          return (
            <div
              key={cat.id}
              className={`p-4 rounded-3xl border-2 flex flex-col justify-between transition-all ${
                isTeal
                  ? 'border-teal-200 bg-teal-50/40 shadow-sm'
                  : 'border-amber-200 bg-amber-50/40 shadow-sm'
              }`}
            >
              <div className="space-y-1 pb-3 border-b border-slate-200/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isTeal ? (
                      <Eye className="w-4 h-4 text-[#00C2D1]" />
                    ) : (
                      <BrainCircuit className="w-4 h-4 text-amber-600" />
                    )}
                    <h3 className="font-montserrat font-extrabold text-sm text-[#0B1F2A]">
                      {cat.label}
                    </h3>
                  </div>
                  <Badge variant={isTeal ? 'accent' : 'gold'} size="sm">
                    {itemsInCat.length} Items
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  {cat.description}
                </p>
              </div>

              {/* Sorted Items in this Category */}
              <div className="space-y-2 py-3 min-h-[140px] flex-1">
                {itemsInCat.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs italic">
                    Assign items to this category below
                  </div>
                ) : (
                  itemsInCat.map((item) => {
                    const isCorrect = item.category === cat.id;

                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border-2 transition-all ${
                          submitted
                            ? isCorrect
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-950 shadow-sm'
                              : 'border-rose-300 bg-rose-50 text-rose-950 shadow-sm'
                            : 'border-slate-200 bg-white text-[#0B1F2A] shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-medium leading-relaxed flex-1">
                            {item.text}
                          </span>

                          {submitted && (
                            <span className="shrink-0 mt-0.5">
                              {isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-600" />
                              )}
                            </span>
                          )}
                        </div>

                        {/* Submitted Explanation */}
                        {submitted && (
                          <div className="mt-2 pt-2 border-t border-slate-200/60 text-[11px] leading-relaxed text-slate-700">
                            💡 {item.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unassigned Items Queue (Interactive Cards) */}
      {!submitted && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#0B1F2A]">
              Scientific Evidence Cards to Classify
            </span>
            <span className="text-[11px] font-montserrat font-bold text-slate-500">
              Click a destination button on each card
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((item, idx) => {
              const currentPlacement = placements[item.id];
              const isHintOpen = activeHintId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    currentPlacement
                      ? 'border-teal-200 bg-white shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <span className="font-montserrat font-bold text-xs text-[#00C2D1]">
                      Evidence Card 0{idx + 1}
                    </span>
                    {item.hint && (
                      <button
                        type="button"
                        onClick={() => setActiveHintId(isHintOpen ? null : item.id)}
                        className="p-1 text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
                        title="Show Hint"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-[#0B1F2A] font-medium leading-relaxed mb-3">
                    "{item.text}"
                  </p>

                  {isHintOpen && item.hint && (
                    <div className="p-2 mb-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-tight">
                      🔎 Hint: {item.hint}
                    </div>
                  )}

                  {/* Destination Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handlePlaceItem(item.id, 'direct_observation')}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-montserrat font-bold transition-all cursor-pointer ${
                        currentPlacement === 'direct_observation'
                          ? 'bg-[#00C2D1] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-800'
                      }`}
                    >
                      Direct Observation
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePlaceItem(item.id, 'inference')}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-montserrat font-bold transition-all cursor-pointer ${
                        currentPlacement === 'inference'
                          ? 'bg-[#F5B942] text-[#0B1F2A] shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-800'
                      }`}
                    >
                      Explanatory Inference
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Control Actions / Submission */}
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t-2 border-slate-100">
        {!submitted ? (
          <>
            <span className="text-xs font-montserrat font-bold text-slate-500">
              {isAllPlaced ? 'All 8 cards placed. Ready for verification!' : `Place all ${totalItems} items to verify.`}
            </span>
            <Button
              variant="primary"
              size="md"
              disabled={!isAllPlaced}
              onClick={handleSubmit}
            >
              VERIFY CLASSIFICATIONS
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span className="font-montserrat font-extrabold text-sm text-[#0B1F2A]">
                Workbench Score: <span className={isMastered ? 'text-emerald-600' : 'text-amber-600'}>{finalScore}%</span>
              </span>
              <Badge variant={isMastered ? 'success' : 'warning'} size="sm">
                {isMastered ? 'Mastery Demonstrated' : 'Review Explanations'}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" leftIcon={<RotateCcw className="w-3.5 h-3.5" />} onClick={handleReset}>
                RETRY WORKBENCH
              </Button>
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => onComplete(finalScore)}
              >
                PROCEED TO ASSESSMENT
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
