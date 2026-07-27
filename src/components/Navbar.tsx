import React from 'react';
import { useAgentWatch } from '../lib/store';
import { Shield, Activity, Users, DollarSign, Bell, FileText, Settings, Radio, Zap, AlertTriangle, Play, ExternalLink, Terminal, Rocket, UserCheck, Building2, Bot, Sparkles, BookOpen } from 'lucide-react';
import { ConnectAgentModal } from './ConnectAgentModal';
import { OnboardingModal } from './OnboardingModal';
import { AuthModal } from './AuthModal';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, alerts, agents, triggerSimulatedAnomaly, currentUser } = useAgentWatch();
  const [isConnectModalOpen, setIsConnectModalOpen] = React.useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  const criticalAlertsCount = alerts.filter(a => a.severity === 'Critical' && a.status === 'Active').length;

  return (
    <header className="bg-[#0d1117]/95 backdrop-blur-md border-b border-cyan-500/20 sticky top-0 z-50 transition-all font-sans">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 gap-2">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => setActiveView('landing')}>
            <div className="w-8 h-8 bg-cyan-500 flex items-center justify-center rounded shadow-[0_0_12px_rgba(6,182,212,0.5)] shrink-0">
              <span className="text-[#05070a] font-black text-sm italic font-mono">AW</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-white tracking-tighter font-mono whitespace-nowrap">AGENT<span className="text-cyan-400">WATCH</span></span>
                <span className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-mono text-cyan-400 uppercase whitespace-nowrap">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
                  </span>
                  ONLINE
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#05070a] p-1 rounded border border-slate-800 overflow-x-auto no-scrollbar shrink min-w-0">
            <button
              onClick={() => setActiveView('landing')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeView === 'landing'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.2)] font-bold'
                  : 'text-slate-400 hover:text-cyan-400'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeView === 'dashboard'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.2)] font-bold'
                  : 'text-slate-400 hover:text-cyan-400'
              }`}
            >
              <Activity className="w-3.5 h-3.5 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveView('analyzer')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer relative whitespace-nowrap ${
                activeView === 'analyzer'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.2)] font-bold'
                  : 'text-slate-400 hover:text-cyan-400'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Analyzer Agent</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping absolute -top-0.5 -right-0.5" />
            </button>

            <button
              onClick={() => setActiveView('agents')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeView === 'agents'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.2)] font-bold'
                  : 'text-slate-400 hover:text-cyan-400'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>AI Agents ({agents.length})</span>
            </button>

            <button
              onClick={() => setActiveView('transactions')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeView === 'transactions'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.2)] font-bold'
                  : 'text-slate-400 hover:text-cyan-400'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 shrink-0" />
              <span>Transactions</span>
            </button>

            <button
              onClick={() => setActiveView('alerts')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 relative cursor-pointer whitespace-nowrap ${
                activeView === 'alerts'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.2)] font-bold'
                  : 'text-slate-400 hover:text-cyan-400'
              }`}
            >
              <Bell className="w-3.5 h-3.5 shrink-0" />
              <span>Security Alerts</span>
              {criticalAlertsCount > 0 && (
                <span className="px-1.5 py-0.2 text-[9px] bg-rose-500 text-white rounded font-bold animate-pulse">
                  {criticalAlertsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('reports')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeView === 'reports'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.2)] font-bold'
                  : 'text-slate-400 hover:text-cyan-400'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Compliance</span>
            </button>

            <button
              onClick={() => setActiveView('settings')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeView === 'settings'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.2)] font-bold'
                  : 'text-slate-400 hover:text-cyan-400'
              }`}
            >
              <Settings className="w-3.5 h-3.5 shrink-0" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => setActiveView('manual')}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeView === 'manual'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.2)] font-bold'
                  : 'text-slate-400 hover:text-cyan-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>User Manual</span>
            </button>
          </nav>

          {/* Right Action & Metric Bar */}
          <div className="flex items-center gap-2 font-mono shrink-0">
            <div className="hidden 2xl:block text-right">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest leading-none">Status</p>
              <p className="text-xs text-cyan-400 font-bold leading-tight">All Systems Safe</p>
            </div>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              title="Register account, create company workspace or view profile"
              className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-[#05070a] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.3)] shrink-0 whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-[130px]">
                {currentUser ? currentUser.companyName || currentUser.fullName : 'Register Account'}
              </span>
            </button>

            <button
              onClick={() => setIsOnboardingModalOpen(true)}
              title="Step-by-step registration & integration guide"
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Rocket className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden xl:inline">Setup Guide</span>
            </button>

            <button
              onClick={() => setIsConnectModalOpen(true)}
              title="View Webhook API endpoint & live agent code integrations"
              className="px-2 py-1 sm:px-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-[#05070a] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.3)] whitespace-nowrap shrink-0"
            >
              <Terminal className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
              <span className="hidden sm:inline">Connect API</span>
            </button>

            <button
              onClick={() => triggerSimulatedAnomaly()}
              title="Trigger simulated risk alert to test live guardrail response"
              className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(244,63,94,0.15)] whitespace-nowrap shrink-0"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400 animate-bounce shrink-0" />
              <span className="hidden lg:inline">Test Alert</span>
            </button>

            {/* Direct Mission Control Button when in landing view */}
            {activeView === 'landing' && (
              <button
                onClick={() => setActiveView('dashboard')}
                className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-[#05070a] font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Launch App</span>
                <Play className="w-3 h-3 fill-current shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="flex md:hidden overflow-x-auto py-1.5 gap-1 border-t border-slate-800/80 no-scrollbar">
          {[
            { id: 'landing', label: 'Website', icon: ExternalLink },
            { id: 'dashboard', label: 'Telemetry', icon: Activity },
            { id: 'analyzer', label: 'Analyzer AI', icon: Bot },
            { id: 'agents', label: 'Fleet', icon: Users },
            { id: 'transactions', label: 'Ledger', icon: DollarSign },
            { id: 'alerts', label: 'Threats', icon: Bell },
            { id: 'reports', label: 'Audits', icon: FileText },
            { id: 'settings', label: 'Config', icon: Settings },
            { id: 'manual', label: 'Manual', icon: BookOpen },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`px-2 py-1 rounded text-xs font-mono whitespace-nowrap flex items-center gap-1 ${
                activeView === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 bg-[#05070a]'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <ConnectAgentModal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} />
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};
