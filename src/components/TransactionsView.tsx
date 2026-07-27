import React, { useState } from 'react';
import { useAgentWatch } from '../lib/store';
import { Transaction, TransactionStatus } from '../types';
import { Search, Filter, DollarSign, AlertOctagon, CheckCircle2, ShieldAlert, Code, X, FileJson, ArrowUpRight } from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const { transactions } = useAgentWatch();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filteredTx = transactions.filter((tx) => {
    const matchesSearch = tx.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Flagged':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Blocked':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Pending Review':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    }
  };

  const getAnomalyColor = (score: number) => {
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
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">SPEND HISTORY LOG</span>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">AI Agent Transactions ({transactions.length})</h1>
          <p className="text-xs text-slate-400 font-mono">Every payment made by your AI agents, verified with real-time budget guardrails.</p>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <div className="text-xs text-slate-300 bg-[#05070a] px-3 py-1.5 rounded border border-slate-800">
            <span>TOTAL PROCESSED: </span>
            <span className="text-cyan-400 font-bold">
              ${transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-3 rounded bg-[#0d1117] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ID, recipient, agent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#05070a] border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:border-cyan-400 outline-none"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {['All', 'Approved', 'Flagged', 'Blocked', 'Pending Review'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 bg-[#05070a] border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* TRANSACTION LEDGER HIGH DENSITY TABLE */}
      <div className="p-0.5 rounded bg-[#0d1117] border border-slate-800 overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase font-bold tracking-widest bg-[#05070a]">
              <th className="p-3">Tx ID & Timestamp</th>
              <th className="p-3">Agent</th>
              <th className="p-3">Recipient / Merchant</th>
              <th className="p-3">Amount ($)</th>
              <th className="p-3">Category</th>
              <th className="p-3">Anomaly Score</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Payload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredTx.map((tx) => (
              <tr key={tx.id} className="hover:bg-cyan-500/5 transition-colors">
                <td className="p-3 font-bold text-slate-200">
                  <div>{tx.id}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{tx.timestamp}</div>
                </td>

                <td className="p-3 text-cyan-300 font-bold">{tx.agentName}</td>

                <td className="p-3 text-slate-300 max-w-xs truncate">{tx.recipient}</td>

                <td className="p-3 font-bold text-white text-xs">
                  ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>

                <td className="p-3 text-slate-400">{tx.category}</td>

                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getAnomalyColor(tx.anomalyScore)}`}>
                    {tx.anomalyScore} / 100
                  </span>
                </td>

                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase ${getStatusBadge(tx.status)}`}>
                    {tx.status}
                  </span>
                </td>

                <td className="p-3 text-right">
                  <button
                    onClick={() => setSelectedTx(tx)}
                    className="px-2 py-0.5 rounded bg-[#05070a] hover:bg-slate-900 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center gap-1 inline-flex text-xs"
                  >
                    <Code className="w-3 h-3" /> Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* INSPECTOR MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-[#05070a]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0d1117] border border-cyan-500/40 rounded max-w-2xl w-full p-5 shadow-[0_0_30px_rgba(0,240,255,0.2)] font-mono relative">
            
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute top-4 right-4 p-1 rounded bg-[#05070a] border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <FileJson className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Transaction Inspector — {selectedTx.id}</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded bg-[#05070a] border border-slate-800 grid grid-cols-2 gap-2 text-slate-300">
                <div>Agent: <span className="text-cyan-300 font-bold">{selectedTx.agentName}</span></div>
                <div>Amount: <span className="text-white font-bold">${selectedTx.amount.toLocaleString()}</span></div>
                <div>Recipient: <span className="text-slate-300">{selectedTx.recipient}</span></div>
                <div>Status: <span className="text-cyan-400">{selectedTx.status}</span></div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1 text-[10px] uppercase font-bold">Neural Anomaly Reasoning:</span>
                <div className="p-3 rounded bg-[#05070a] border border-amber-500/30 text-amber-200">
                  {selectedTx.reasoning}
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1 text-[10px] uppercase font-bold">Raw Execution Payload JSON:</span>
                <pre className="p-3 rounded bg-[#05070a] border border-slate-800 text-cyan-300 overflow-x-auto text-[10px]">
                  {selectedTx.rawPayload}
                </pre>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
