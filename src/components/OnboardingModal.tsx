import React, { useState } from 'react';
import { X, Shield, CheckCircle2, Rocket, ArrowRight, Building2, Bot, Code, Activity, Copy, Check } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConnectModal?: () => void;
  onOpenAddAgentModal?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onOpenConnectModal,
  onOpenAddAgentModal
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen) return null;

  const copyApiKey = () => {
    navigator.clipboard.writeText('aw_live_key_994821a07c3e');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 1500);
  };

  const steps = [
    {
      step: 1,
      title: "1. Account & Organization Setup",
      subtitle: "Register your company workspace & generate API credentials",
      icon: Building2
    },
    {
      step: 2,
      title: "2. Provision Agent & Set Limits",
      subtitle: "Assign monthly spend caps ($) & auto-freeze rules",
      icon: Bot
    },
    {
      step: 3,
      title: "3. Embed Guardrail Webhook API",
      subtitle: "Add 4 lines of Python / Node code to your AI script",
      icon: Code
    },
    {
      step: 4,
      title: "4. Live Telemetry & Audit Logs",
      subtitle: "Real-time threat blocking, alerts & SOC2 report generation",
      icon: Activity
    }
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-sans text-slate-200 animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-xl bg-[#0d1117] border border-cyan-500/40 p-6 shadow-2xl flex flex-col max-h-[88vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-mono text-white">How to Register & Protect AI Agents (Zero to One)</h2>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-400 font-bold uppercase">QUICKSTART GUIDE</span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Follow this 4-step workflow to connect any external autonomous AI agent to AgentWatch in under 5 minutes.</p>
          </div>
        </div>

        {/* Step Navigation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 font-mono text-xs">
          {steps.map((s) => {
            const IconComponent = s.icon;
            const isCurrent = activeStep === s.step;
            const isDone = activeStep > s.step;

            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[90px] ${
                  isCurrent
                    ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : isDone
                    ? 'bg-slate-900/60 border-emerald-500/30 text-slate-300'
                    : 'bg-[#05070a] border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] font-bold ${isCurrent ? 'text-cyan-400' : isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
                    STEP {s.step}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <IconComponent className={`w-4 h-4 ${isCurrent ? 'text-cyan-400' : 'text-slate-500'}`} />
                  )}
                </div>
                <div className="text-xs font-bold leading-tight line-clamp-2">{s.title.replace(/^\d+\.\s*/, '')}</div>
              </button>
            );
          })}
        </div>

        {/* Step Details Body */}
        <div className="p-5 rounded-lg bg-[#05070a] border border-slate-800 space-y-4 font-mono text-xs">
          
          {/* STEP 1 */}
          {activeStep === 1 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Building2 className="w-4 h-4" />
                Step 1: Register Organization & Obtain Live API Key
              </div>
              <p className="text-slate-300 leading-relaxed">
                When you or your company signs up, AgentWatch provisions a secure enterprise workspace. Your master organization API key authenticates all incoming agent telemetry and intercept requests.
              </p>

              <div className="p-3 rounded bg-[#0d1117] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Master Secret API Key:</span>
                  <button
                    onClick={copyApiKey}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey ? 'Copied Key!' : 'Copy Key'}
                  </button>
                </div>
                <code className="block p-2 rounded bg-black/60 text-emerald-400 font-mono text-xs border border-emerald-500/20">
                  aw_live_key_994821a07c3e
                </code>
              </div>

              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                <li>Configure primary currency, default monthly budget alert thresholds, and security team email notifications.</li>
                <li>Supports multi-tenant team accounts with Role-Based Access Control (RBAC).</li>
              </ul>
            </div>
          )}

          {/* STEP 2 */}
          {activeStep === 2 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Bot className="w-4 h-4" />
                Step 2: Provision an AI Agent Profile in Mission Control
              </div>
              <p className="text-slate-300 leading-relaxed">
                Before running an autonomous agent (e.g. Finance Bot, Procurement Agent, Support Refund Assistant), define its financial boundaries and guardrails in the dashboard.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded bg-[#0d1117] border border-slate-800 text-[11px]">
                <div className="space-y-1">
                  <span className="text-slate-400">1. Assign Monthly Spend Limit:</span>
                  <div className="text-emerald-400 font-bold">$10,000 / month</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400">2. Max Single Transaction Cap:</span>
                  <div className="text-amber-400 font-bold">$2,500 per transaction</div>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-slate-400">3. Auto-Freeze Guardrail:</span>
                  <div className="text-cyan-300">Instantly suspend agent if anomaly score &gt; 75/100</div>
                </div>
              </div>

              {onOpenAddAgentModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddAgentModal();
                  }}
                  className="px-3.5 py-1.5 rounded bg-cyan-500 text-[#05070a] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                >
                  <Bot className="w-3.5 h-3.5" />
                  Try Adding an Agent Now
                </button>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {activeStep === 3 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Code className="w-4 h-4" />
                Step 3: Intercept Execution Calls via Webhook API
              </div>
              <p className="text-slate-300 leading-relaxed">
                Inside your agent's actual Python (LangChain/LlamaIndex) or Node.js codebase, add a simple POST call to <code className="text-cyan-300 font-bold">/api/v1/intercept</code> before executing payments, API calls, or database writes.
              </p>

              <pre className="p-3 rounded bg-[#0d1117] border border-slate-800 text-cyan-300 text-[11px] overflow-x-auto leading-relaxed">
{`# Python / LangChain Example
import requests

response = requests.post(
  "https://your-agentwatch-domain.com/api/v1/intercept",
  json={
    "agentId": "agent-001",
    "amount": 1850,
    "vendor": "Stripe Payout",
    "promptText": "Process vendor invoice #4810"
  },
  headers={"Authorization": "Bearer aw_live_key_994821a07c3e"}
)

if response.json()["interceptResult"]["status"] == "BLOCKED":
  raise Exception("Blocked by AgentWatch Guardrails!")`}
              </pre>

              {onOpenConnectModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenConnectModal();
                  }}
                  className="px-3.5 py-1.5 rounded bg-cyan-500 text-[#05070a] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                >
                  <Code className="w-3.5 h-3.5" />
                  Open Live API Sandbox & Code Generator
                </button>
              )}
            </div>
          )}

          {/* STEP 4 */}
          {activeStep === 4 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Shield className="w-4 h-4" />
                Step 4: Continuous Real-Time Monitoring & Compliance
              </div>
              <p className="text-slate-300 leading-relaxed">
                AgentWatch handles the rest! Every transaction, prompt, and execution step is evaluated in real time:
              </p>

              <div className="space-y-2 text-[11px]">
                <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span><strong>Approved Requests:</strong> Logged instantly to live audit ledger.</span>
                </div>
                <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span><strong>Blocked Attacks:</strong> Prompt injections and single-tx breaches are killed before execution.</span>
                </div>
                <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 shrink-0" />
                  <span><strong>SOC2 & EU AI Act Audits:</strong> One-click downloadable PDF compliance reports.</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="pt-4 border-t border-slate-800 mt-5 flex items-center justify-between text-xs font-mono">
          <button
            disabled={activeStep === 1}
            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold disabled:opacity-30 cursor-pointer"
          >
            Previous
          </button>

          <div className="text-slate-400 text-[11px]">
            Step {activeStep} of 4
          </div>

          {activeStep < 4 ? (
            <button
              onClick={() => setActiveStep(prev => Math.min(4, prev + 1))}
              className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-[#05070a] font-bold flex items-center gap-1 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-[#05070a] font-bold cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            >
              Done / Start Monitoring
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
