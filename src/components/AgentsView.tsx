import React, { useState } from 'react';
import { useAgentWatch } from '../lib/store';
import { Agent, AgentStatus } from '../types';
import { Search, Filter, Shield, AlertTriangle, Cpu, DollarSign, Activity, PauseCircle, PlayCircle, Settings, ChevronRight, SlidersHorizontal, Plus, Code } from 'lucide-react';
import { AgentDetailModal } from './AgentDetailModal';
import { AddAgentModal } from './AddAgentModal';
import { ConnectAgentModal } from './ConnectAgentModal';

export const AgentsView: React.FC = () => {
  const { agents, setSelectedAgentId, selectedAgentId, toggleKillSwitch } = useAgentWatch();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);

  // Departments list
  const departments = ['All', ...Array.from(new Set(agents.map(a => a.department)))];
  const statuses = ['All', 'Active', 'Suspended', 'Flagged', 'Throttled', 'Idle'];

  // Filtered agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agent.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || agent.status === selectedStatus;
    const matchesDept = selectedDept === 'All' || agent.department === selectedDept;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Suspended':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Flagged':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Throttled':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'Idle':
        return 'bg-[#05070a] text-slate-400 border-slate-700';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score < 30) return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30';
    if (score < 60) return 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30';
    if (score < 80) return 'text-amber-400 bg-amber-950/60 border-amber-500/30';
    return 'text-rose-400 bg-rose-950/60 border-rose-500/30';
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 font-sans text-slate-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded bg-[#0d1117] border border-cyan-500/20 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">ACTIVE AGENT DIRECTORY</span>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">Your AI Agents ({agents.length})</h1>
          <p className="text-xs text-slate-400 font-mono">View monthly budget usage, safety scores, and pause any agent with one click.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono">
          <div className="text-xs text-slate-300 bg-[#05070a] px-3 py-1.5 rounded border border-slate-800">
            <span>TOTAL MONTHLY BUDGET: </span>
            <span className="text-cyan-400 font-bold">
              ${agents.reduce((acc, a) => acc + a.budgetLimit, 0).toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="px-3.5 py-1.5 rounded bg-[#0d1117] hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Code className="w-4 h-4" />
            Connect via Webhook / API
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-[#05070a] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)] shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Add New AI Agent
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-3 rounded bg-[#0d1117] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search agent name, role, model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#05070a] border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:border-cyan-400 outline-none"
          />
        </div>

        {/* Status & Department Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          
          <div className="flex items-center gap-1 bg-[#05070a] px-2 py-1 rounded border border-slate-800 text-xs">
            <Filter className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer"
            >
              {statuses.map(st => (
                <option key={st} value={st} className="bg-[#0d1117] text-slate-200">{st}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-[#05070a] px-2 py-1 rounded border border-slate-800 text-xs">
            <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-500">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer"
            >
              {departments.map(dept => (
                <option key={dept} value={dept} className="bg-[#0d1117] text-slate-200">{dept}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* AGENTS HIGH DENSITY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAgents.map((agent) => {
          const spendPercent = Math.round((agent.currentSpend / agent.budgetLimit) * 100);

          return (
            <div
              key={agent.id}
              className="p-4 rounded bg-[#0d1117] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Row: Avatar & Status */}
                <div className="flex items-center justify-between mb-2 font-mono">
                  <div className={`w-8 h-8 rounded bg-gradient-to-br ${agent.avatarColor || 'from-cyan-500 to-blue-600'} flex items-center justify-center text-[#05070a] font-black text-xs`}>
                    {agent.name.slice(0, 2).toUpperCase()}
                  </div>

                  <span className={`px-2 py-0.5 rounded border text-[9px] font-mono font-bold uppercase tracking-wider ${getStatusBadge(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>

                {/* Agent Title & Role */}
                <h3 className="text-sm font-bold font-mono text-white group-hover:text-cyan-300 transition-colors">
                  {agent.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 h-8">
                  {agent.role}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-1.5 mt-2.5 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#05070a] border border-slate-800 text-slate-300 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    {agent.model}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#05070a] border border-slate-800 text-slate-400">
                    {agent.department}
                  </span>
                </div>

                {/* Risk Score Gauge & Spend Progress */}
                <div className="my-3 pt-3 border-t border-slate-800/80 space-y-2.5 font-mono">
                  
                  {/* Risk Score */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Risk Score</span>
                    <span className={`px-2 py-0.5 rounded border font-bold text-[10px] ${getRiskScoreColor(agent.riskScore)}`}>
                      {agent.riskScore} / 100
                    </span>
                  </div>

                  {/* Spend Progress Bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Usage</span>
                      <span className="text-white">${agent.currentSpend.toLocaleString()} / ${agent.budgetLimit.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-[#05070a] rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-300 ${
                          spendPercent > 90 ? 'bg-rose-500' : spendPercent > 70 ? 'bg-amber-400' : 'bg-cyan-400'
                        }`}
                        style={{ width: `${Math.min(spendPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs font-mono">
                <button
                  onClick={() => setSelectedAgentId(agent.id)}
                  className="flex-1 py-1 rounded bg-[#05070a] hover:bg-slate-900 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Settings className="w-3 h-3" />
                  Inspect
                </button>

                <button
                  onClick={() => toggleKillSwitch(agent.id)}
                  title={agent.status === 'Suspended' ? 'Unfreeze Agent' : 'Emergency Killswitch'}
                  className={`p-1 rounded border transition-all cursor-pointer ${
                    agent.status === 'Suspended'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                  }`}
                >
                  {agent.status === 'Suspended' ? (
                    <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <PauseCircle className="w-3.5 h-3.5 text-rose-400" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Detail Modal */}
      {selectedAgentId && <AgentDetailModal agentId={selectedAgentId} onClose={() => setSelectedAgentId(null)} />}

      {/* Add New Agent Modal */}
      <AddAgentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* Connect Agent Webhook API Modal */}
      <ConnectAgentModal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} />
    </div>
  );
};
