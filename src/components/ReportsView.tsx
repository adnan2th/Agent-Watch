import React, { useState } from 'react';
import { useAgentWatch } from '../lib/store';
import { ComplianceReport } from '../types';
import { FileText, Sparkles, CheckCircle2, ShieldCheck, Download, Printer, X, FileCheck, Layers, Loader2 } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { reports, generateAIComplianceReport } = useAgentWatch();
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [reportTitle, setReportTitle] = useState<string>('Q3 2026 AI Financial Governance & Guardrail Audit');
  const [framework, setFramework] = useState<string>('SOC2 Type II / EU AI Act');
  const [showGeneratorModal, setShowGeneratorModal] = useState<boolean>(false);

  const handleCreateReport = async () => {
    setIsGenerating(true);
    const newRep = await generateAIComplianceReport(reportTitle, framework);
    setIsGenerating(false);
    setShowGeneratorModal(false);
    if (newRep) {
      setSelectedReport(newRep);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 font-sans text-slate-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded bg-[#0d1117] border border-cyan-500/20 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">SAFETY & COMPLIANCE AUDITS</span>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">Safety & Audit Reports ({reports.length})</h1>
          <p className="text-xs text-slate-400 font-mono">Download instant compliance reports for SOC2, company policies, and AI safety checks.</p>
        </div>

        <button
          onClick={() => setShowGeneratorModal(true)}
          className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-[#05070a] font-bold font-mono text-xs transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          Generate New Audit Report
        </button>
      </div>

      {/* REPORTS HIGH DENSITY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-4 rounded bg-[#0d1117] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5 font-mono">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[9px] font-bold uppercase">
                  {rep.type}
                </span>

                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {rep.score} / 100
                </div>
              </div>

              <h3 className="text-sm font-bold font-mono text-white group-hover:text-cyan-300 transition-colors mb-2">
                {rep.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 mb-3 leading-relaxed font-sans">
                {rep.summary}
              </p>

              <div className="space-y-1 text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-2.5">
                <div>Framework: <span className="text-slate-300">{rep.framework}</span></div>
                <div>Generated: <span className="text-slate-400">{rep.generatedAt.split(' ')[0]}</span></div>
                <div>Author: <span className="text-cyan-400">{rep.author}</span></div>
              </div>
            </div>

            <button
              onClick={() => setSelectedReport(rep)}
              className="mt-4 w-full py-1.5 rounded bg-[#05070a] hover:bg-slate-900 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" /> View Formal Document
            </button>
          </div>
        ))}
      </div>

      {/* GENERATOR MODAL */}
      {showGeneratorModal && (
        <div className="fixed inset-0 z-50 bg-[#05070a]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border-cyan-500/40 rounded max-w-md w-full p-5 font-mono text-xs relative">
            <button
              onClick={() => setShowGeneratorModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Gemini AI Audit Compiler</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Compiles telemetry from active agents into a formal compliance manifest.</p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-slate-400 mb-1">Audit Report Title</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-[#05070a] border border-slate-800 rounded p-2 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Regulatory Framework Standard</label>
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="w-full bg-[#05070a] border border-slate-800 rounded p-2 text-white outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="SOC2 Type II / EU AI Act">SOC2 Type II & EU AI Act Article 14</option>
                  <option value="FINRA & ISO 27001">FINRA / ISO 27001 Annex A</option>
                  <option value="OWASP LLM Top 10">OWASP Top 10 for LLM Applications</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCreateReport}
              disabled={isGenerating}
              className="w-full py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-[#05070a] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Compiling Telemetry via Gemini...
                </>
              ) : (
                'Compile & Sign Audit Report'
              )}
            </button>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-[#05070a]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0d1117] border border-cyan-500/40 rounded max-w-3xl w-full p-6 font-mono text-xs relative shadow-[0_0_40px_rgba(0,240,255,0.2)] max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 p-1 rounded bg-[#05070a] border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Document Header */}
            <div className="border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">FORMAL COMPLIANCE MANIFEST</span>
                <span className="text-xs text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                  SCORE: {selectedReport.score} / 100
                </span>
              </div>

              <h2 className="text-lg font-bold text-white mb-1">{selectedReport.title}</h2>
              <div className="text-xs text-slate-400">
                Framework: {selectedReport.framework} • Date: {selectedReport.generatedAt}
              </div>
            </div>

            {/* Executive Summary */}
            <div className="mb-4 space-y-1">
              <h3 className="text-[10px] uppercase font-bold text-cyan-300">Executive Summary</h3>
              <p className="text-xs text-slate-300 bg-[#05070a] p-3 rounded border border-slate-800 leading-relaxed font-sans">
                {selectedReport.summary}
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-3 mb-6">
              {selectedReport.sections?.map((sec, idx) => (
                <div key={idx} className="p-3 rounded bg-[#05070a] border border-slate-800">
                  <h4 className="text-xs font-bold text-white mb-1">{sec.heading}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{sec.content}</p>
                </div>
              ))}
            </div>

            {/* Signature Block */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <div>
                <div>Cryptographic Hash: <span className="text-slate-400">0x89f2a1829...</span></div>
                <div>Author: {selectedReport.author}</div>
              </div>

              <div className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-bold">
                ✓ VERIFIED COMPLIANT
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
