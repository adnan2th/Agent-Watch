import React, { useState } from 'react';
import { useAgentWatch } from '../lib/store';
import { X, Bot, Shield, DollarSign, Cpu, Building2, Sparkles, CheckCircle2 } from 'lucide-react';

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAgentModal: React.FC<AddAgentModalProps> = ({ isOpen, onClose }) => {
  const { addAgent } = useAgentWatch();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Finance & Ops');
  const [model, setModel] = useState('Gemini 1.5 Pro');
  const [budgetLimit, setBudgetLimit] = useState<number>(10000);
  const [maxSingleTxLimit, setMaxSingleTxLimit] = useState<number>(2500);
  const [autoFreezeEnabled, setAutoFreezeEnabled] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    setIsSubmitting(true);
    try {
      await addAgent({
        name: name.trim(),
        role: role.trim(),
        department,
        model,
        budgetLimit: Number(budgetLimit) || 5000,
        maxSingleTxLimit: Number(maxSingleTxLimit) || 1000,
        autoFreezeEnabled,
        status: 'Active',
      });

      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setIsSubmitting(false);
        setName('');
        setRole('');
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-sans text-slate-200 animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl bg-[#0d1117] border border-cyan-500/30 p-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-mono text-white">Provision New AI Agent</h2>
            <p className="text-xs text-slate-400 font-mono">Deploy a new autonomous agent protected by AgentWatch safety limits.</p>
          </div>
        </div>

        {successMsg ? (
          <div className="py-8 text-center space-y-3 font-mono">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <div className="text-lg font-bold text-white">Agent Added Successfully!</div>
            <p className="text-xs text-slate-400">Now active and protected under your global guardrails.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            
            {/* Agent Name */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Agent Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Customer Refunds AI"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#05070a] border border-slate-800 rounded px-3 py-2 text-white focus:border-cyan-400 outline-none"
              />
            </div>

            {/* Department & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#05070a] border border-slate-800 rounded px-3 py-2 text-white focus:border-cyan-400 outline-none cursor-pointer"
                >
                  <option value="Finance & Ops">Finance & Ops</option>
                  <option value="Engineering & Infrastructure">Engineering & Infrastructure</option>
                  <option value="Marketing & Growth">Marketing & Growth</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Procurement">Procurement</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" /> AI Model Engine
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-[#05070a] border border-slate-800 rounded px-3 py-2 text-white focus:border-cyan-400 outline-none cursor-pointer"
                >
                  <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                  <option value="Gemini 1.5 Flash">Gemini 1.5 Flash</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                  <option value="GPT-4o Enterprise">GPT-4o Enterprise</option>
                  <option value="Llama 3.1 70B">Llama 3.1 70B</option>
                </select>
              </div>
            </div>

            {/* Role / Description */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Role & Objective <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Handles automated vendor payment processing and ledger sync"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#05070a] border border-slate-800 rounded px-3 py-2 text-white focus:border-cyan-400 outline-none"
              />
            </div>

            {/* Budget & Single Tx Limits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded bg-[#05070a] border border-slate-800">
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Monthly Budget ($)
                </label>
                <input
                  type="number"
                  min="100"
                  step="500"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(Number(e.target.value))}
                  className="w-full bg-[#0d1117] border border-slate-700 rounded px-3 py-1.5 text-emerald-400 font-bold focus:border-cyan-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-amber-400" /> Max Single Tx ($)
                </label>
                <input
                  type="number"
                  min="50"
                  step="250"
                  value={maxSingleTxLimit}
                  onChange={(e) => setMaxSingleTxLimit(Number(e.target.value))}
                  className="w-full bg-[#0d1117] border border-slate-700 rounded px-3 py-1.5 text-amber-400 font-bold focus:border-cyan-400 outline-none"
                />
              </div>
            </div>

            {/* Auto Freeze Toggle */}
            <div className="flex items-center justify-between p-3 rounded bg-[#05070a] border border-slate-800">
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  Auto-Freeze Safety Guardrail
                </div>
                <div className="text-[11px] text-slate-400">Instantly suspend this agent if an anomaly score exceeds 75/100</div>
              </div>
              <input
                type="checkbox"
                checked={autoFreezeEnabled}
                onChange={(e) => setAutoFreezeEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Submit Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-[#05070a] font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                {isSubmitting ? 'Provisioning...' : 'Add AI Agent'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
