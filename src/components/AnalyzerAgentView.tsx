import React, { useState, useEffect } from 'react';
import { useAgentWatch } from '../lib/store';
import { 
  Bot, Sparkles, Shield, ShieldAlert, ShieldCheck, Zap, AlertTriangle, 
  RefreshCw, CheckCircle2, ArrowRight, Layers, DollarSign, Activity, 
  Terminal, FileText, Lock, Cpu, Sliders, ChevronRight, Download, Share2, Wrench
} from 'lucide-react';

export const AnalyzerAgentView: React.FC = () => {
  const { 
    agents, transactions, alerts, settings, 
    analyzerResult, isAnalyzing, runAnalyzerAgentScan, applyAnalyzerRemediation,
    setActiveView 
  } = useAgentWatch();

  const [activeTab, setActiveTab] = useState<'summary' | 'agents' | 'threats' | 'suggestions'>('summary');
  const [scanStep, setScanStep] = useState<number>(0);
  const [remediatingId, setRemediatingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const scanStepsMessages = [
    "Connecting to AgentWatch Guardrail Telemetry...",
    "Inspecting 8 Active Autonomous AI Agents...",
    "Analyzing $2,019,950 Monitored Transaction Logs...",
    "Scanning Prompt Payloads for Context Override Vectors...",
    "Evaluating Financial Velocity & Single-Tx Ceilings...",
    "Synthesizing Strategic Remediation Proposals via Gemini 2.5..."
  ];

  useEffect(() => {
    if (!analyzerResult && !isAnalyzing) {
      handleStartScan();
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      setScanStep(0);
      interval = setInterval(() => {
        setScanStep(prev => (prev < scanStepsMessages.length - 1 ? prev + 1 : prev));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleStartScan = async () => {
    await runAnalyzerAgentScan();
  };

  const handleApplyRemediation = async (actionType: string, id: string, title: string) => {
    setRemediatingId(id);
    await applyAnalyzerRemediation(actionType);
    setRemediatingId(null);
    setSuccessToast(`Applied Policy: ${title}`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    if (score >= 70) return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans text-slate-200">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-lg bg-emerald-950 border border-emerald-400 text-emerald-200 shadow-2xl flex items-center gap-2 font-mono text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-gradient-to-r from-[#0d1117] via-[#091523] to-[#0d1117] border border-cyan-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-400">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-mono text-white tracking-wide">
                  Master Analyzer Agent
                </h1>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-[10px] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> Powered by Gemini
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Continuous AI system auditing, vulnerability scanning & intelligent guardrail suggestions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 z-10 flex-wrap">
          {analyzerResult && (
            <div className="text-right font-mono text-[11px] text-slate-400 hidden sm:block">
              <div>Last Full Audit:</div>
              <div className="text-cyan-300 font-bold">
                {new Date(analyzerResult.scanTimestamp).toLocaleTimeString()}
              </div>
            </div>
          )}

          <button
            onClick={handleStartScan}
            disabled={isAnalyzing}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#05070a] font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Scanning System...' : 'Run New System Scan'}
          </button>
        </div>
      </div>

      {/* SCANNING PROGRESS ANIMATION */}
      {isAnalyzing && (
        <div className="p-6 rounded-xl bg-[#0d1117] border border-cyan-500/50 shadow-2xl space-y-4 font-mono">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-bold">
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 animate-spin text-cyan-400" />
              ANALYZER AGENT SCAN IN PROGRESS
            </span>
            <span>{Math.round(((scanStep + 1) / scanStepsMessages.length) * 100)}%</span>
          </div>

          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${((scanStep + 1) / scanStepsMessages.length) * 100}%` }}
            />
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="animate-pulse">{scanStepsMessages[scanStep]}</span>
          </div>
        </div>
      )}

      {/* ANALYZER RESULTS DASHBOARD */}
      {analyzerResult && !isAnalyzing && (
        <>
          {/* TOP METRICS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
            {/* Overall Health Score Card */}
            <div className={`p-5 rounded-xl border ${getScoreColor(analyzerResult.overallScore).border} ${getScoreColor(analyzerResult.overallScore).bg} relative overflow-hidden flex items-center justify-between`}>
              <div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider">Overall Security Index</div>
                <div className={`text-3xl font-extrabold ${getScoreColor(analyzerResult.overallScore).text} mt-1`}>
                  {analyzerResult.overallScore}<span className="text-sm font-normal text-slate-500">/100</span>
                </div>
                <div className="text-[10px] text-slate-300 font-bold mt-1">
                  Status: {analyzerResult.healthStatus}
                </div>
              </div>
              <div className={`w-14 h-14 rounded-full border-4 border-current ${getScoreColor(analyzerResult.overallScore).text} flex items-center justify-center font-bold text-sm shadow-lg`}>
                {analyzerResult.overallScore}%
              </div>
            </div>

            {/* Total Agents Analyzed */}
            <div className="p-5 rounded-xl bg-[#0d1117] border border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Agents Evaluated</div>
              <div className="text-2xl font-bold text-white mt-1">{analyzerResult.totalAgentsAnalyzed}</div>
              <div className="text-[10px] text-cyan-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 100% Telemetry Active
              </div>
            </div>

            {/* Total Spend Audited */}
            <div className="p-5 rounded-xl bg-[#0d1117] border border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Spend Audited</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                ${(analyzerResult.totalSpendAnalyzed || 0).toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Cross-agent budget velocity
              </div>
            </div>

            {/* Threat Vectors Discovered */}
            <div className="p-5 rounded-xl bg-[#0d1117] border border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Threat Vectors</div>
              <div className="text-2xl font-bold text-rose-400 mt-1">
                {analyzerResult.threatVectors?.length || 0}
              </div>
              <div className="text-[10px] text-rose-400/80 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Actionable fixes available
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 font-mono text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'summary'
                  ? 'bg-cyan-500 text-[#05070a] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'bg-[#0d1117] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              Executive Audit Summary
            </button>

            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
                activeTab === 'suggestions'
                  ? 'bg-cyan-500 text-[#05070a] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'bg-[#0d1117] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Strategic Suggestions & 1-Click Fixes
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-1 -right-1" />
            </button>

            <button
              onClick={() => setActiveTab('threats')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'threats'
                  ? 'bg-cyan-500 text-[#05070a] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'bg-[#0d1117] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Discovered Threat Vectors ({analyzerResult.threatVectors?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('agents')}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'agents'
                  ? 'bg-cyan-500 text-[#05070a] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'bg-[#0d1117] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Bot className="w-4 h-4" />
              Agent Risk Breakdown ({analyzerResult.agentBreakdown?.length || 0})
            </button>
          </div>

          {/* TAB CONTENT 1: EXECUTIVE SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-[#0d1117] border border-cyan-500/30 space-y-4 font-sans">
                <div className="flex items-center gap-2 font-mono text-sm text-cyan-400 font-bold border-b border-slate-800 pb-3">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  AI Executive System Diagnosis
                </div>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {analyzerResult.executiveSummary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 font-mono text-xs">
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-slate-400">Primary Risk Driver</div>
                    <div className="text-amber-400 font-bold">Unsanitized External Webhook Prompts</div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-slate-400">Financial Velocity Rating</div>
                    <div className="text-emerald-400 font-bold">Controlled ($2.01M Monitored)</div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-slate-400">Recommended Next Step</div>
                    <div className="text-cyan-300 font-bold">Apply 1-Click Dual Approval Fix</div>
                  </div>
                </div>
              </div>

              {/* Top Recommendations Highlight */}
              <div className="p-6 rounded-xl bg-[#0d1117] border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Top Priority Security Upgrades
                  </h3>
                  <button
                    onClick={() => setActiveTab('suggestions')}
                    className="font-mono text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    View All Suggestions <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analyzerResult.strategicSuggestions?.slice(0, 2).map((sug, i) => (
                    <div key={i} className="p-4 rounded-lg bg-[#05070a] border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold font-mono">
                          {sug.priority} Priority
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">{sug.category}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{sug.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{sug.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: STRATEGIC SUGGESTIONS & 1-CLICK FIXES */}
          {activeTab === 'suggestions' && (
            <div className="space-y-6 font-sans">
              
              {/* 1-Click Remediations Panel */}
              <div className="p-6 rounded-xl bg-gradient-to-r from-cyan-950/30 via-[#0d1117] to-cyan-950/30 border border-cyan-500/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-cyan-400" />
                      1-Click Instant Policy Remediations
                    </h3>
                    <p className="text-xs text-slate-400">
                      Apply the Analyzer Agent's recommended guardrail rules directly to your organization.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analyzerResult.remediations?.map((rem) => (
                    <div key={rem.id} className="p-4 rounded-lg bg-[#05070a] border border-slate-800 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            rem.impact === 'Critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {rem.impact} Impact
                          </span>
                          {rem.applied && (
                            <span className="text-emerald-400 text-[10px] font-mono flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-white text-xs pt-1">{rem.title}</h4>
                        <p className="text-[11px] text-slate-400">{rem.description}</p>
                      </div>

                      <button
                        onClick={() => handleApplyRemediation(rem.actionType, rem.id, rem.title)}
                        disabled={rem.applied || remediatingId === rem.id}
                        className={`w-full py-2 rounded font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          rem.applied
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-[#05070a] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                        }`}
                      >
                        {remediatingId === rem.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : rem.applied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Policy Enforced
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5" /> Execute 1-Click Fix
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categorized AI Suggestions */}
              <div className="space-y-4">
                <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Detailed Strategic & Operational Guidance
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  {analyzerResult.strategicSuggestions?.map((sug, i) => (
                    <div key={i} className="p-5 rounded-xl bg-[#0d1117] border border-slate-800 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                            {sug.category}
                          </span>
                          <span className="text-amber-400 font-bold">{sug.priority}</span>
                        </div>
                        <h4 className="font-bold text-white text-sm font-sans">{sug.title}</h4>
                        <p className="text-slate-400 font-sans text-xs leading-relaxed">{sug.details}</p>
                      </div>

                      <div className="p-3 rounded bg-[#05070a] border border-slate-800/80 text-[11px]">
                        <span className="text-slate-500 block mb-0.5">Expected Outcome:</span>
                        <span className="text-emerald-400 font-bold">{sug.expectedOutcome}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB CONTENT 3: THREAT VECTORS */}
          {activeTab === 'threats' && (
            <div className="space-y-4 font-sans">
              {analyzerResult.threatVectors?.map((tv, i) => (
                <div key={i} className="p-6 rounded-xl bg-[#0d1117] border border-rose-500/30 space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {tv.severity} Severity Threat Vector
                    </span>
                    <span className="text-slate-400">Affected: {tv.affectedAgents.join(', ')}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">{tv.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{tv.description}</p>

                  <div className="p-3 rounded-lg bg-[#05070a] border border-slate-800 font-mono text-xs flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-slate-400">Suggested Technical Fix: </span>
                      <strong className="text-cyan-300">{tv.suggestedFix}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB CONTENT 4: AGENT BREAKDOWN */}
          {activeTab === 'agents' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analyzerResult.agentBreakdown?.map((item, i) => (
                  <div key={i} className="p-5 rounded-xl bg-[#0d1117] border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.agentName}</h4>
                        <span className="text-slate-500 text-[11px]">ID: {item.agentId}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-400 text-[10px]">Risk Score</div>
                        <div className={`text-base font-bold ${item.riskScore > 65 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {item.riskScore} / 100
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-[#05070a]">
                        <span className="text-slate-500 block">Spend Ratio:</span>
                        <strong className="text-cyan-300">{item.spendRatio}% of budget</strong>
                      </div>
                      <div className="p-2 rounded bg-[#05070a]">
                        <span className="text-slate-500 block">Prompt Risk:</span>
                        <strong className={item.promptInjectionThreat > 50 ? 'text-rose-400' : 'text-emerald-400'}>
                          {item.promptInjectionThreat}%
                        </strong>
                      </div>
                    </div>

                    <div className="space-y-1 font-sans text-xs">
                      <div className="text-slate-400">Analyzer Diagnosis:</div>
                      <p className="text-slate-200 bg-slate-950 p-2.5 rounded border border-slate-800/80">
                        {item.diagnosis}
                      </p>
                    </div>

                    <div className="space-y-1 font-sans text-xs">
                      <div className="text-cyan-400 font-bold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> Recommendation:
                      </div>
                      <p className="text-cyan-200 bg-cyan-950/20 p-2.5 rounded border border-cyan-500/20">
                        {item.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </>
      )}

    </div>
  );
};
