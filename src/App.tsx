import React from 'react';
import { AgentWatchProvider, useAgentWatch } from './lib/store';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { AgentsView } from './components/AgentsView';
import { TransactionsView } from './components/TransactionsView';
import { AlertsView } from './components/AlertsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { AnalyzerAgentView } from './components/AnalyzerAgentView';
import { UserManualView } from './components/UserManualView';

const MainContent: React.FC = () => {
  const { activeView } = useAgentWatch();

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-300 flex flex-col font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950 bg-grid-pattern">
      {/* Scanline Overlay Effect */}
      <div className="fixed inset-0 pointer-events-none z-40 opacity-[0.03] scanline-overlay" />

      <Navbar />

      <main className="flex-1 relative z-10 pb-8">
        {activeView === 'landing' && <LandingPage />}
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'analyzer' && <AnalyzerAgentView />}
        {activeView === 'agents' && <AgentsView />}
        {activeView === 'transactions' && <TransactionsView />}
        {activeView === 'alerts' && <AlertsView />}
        {activeView === 'reports' && <ReportsView />}
        {activeView === 'settings' && <SettingsView />}
        {activeView === 'manual' && <UserManualView />}
      </main>

      {/* High Density Mission Control Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#0d1117]/90 backdrop-blur-md px-4 sm:px-8 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            NETWORK: OPERATIONAL
          </span>
          <span className="text-slate-700">/</span>
          <span>LATENCY: 14ms</span>
          <span className="text-slate-700">/</span>
          <span>DB: FIRESTORE LIVE</span>
          <span className="text-slate-700">/</span>
          <span className="text-cyan-400">AI: GEMINI ACTIVE</span>
        </div>
        <div className="text-slate-400">
          AgentWatch Protocol v1.0.4 • <span className="text-cyan-400">[Secure-Enclave-Mode]</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AgentWatchProvider>
      <MainContent />
    </AgentWatchProvider>
  );
}
