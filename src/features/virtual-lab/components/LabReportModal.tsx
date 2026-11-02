/**
 * Alche-Me — University Engineering Chemistry Practical Examination Certificate
 */

import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  Download, 
  Printer, 
  Sparkles, 
  X,
  FlaskConical
} from 'lucide-react';
import { soundEngine } from '../../../infrastructure/audio/soundEngine';
import { LabReportResult } from '../types';

interface LabReportModalProps {
  report: LabReportResult | null;
  onClose: () => void;
}

export const LabReportModal: React.FC<LabReportModalProps> = ({ report, onClose }) => {
  if (!report) return null;

  const handlePrint = () => {
    soundEngine.playTap();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border-2 border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
        
        {/* Certificate Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-[#00C2D1]">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-montserrat font-extrabold uppercase tracking-wider text-[#008E9B]">
                Manav Rachna International Institute of Research and Studies
              </div>
              <h2 className="text-base sm:text-lg font-montserrat font-extrabold text-[#0B1F2A]">
                Certificate of Practical Analysis
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Experiment Credentials */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Experiment:</span>
            <strong className="font-montserrat text-[#0B1F2A]">EXP 0{report.experimentNum} • {report.experimentTitle}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Date & Time:</span>
            <span className="font-mono text-slate-700">{report.date}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Concordant Volumetric Reading:</span>
            <span className="font-mono font-bold text-teal-600">{report.concordantValue.toFixed(2)} mL</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Assay Result:</span>
            <span className="font-mono font-bold text-amber-600">{report.calculatedResult}</span>
          </div>
        </div>

        {/* Grade & Accuracy Badge */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-teal-700">Analytical Grade</div>
              <div className="text-lg font-montserrat font-extrabold text-teal-950">
                Grade {report.grade} Scholar
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Precision Accuracy</div>
            <div className="text-xl font-mono font-black text-teal-600">
              {report.accuracyPercentage.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-montserrat font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#00C2D1] hover:bg-[#00AAB8] text-white text-xs font-montserrat font-extrabold cursor-pointer shadow-md transition-all"
          >
            Claim Lab XP (+{report.xpAwarded} XP)
          </button>
        </div>
      </div>
    </div>
  );
};
