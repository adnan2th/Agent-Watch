import React from 'react';
import { useAgentWatch } from '../lib/store';
import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, AlertTriangle, ShieldCheck, DollarSign, Activity, Play, Zap, FileText, ArrowUpRight, ArrowDownRight, PauseCircle, Download, Plus, Terminal, UserCheck, Rocket, Bot, Sparkles, ChevronRight } from 'lucide-react';
import { AddAgentModal } from './AddAgentModal';
import { ConnectAgentModal } from './ConnectAgentModal';
import { AuthModal } from './AuthModal';
import { OnboardingModal } from './OnboardingModal';

export const DashboardView: React.FC = () => {
  const { agents, transactions, alerts, activityFeed, setActiveView, triggerSimulatedAnomaly, toggleKillSwitch, generateAIComplianceReport, currentUser } = useAgentWatch();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = React.useState(false);

  // Metrics calculation
  const totalMonitoredSpend = agents.reduce((acc, a) => acc + a.currentSpend, 0);
  const activeAgentsCount = agents.filter(a => a.status === 'Active').length;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'Critical' && a.status === 'Active').length;
  const avgRiskScore = Math.round(agents.reduce((acc, a) => acc + a.riskScore, 0) / agents.length);

  // Risk Distribution Data for Donut Chart
  const riskData = [
    { name: 'Low Risk (<30)', value: agents.filter(a => a.riskScore < 30).length, color: '#10b981' },
    { name: 'Medium Risk (30-60)', value: agents.filter(a => a.riskScore >= 30 && a.riskScore < 60).length, color: '#00f0ff' },
    { name: 'High Risk (60-80)', value: agents.filter(a => a.riskScore >= 60 && a.riskScore < 80).length, color: '#f59e0b' },
    { name: 'Critical (>80)', value: agents.filter(a => a.riskScore >= 80).length, color: '#f43f5e' },
  ];

  // Transaction Volume Time-Series Data for Area Chart
  const volumeData = [
    { time: '08:00', volume: 85000, anomaly: 12 },
    { time: '10:00', volume: 142000, anomaly: 28 },
    { time: '12:00', volume: 210000, anomaly: 18 },
    { time: '14:00', volume: 175000, anomaly: 45 },
    { time: '16:00', volume: 290000, anomaly: 72 },
    { time: '18:00', volume: 230000, anomaly: 38 },
    { time: '20:00', volume: 185000, anomaly: 85 },
    { time: '22:00', volume: 110000, anomaly: 94 },
  ];

  const highestRiskAgent = [...agents].sort((a, b) => b.riskScore - a.riskScore)[0];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 font-sans text-slate-300">
      
      {/* Header High Density Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded bg-[#0d1117] border border-cyan-500/20 backdrop-blur-md shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">STATUS: PROTECTED & ACTIVE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 tracking-tight">AI Agent Safety Dashboard</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">Monitor your AI agents, enforce monthly budgets, and prevent unauthorized payments in real time.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-[#05070a] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
          >
            <UserCheck className="w-3.5 h-3.5" />
            {currentUser ? 'My Workspace / Account' : 'Register Company Account'}
          </button>

          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-[#05070a] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.4)]"
          >
            <Terminal className="w-3.5 h-3.5" />
            Connect AI API
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded bg-[#0d1117] hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            Add AI Agent
          </button>

          <button
            onClick={() => triggerSimulatedAnomaly()}
            className="px-3 py-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            Test Risk Alert
          </button>

          <button
            onClick={() => generateAIComplianceReport('Instant Mission Control Snapshot', 'SOC2 / EU AI Act')}
            className="px-3 py-1.5 rounded bg-[#0d1117] hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            Download Summary
          </button>
        </div>
      </div>

      {/* ANALYZER AGENT QUICK AUDIT BANNER */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/50 via-[#0d1117] to-cyan-950/50 border border-cyan-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 shrink-0">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-sm font-bold text-white tracking-wide">Analyzer Agent Operational Audit</h2>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1 border border-cyan-500/30">
                <Sparkles className="w-3 h-3 text-cyan-400" /> AI Diagnostic
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Run a complete multi-dimensional scan across all {agents.length} active agents, ${(totalMonitoredSpend || 0).toLocaleString()} monitored spend, and real-time prompt injection logs to receive instant security suggestions and 1-click policy remediations.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('analyzer')}
          className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#05070a] font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0 cursor-pointer"
        >
          <span>Run Analyzer Agent</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
      <div className="p-3.5 rounded bg-cyan-950/30 border border-cyan-500/30 font-sans text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="text-cyan-400 text-base shrink-0 mt-0.5">💡</span>
          <div>
            <div className="font-bold text-white font-mono text-xs">How AgentWatch Works (Beginner Quick Guide)</div>
            <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
              <strong className="text-cyan-300">1. AI Agents</strong> make automated payments & decisions. 
              <strong className="text-cyan-300"> 2. Safety Guardrails</strong> block transactions over your preset budget limit. 
              <strong className="text-cyan-300"> 3. Quick Freeze</strong> lets you pause any agent instantly if something looks wrong.
            </p>
          </div>
        </div>
      </div>

      {/* TOP KPI METRICS CARDS - HIGH DENSITY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        
        {/* Monitored Volume */}
        <div className="p-4 rounded bg-[#0d1117] border border-slate-800 hover:border-cyan-500/40 transition-all font-mono">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">
            <span>TOTAL SPEND</span>
            <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">${totalMonitoredSpend.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> All within budget
          </div>
        </div>

        {/* Active Agents */}
        <div className="p-4 rounded bg-[#0d1117] border border-slate-800 hover:border-cyan-500/40 transition-all font-mono">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">
            <span>ACTIVE AGENTS</span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">{activeAgentsCount} <span className="text-xs text-slate-500 font-normal">/ {agents.length} Total</span></div>
          <div className="text-[10px] text-cyan-400 flex items-center gap-1 mt-1">
            <span>Protected by Guardrails</span>
          </div>
        </div>

        {/* Critical Security Alerts */}
        <div className="p-4 rounded bg-[#0d1117] border border-red-900/40 hover:border-red-500/60 transition-all font-mono">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">
            <span>SECURITY ALERTS</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400">{criticalAlertsCount} <span className="text-xs text-slate-500 font-normal">Active</span></div>
          <div className="text-[10px] text-rose-400 flex items-center gap-1 mt-1">
            <span>{criticalAlertsCount > 0 ? 'Requires your review' : 'No urgent alerts'}</span>
          </div>
        </div>

        {/* Avg Risk Index */}
        <div className="p-4 rounded bg-[#0d1117] border border-slate-800 hover:border-cyan-500/40 transition-all font-mono">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">
            <span>AVG RISK SCORE</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400">{avgRiskScore} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
            <span>Lower is safer</span>
          </div>
        </div>

        {/* Compliance Score */}
        <div className="p-4 rounded bg-[#0d1117] border border-slate-800 hover:border-cyan-500/40 transition-all font-mono">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">
            <span>SAFETY RATING</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">98.4%</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
            <span>Fully Compliant</span>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: CHARTS & RISK DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Transaction Volume & Anomaly Analytics Chart */}
        <div className="lg:col-span-2 p-4 rounded bg-[#0d1117] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 font-mono">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">AI Agent Spending & Security Alerts Over Time</h2>
              <p className="text-[11px] text-slate-400">Compare spending volume ($) with security alert flags throughout the day</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 rounded bg-cyan-400"></span> Spend ($)</span>
              <span className="flex items-center gap-1 text-rose-400"><span className="w-2 h-2 rounded bg-rose-500"></span> Risk Alerts</span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="anomalyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#05070a', borderColor: '#1e293b', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#00f0ff" fillOpacity={1} fill="url(#volumeGrad)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="anomaly" stroke="#f43f5e" fillOpacity={1} fill="url(#anomalyGrad)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut Chart */}
        <div className="p-4 rounded bg-[#0d1117] border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold font-mono text-white mb-0.5">Agent Risk Breakdown</h2>
            <p className="text-[11px] font-mono text-slate-400 mb-2">How safe your 8 AI agents are right now</p>
            
            <div className="h-40 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={58}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#05070a', borderColor: '#1e293b', fontSize: '11px', fontFamily: 'monospace' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none font-mono">
                <span className="text-lg font-bold text-white">{agents.length}</span>
                <span className="text-[9px] text-slate-500 uppercase font-bold">Agents</span>
              </div>
            </div>
          </div>

          <div className="space-y-1 pt-3 border-t border-slate-800/80 text-xs font-mono">
            {riskData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-slate-300 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="font-bold">{item.value} agent{item.value !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: TELEMETRY FEED & COMMAND PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Real-time Activity Feed */}
        <div className="lg:col-span-2 p-4 rounded bg-[#0d1117] border border-slate-800">
          <div className="flex items-center justify-between mb-3 font-mono">
            <div>
              <h2 className="text-sm font-bold text-white">Live AI Agent Activity Log</h2>
              <p className="text-[11px] text-slate-400">Real-time actions, purchases, and security checks</p>
            </div>
            <button
              onClick={() => setActiveView('transactions')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All Transactions →
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
            {activityFeed.slice(0, 8).map((act) => (
              <div
                key={act.id}
                className={`p-2.5 rounded border text-xs font-mono transition-all flex items-start justify-between gap-3 ${
                  act.severity === 'danger'
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                    : act.severity === 'warning'
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    : 'bg-[#05070a] border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                    act.severity === 'danger' ? 'bg-rose-500 animate-pulse' : act.severity === 'warning' ? 'bg-amber-400' : 'bg-cyan-400'
                  }`} />
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{act.agentName}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase">{act.type}</span>
                    </div>
                    <div className="mt-0.5 text-xs text-slate-200">{act.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{act.details}</div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 shrink-0 text-right">
                  {act.timestamp.split(' ')[1]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guardrail Command Panel */}
        <div className="p-4 rounded bg-[#0d1117] border border-slate-800 flex flex-col justify-between font-mono">
          <div>
            <h2 className="text-sm font-bold text-white mb-0.5">Quick Safety Actions</h2>
            <p className="text-[11px] text-slate-400 mb-3">Freeze risky agents or update limits</p>

            {highestRiskAgent && (
              <div className="p-3 rounded bg-[#05070a] border border-amber-500/30 mb-3">
                <div className="text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  Agent Needing Attention
                </div>
                <div className="text-xs font-bold text-white mt-1">{highestRiskAgent.name}</div>
                <div className="text-[11px] text-slate-400">Risk Level: <span className="text-rose-400 font-bold">{highestRiskAgent.riskScore}/100</span> | Status: {highestRiskAgent.status}</div>

                <button
                  onClick={() => toggleKillSwitch(highestRiskAgent.id)}
                  className="mt-2.5 w-full py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PauseCircle className="w-3.5 h-3.5" />
                  {highestRiskAgent.status === 'Suspended' ? 'Re-Activate Agent' : `Freeze ${highestRiskAgent.name}`}
                </button>
              </div>
            )}

            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setActiveView('reports')}
                className="w-full p-2 rounded bg-[#05070a] hover:bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  View Audit Reports
                </span>
                <span>→</span>
              </button>

              <button
                onClick={() => setActiveView('settings')}
                className="w-full p-2 rounded bg-[#05070a] hover:bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-between transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Global Safety Limits
                </span>
                <span>→</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 flex justify-between uppercase">
            <span>DB: FIRESTORE LIVE</span>
            <span className="text-cyan-400">SYNCED</span>
          </div>
        </div>

      </div>

      {/* Add New Agent Modal */}
      <AddAgentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* Connect Agent Webhook API Modal */}
      <ConnectAgentModal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} />

      {/* Register / Sign In Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Zero to One Step-by-Step Onboarding Guide */}
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onOpenAddAgentModal={() => setIsAddModalOpen(true)}
      />
    </div>
  );
};
