import React, { useState } from 'react';
import { useAgentWatch } from '../lib/store';
import { X, Shield, Sliders, DollarSign, AlertTriangle, Activity, PauseCircle, PlayCircle, Cpu, CheckCircle2 } from 'lucide-react';

export const AgentDetailModal: React.FC<{ agentId: string; onClose: () => void }> = ({ agentId, onClose }) => {
  const { agents, transactions, alerts, updateAgentLimits, toggleKillSwitch } = useAgentWatch();
  const agent = agents.find(a => a.id === agentId);

  if (!agent) return null;

  const [budgetLimit, setBudgetLimit] = useState<number>(agent.budgetLimit);
  const [maxTxLimit, setMaxTxLimit] = useState<number>(agent.maxSingleTxLimit);
  const [autoFreeze, setAutoFreeze] = useState<boolean>(agent.autoFreezeEnabled);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const agentTx = transactions.filter(t => t.agentId === agent.id);
  const agentAlerts = alerts.filter(a => a.agentId === agent.id);

  const handleSaveGuardrails = async () => {
    await updateAgentLimits(agent.id, budgetLimit, maxTxLimit, autoFreeze);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#05070a]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0d1117] border border-cyan-500/40 rounded-xl max-w-4xl w-full max-h-[88vh] overflow-y-auto p-5 shadow-[0_0_40px_rgba(0,240,255,0.2)] font-mono text-xs relative text-slate-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded bg-[#05070a] border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
          <div className={`w-10 h-10 rounded bg-gradient-to-br ${agent.avatarColor || 'from-cyan-500 to-blue-600'} flex items-center justify-center text-[#05070a] font-bold font-mono text-sm`}>
            {agent.name.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{agent.name}</h2>
              <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${
                agent.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {agent.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{agent.role} • {agent.department}</p>
          </div>
        </div>

        {/* TOP METRICS & RISK BREAKDOWN */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="p-3 rounded bg-[#05070a] border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Model Architecture</span>
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              {agent.model}
            </span>
          </div>

          <div className="p-3 rounded bg-[#05070a] border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Prompt Injection Susceptibility</span>
            <span className={`text-xs font-bold ${agent.promptInjectionRisk > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {agent.promptInjectionRisk}% Vulnerability Index
            </span>
          </div>

          <div className="p-3 rounded bg-[#05070a] border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Anomaly Variance Rate</span>
            <span className="text-xs font-bold text-amber-400">
              {agent.anomalyRate}% Variance Baseline
            </span>
          </div>
        </div>

        {/* GUARDRAIL CONFIGURATION PANEL */}
        <div className="p-4 rounded bg-[#05070a] border border-cyan-500/30 mb-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              EXECUTION_GUARDRAILS_AND_DELEGATION_CONTROLS
            </span>
            <button
              onClick={() => toggleKillSwitch(agent.id)}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all border cursor-pointer ${
                agent.status === 'Suspended'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {agent.status === 'Suspended' ? 'Re-Activate Agent' : 'Emergency Freeze'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Monthly Spending Ceiling: <span className="text-cyan-400 font-bold">${budgetLimit.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min={10000}
                max={1000000}
                step={10000}
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Max Single Transaction Cap: <span className="text-cyan-400 font-bold">${maxTxLimit.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min={1000}
                max={200000}
                step={2500}
                value={maxTxLimit}
                onChange={(e) => setMaxTxLimit(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoFreeze}
                onChange={(e) => setAutoFreeze(e.target.checked)}
                className="accent-cyan-400 w-3.5 h-3.5 rounded"
              />
              Auto-Freeze agent if anomaly score exceeds 85%
            </label>

            <button
              onClick={handleSaveGuardrails}
              className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-[#05070a] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#05070a]" /> Guardrails Updated!
                </>
              ) : (
                'Save Guardrails'
              )}
            </button>
          </div>
        </div>

        {/* AGENT TRANSACTION HISTORY & ALERTS */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Agent Transactions ({agentTx.length})</h3>
          
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
            {agentTx.length === 0 ? (
              <div className="text-xs text-slate-500 p-3 text-center bg-[#05070a] rounded border border-slate-800">
                No recorded transactions for this agent yet.
              </div>
            ) : (
              agentTx.map((tx) => (
                <div key={tx.id} className="p-2.5 rounded bg-[#05070a] border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <div className="text-slate-200 font-bold">{tx.recipient}</div>
                    <div className="text-slate-500 text-[10px]">{tx.category} • Anomaly Score: {tx.anomalyScore}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">${tx.amount.toLocaleString()}</div>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold ${
                      tx.status === 'Approved' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' : 'bg-rose-950 text-rose-400 border-rose-500/30'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
