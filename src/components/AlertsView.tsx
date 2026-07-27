import React, { useState } from 'react';
import { useAgentWatch } from '../lib/store';
import { SecurityAlert, AlertSeverity } from '../types';
import { AlertOctagon, ShieldAlert, CheckCircle2, Clock, Check, X, Filter, Search, UserCheck } from 'lucide-react';

export const AlertsView: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert, toggleKillSwitch, agents } = useAgentWatch();
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [resolvingAlert, setResolvingAlert] = useState<SecurityAlert | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState<string>('');
  const [resolvedByName, setResolvedByName] = useState<string>('Security Officer');

  const filteredAlerts = alerts.filter(alt => {
    const matchesSeverity = severityFilter === 'All' || alt.severity === severityFilter || (severityFilter === 'Unresolved' && alt.status !== 'Resolved');
    const matchesSearch = alt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alt.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alt.threatVector.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
      case 'High':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Medium':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Low':
        return 'bg-[#05070a] text-slate-400 border-slate-700';
    }
  };

  const handleConfirmResolve = async () => {
    if (!resolvingAlert) return;
    await resolveAlert(resolvingAlert.id, resolvedByName, resolutionNotes);
    setResolvingAlert(null);
    setResolutionNotes('');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 font-sans text-slate-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded bg-[#0d1117] border border-cyan-500/20 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">SECURITY DISPATCH</span>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">Security Alerts & Threats ({alerts.length})</h1>
          <p className="text-xs text-slate-400 font-mono">Real-time alerts triggered when AI agents exceed budget limits or encounter prompt injection attacks.</p>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <div className="text-xs text-rose-300 bg-rose-950/60 px-3 py-1.5 rounded border border-rose-500/40 flex items-center gap-2">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>UNRESOLVED ALERTS: </span>
            <span className="font-bold text-white">
              {alerts.filter(a => a.status !== 'Resolved').length}
            </span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="p-3 rounded bg-[#0d1117] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search threat title, agent, vector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#05070a] border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:border-cyan-400 outline-none"
          />
        </div>

        {/* Severity Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {['All', 'Unresolved', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-all cursor-pointer ${
                severityFilter === sev
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 bg-[#05070a] border border-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* ALERTS LIST */}
      <div className="space-y-3">
        {filteredAlerts.map((alt) => {
          const associatedAgent = agents.find(a => a.id === alt.agentId);

          return (
            <div
              key={alt.id}
              className={`p-4 rounded border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                alt.severity === 'Critical' && alt.status !== 'Resolved'
                  ? 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                  : alt.status === 'Resolved'
                  ? 'bg-[#0d1117]/60 border-slate-800 opacity-80'
                  : 'bg-[#0d1117] border-slate-800'
              }`}
            >
              <div className="space-y-1.5 max-w-2xl font-mono">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${getSeverityBadge(alt.severity)}`}>
                    {alt.severity}
                  </span>

                  <span className="text-xs font-bold text-cyan-300 bg-[#05070a] px-2 py-0.5 rounded border border-slate-800">
                    {alt.agentName}
                  </span>

                  <span className="text-[10px] text-slate-500">
                    {alt.timestamp}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{alt.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{alt.description}</p>

                <div className="text-[10px] text-slate-400">
                  Threat Vector: <span className="text-amber-300 font-bold">{alt.threatVector}</span>
                </div>

                {alt.status === 'Resolved' && (
                  <div className="text-[10px] text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-500/20 mt-1">
                    Resolved by {alt.resolvedBy} at {alt.resolvedAt} • Notes: {alt.resolutionNotes || 'Verified benign.'}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 font-mono text-xs">
                {alt.status === 'Active' && (
                  <button
                    onClick={() => acknowledgeAlert(alt.id)}
                    className="px-2.5 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
                  >
                    Acknowledge
                  </button>
                )}

                {alt.status !== 'Resolved' && (
                  <button
                    onClick={() => setResolvingAlert(alt)}
                    className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-[#05070a] font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)] flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Resolve Alert
                  </button>
                )}

                {associatedAgent && (
                  <button
                    onClick={() => toggleKillSwitch(associatedAgent.id)}
                    className="px-2.5 py-1.5 rounded bg-[#05070a] hover:bg-slate-900 text-slate-300 border border-slate-800 transition-all cursor-pointer"
                  >
                    {associatedAgent.status === 'Suspended' ? 'Unfreeze' : 'Freeze Agent'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* RESOLUTION MODAL */}
      {resolvingAlert && (
        <div className="fixed inset-0 z-50 bg-[#05070a]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d1117] border border-cyan-500/40 rounded max-w-md w-full p-5 font-mono text-xs relative">
            <h3 className="text-base font-bold text-white mb-1">Resolve Security Incident</h3>
            <p className="text-xs text-slate-400 mb-4">{resolvingAlert.title}</p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-slate-400 mb-1">Security Auditor Name</label>
                <input
                  type="text"
                  value={resolvedByName}
                  onChange={(e) => setResolvedByName(e.target.value)}
                  className="w-full bg-[#05070a] border border-slate-800 rounded p-2 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Resolution & Remediation Notes</label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Explain why this threat is resolved or verified safe..."
                  className="w-full bg-[#05070a] border border-slate-800 rounded p-2 text-white outline-none focus:border-cyan-400 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setResolvingAlert(null)}
                className="flex-1 py-1.5 rounded bg-[#05070a] text-slate-300 text-xs border border-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolve}
                className="flex-1 py-1.5 rounded bg-cyan-500 text-[#05070a] font-bold text-xs cursor-pointer"
              >
                Confirm Resolve
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
