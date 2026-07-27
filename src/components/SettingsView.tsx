import React, { useState } from 'react';
import { useAgentWatch } from '../lib/store';
import { Settings, Shield, Key, Bell, Save, RefreshCw, CheckCircle2, Lock, Webhook, Cpu } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, saveSettings, refreshDatabase } = useAgentWatch();

  const [companyName, setCompanyName] = useState<string>(settings.companyName);
  const [globalMaxTx, setGlobalMaxTx] = useState<number>(settings.globalMaxTransaction);
  const [autoFreeze, setAutoFreeze] = useState<number>(settings.autoFreezeThreshold);
  const [webhookUrl, setWebhookUrl] = useState<string>(settings.webhookUrl);
  const [securityEmail, setSecurityEmail] = useState<string>(settings.securityEmail);
  const [dualApproval, setDualApproval] = useState<boolean>(settings.requireDualApproval);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const handleSave = async () => {
    await saveSettings({
      companyName,
      globalMaxTransaction: globalMaxTx,
      autoFreezeThreshold: autoFreeze,
      webhookUrl,
      securityEmail,
      requireDualApproval: dualApproval,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleRefresh = async () => {
    setIsSyncing(true);
    await refreshDatabase();
    setIsSyncing(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4 font-sans text-slate-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded bg-[#0d1117] border border-cyan-500/20 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">SYSTEM CONFIGURATION</span>
          <h1 className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">Global Safety & Budget Settings</h1>
          <p className="text-xs text-slate-400 font-mono">Set company-wide transaction limits, alert notification emails, and auto-freeze rules.</p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-[#05070a] font-bold font-mono text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0"
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#05070a]" /> Saved!
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" /> Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Organization Info */}
        <div className="p-4 rounded bg-[#0d1117] border border-slate-800 space-y-3 font-mono">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-cyan-400 font-bold text-xs">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            ORGANIZATION_PROFILE
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Workspace Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#05070a] border border-slate-800 rounded p-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">SOC Operations Email</label>
              <input
                type="email"
                value={securityEmail}
                onChange={(e) => setSecurityEmail(e.target.value)}
                className="w-full bg-[#05070a] border border-slate-800 rounded p-2 text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Deployment Environment</label>
              <span className="px-2.5 py-1 rounded bg-[#05070a] border border-slate-800 text-cyan-300 font-bold block text-xs">
                {settings.environment || 'Production Cloud Run'}
              </span>
            </div>
          </div>
        </div>

        {/* Global Guardrails */}
        <div className="p-4 rounded bg-[#0d1117] border border-slate-800 space-y-3 font-mono">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-cyan-400 font-bold text-xs">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            GLOBAL_GUARDRAILS
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">
                Hard Transaction Limit: <span className="text-cyan-400 font-bold">${globalMaxTx.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min={10000}
                max={500000}
                step={10000}
                value={globalMaxTx}
                onChange={(e) => setGlobalMaxTx(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                Auto-Freeze Anomaly Score: <span className="text-rose-400 font-bold">{autoFreeze} / 100</span>
              </label>
              <input
                type="range"
                min={50}
                max={95}
                step={5}
                value={autoFreeze}
                onChange={(e) => setAutoFreeze(Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer pt-1 text-xs">
              <input
                type="checkbox"
                checked={dualApproval}
                onChange={(e) => setDualApproval(e.target.checked)}
                className="accent-cyan-400 w-3.5 h-3.5 rounded"
              />
              Require Dual-Authorization for wire transfers &gt; $30,000
            </label>
          </div>
        </div>

        {/* API & Webhooks */}
        <div className="p-4 rounded bg-[#0d1117] border border-slate-800 space-y-3 font-mono md:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-cyan-400 font-bold text-xs">
            <Webhook className="w-3.5 h-3.5 text-cyan-400" />
            API_CREDENTIALS_AND_WEBHOOKS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">AgentWatch API Key</label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value={settings.apiKey}
                  className="flex-1 bg-[#05070a] border border-slate-800 rounded p-2 text-slate-400 outline-none"
                />
                <button
                  onClick={() => alert('New secret API key generated and copied.')}
                  className="px-2.5 py-2 rounded bg-slate-800 text-cyan-300 border border-slate-700 hover:bg-slate-700 cursor-pointer text-xs"
                >
                  Rotate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Real-Time Threat Webhook URL</label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-[#05070a] border border-slate-800 rounded p-2 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Database Health & Re-seed */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div>
              Status: <span className="text-emerald-400 font-bold">Firestore Enterprise Online</span>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isSyncing}
              className="px-2.5 py-1 rounded bg-[#05070a] hover:bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
              Re-Sync Firestore Seed Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
