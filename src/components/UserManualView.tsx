import React, { useState } from 'react';
import { useAgentWatch } from '../lib/store';
import { 
  BookOpen, Search, ChevronRight, Terminal, Copy, Check, Shield, Bot, 
  Zap, AlertTriangle, FileText, Lock, Users, DollarSign, Activity, 
  Settings, ArrowRight, Play, CheckCircle2, HelpCircle, Layers, Wrench, 
  Sparkles, ExternalLink, RefreshCw, Key, ShieldCheck, Download
} from 'lucide-react';

export const UserManualView: React.FC = () => {
  const { setActiveView, triggerSimulatedAnomaly, currentUser } = useAgentWatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('architecture');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [simulationMsg, setSimulationMsg] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  const handleSimulate = async () => {
    setSimulating(true);
    setSimulationMsg("Injecting untrusted prompt payload to test live guardrail interception...");
    await triggerSimulatedAnomaly();
    setTimeout(() => {
      setSimulating(false);
      setSimulationMsg("Intercepted! High-risk anomaly logged. Check the Threats tab or Dashboard.");
    }, 1200);
  };

  const curlExample = `curl -X POST https://your-agentwatch-domain.com/api/v1/intercept \\
  -H "Authorization: Bearer ${currentUser?.apiKey || 'aw_live_8f93a1004bc2e98d'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agentId": "agent-001",
    "agentName": "ProcureBot-X",
    "payloadType": "transaction",
    "amount": 14500,
    "vendor": "CloudHost Corp",
    "promptText": "Initiate monthly server renewal invoice #9921",
    "details": "Automated SaaS infrastructure payment"
  }'`;

  const pythonExample = `import requests

API_KEY = "${currentUser?.apiKey || 'aw_live_8f93a1004bc2e98d'}"
URL = "https://your-agentwatch-domain.com/api/v1/intercept"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

payload = {
    "agentId": "agent-002",
    "agentName": "TreasuryDesk-X",
    "payloadType": "transaction",
    "amount": 25000,
    "vendor": "Global Logistics LLC",
    "promptText": "Process freight invoice batch #4401"
}

response = requests.post(URL, json=payload, headers=headers)
result = response.json()

if result.get("intercepted"):
    print(f"⚠️ Guardrail Intercepted: {result.get('reason')}")
else:
    print(f"✅ Approved transaction ID: {result.get('transactionId')}")`;

  const nodeExample = `import fetch from 'node-fetch';

const API_KEY = "${currentUser?.apiKey || 'aw_live_8f93a1004bc2e98d'}";

async function verifyAgentAction(agentId, amount, promptText) {
  const response = await fetch('https://your-agentwatch-domain.com/api/v1/intercept', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      agentId,
      payloadType: 'transaction',
      amount,
      promptText
    })
  });

  const data = await response.json();
  return data;
}

// Example invocation prior to executing agent payout
verifyAgentAction('agent-001', 8500, 'Authorize SaaS license extension')
  .then(res => console.log('Guardrail decision:', res));`;

  const sections = [
    {
      id: 'architecture',
      title: '1. Platform Overview & Security Architecture',
      icon: Shield,
      content: (
        <div className="space-y-4 text-slate-300 font-sans leading-relaxed">
          <p className="text-sm">
            <strong className="text-white font-mono">AgentWatch</strong> is an enterprise-grade real-time security, telemetry, and financial guardrail platform engineered specifically for autonomous AI agents, LLM tool-calling bots, and automated treasury systems.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 font-mono text-xs">
            <div className="p-4 rounded-lg bg-[#05070a] border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Zap className="w-4 h-4" /> Real-time Interception
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                Every API call, wire transfer, or prompt instruction is evaluated in &lt;15ms before execution.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#05070a] border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Lock className="w-4 h-4" /> Prompt Injection Firewall
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                Prevents adversarial jailbreaks, context overrides, and unauthorized instruction hijacking.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#05070a] border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Bot className="w-4 h-4" /> Master Analyzer Agent
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                Gemini-powered continuous system auditing, vulnerability scanning, and 1-click policy remediations.
              </p>
            </div>
          </div>

          <h3 className="font-mono text-sm font-bold text-white pt-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> Key Architectural Pillars
          </h3>
          <ul className="space-y-2 text-xs list-disc list-inside text-slate-300">
            <li><strong className="text-white">Financial Velocity Guardrails:</strong> Set strict monthly budget ceilings and max single-transaction caps per agent.</li>
            <li><strong className="text-white">Emergency Kill Switch (Quick Freeze):</strong> Instantly pause any compromised agent across all endpoints in one click.</li>
            <li><strong className="text-white">Dual-Authorization Thresholds:</strong> Require human sign-off for payouts exceeding custom risk thresholds.</li>
            <li><strong className="text-white">Automated Compliance Auditor:</strong> Export audit-ready SOC2, ISO27001, and EU AI Act PDF reports.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'onboarding',
      title: '2. Zero-to-One Onboarding & Account Setup',
      icon: Key,
      content: (
        <div className="space-y-4 text-slate-300 font-sans leading-relaxed text-sm">
          <p>
            Setting up your company account and generating production API credentials takes less than 60 seconds:
          </p>

          <ol className="space-y-4 font-sans text-xs">
            <li className="p-4 rounded-lg bg-[#05070a] border border-slate-800 space-y-2">
              <div className="font-mono text-cyan-400 font-bold flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 text-[11px]">1</span>
                Register Your Company Workspace
              </div>
              <p className="text-slate-300">
                Click <strong className="text-emerald-400">"Register Company Account"</strong> in the top navigation bar or Dashboard to create your organization workspace.
              </p>
            </li>

            <li className="p-4 rounded-lg bg-[#05070a] border border-slate-800 space-y-2">
              <div className="font-mono text-cyan-400 font-bold flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 text-[11px]">2</span>
                Copy Secret API Authorization Token
              </div>
              <p className="text-slate-300">
                Your workspace is instantly assigned a unique secret bearer key (e.g., <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300 font-mono">aw_live_8f93a100...</code>) stored in your profile and Settings tab.
              </p>
            </li>

            <li className="p-4 rounded-lg bg-[#05070a] border border-slate-800 space-y-2">
              <div className="font-mono text-cyan-400 font-bold flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 text-[11px]">3</span>
                Register AI Agent Metadata
              </div>
              <p className="text-slate-300">
                Navigate to <strong className="text-white">AI Fleet</strong> and click <strong className="text-cyan-400">"Add AI Agent"</strong> to configure budget caps, model type, and maximum single-transaction limits.
              </p>
            </li>
          </ol>
        </div>
      )
    },
    {
      id: 'api-integration',
      title: '3. API & Webhook SDK Integration',
      icon: Terminal,
      content: (
        <div className="space-y-4 text-slate-300 font-sans leading-relaxed text-xs">
          <p className="text-sm">
            Integrate AgentWatch guardrails directly into your AI agent's execution loop prior to sending financial payouts or executing external API tool calls.
          </p>

          {/* cURL Example */}
          <div className="space-y-2 font-mono">
            <div className="flex items-center justify-between text-cyan-400 font-bold text-xs">
              <span>cURL Webhook Request</span>
              <button
                onClick={() => copyCode(curlExample, 'curl')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] flex items-center gap-1 cursor-pointer"
              >
                {copiedSnippet === 'curl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedSnippet === 'curl' ? 'Copied' : 'Copy cURL'}
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-[#05070a] border border-slate-800 overflow-x-auto text-[11px] text-cyan-200 leading-relaxed">
              {curlExample}
            </pre>
          </div>

          {/* Python Example */}
          <div className="space-y-2 font-mono pt-2">
            <div className="flex items-center justify-between text-cyan-400 font-bold text-xs">
              <span>Python Integration</span>
              <button
                onClick={() => copyCode(pythonExample, 'python')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] flex items-center gap-1 cursor-pointer"
              >
                {copiedSnippet === 'python' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedSnippet === 'python' ? 'Copied' : 'Copy Python'}
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-[#05070a] border border-slate-800 overflow-x-auto text-[11px] text-amber-200 leading-relaxed">
              {pythonExample}
            </pre>
          </div>

          {/* Node.js Example */}
          <div className="space-y-2 font-mono pt-2">
            <div className="flex items-center justify-between text-cyan-400 font-bold text-xs">
              <span>Node.js / TypeScript Integration</span>
              <button
                onClick={() => copyCode(nodeExample, 'node')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] flex items-center gap-1 cursor-pointer"
              >
                {copiedSnippet === 'node' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedSnippet === 'node' ? 'Copied' : 'Copy Node.js'}
              </button>
            </div>
            <pre className="p-4 rounded-lg bg-[#05070a] border border-slate-800 overflow-x-auto text-[11px] text-emerald-200 leading-relaxed">
              {nodeExample}
            </pre>
          </div>
        </div>
      )
    },
    {
      id: 'analyzer-agent',
      title: '4. Master Analyzer Agent & 1-Click Remediations',
      icon: Bot,
      content: (
        <div className="space-y-4 text-slate-300 font-sans leading-relaxed text-xs">
          <p className="text-sm">
            The <strong className="text-cyan-400 font-mono">Master Analyzer Agent</strong> uses Gemini 2.5 AI reasoning to conduct deep multi-dimensional audits of your entire AI agent fleet.
          </p>

          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-[#0d1117] to-cyan-950/40 border border-cyan-500/40 space-y-3 font-sans">
            <h4 className="font-mono text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Analyzer Capabilities:
            </h4>
            <ul className="space-y-2 text-slate-300 list-disc list-inside">
              <li><strong className="text-white">Security Score Index (0-100):</strong> Evaluates budget risk, prompt vulnerability, and anomaly frequency.</li>
              <li><strong className="text-white">Threat Vector Mapping:</strong> Identifies prompt injection vectors and single-transaction limit variances.</li>
              <li><strong className="text-white">Strategic Suggestions:</strong> Provides categorized advice across Financial Safety, Prompt Defense, and Access Control.</li>
              <li><strong className="text-white">1-Click Policy Execution:</strong> Instantly apply dual-approval requirements or set sensitivity to strict without manual coding.</li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => setActiveView('analyzer')}
                className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-[#05070a] font-mono font-bold text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              >
                <Bot className="w-4 h-4" /> Open Analyzer Agent View Now
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'guardrails-freeze',
      title: '5. Guardrail Configuration & Quick Freeze',
      icon: Zap,
      content: (
        <div className="space-y-4 text-slate-300 font-sans leading-relaxed text-xs">
          <p className="text-sm">
            AgentWatch provides multi-tiered defense controls to enforce safety limits and respond to emergencies in real time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#05070a] border border-slate-800 space-y-2">
              <h4 className="font-mono text-cyan-400 font-bold flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4" /> Financial Spending Caps
              </h4>
              <p className="text-slate-300">
                Configure monthly budget caps per agent. If an agent attempts to exceed its cap, transactions are automatically blocked with reasoning <code className="text-rose-400">Budget Limit Exceeded</code>.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#05070a] border border-slate-800 space-y-2">
              <h4 className="font-mono text-rose-400 font-bold flex items-center gap-2 text-xs">
                <AlertTriangle className="w-4 h-4" /> Emergency Quick Freeze (Kill Switch)
              </h4>
              <p className="text-slate-300">
                In the event of prompt injection or rogue agent activity, click <strong className="text-rose-400">"Quick Freeze"</strong> on any agent card to immediately suspend all its active tool calls and payouts.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'alerts-compliance',
      title: '6. Security Threats & Compliance Reporting',
      icon: FileText,
      content: (
        <div className="space-y-4 text-slate-300 font-sans leading-relaxed text-xs">
          <p className="text-sm">
            Maintain complete governance and export regulatory compliance reports with 1 click.
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-[#05070a] border border-slate-800 space-y-2">
              <h4 className="font-mono text-amber-400 font-bold text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Managing Security Threat Alerts
              </h4>
              <p className="text-slate-300">
                Filter threats by severity (<span className="text-rose-400 font-bold">Critical</span>, <span className="text-amber-400 font-bold">High</span>, <span className="text-cyan-400 font-bold">Medium</span>). Acknowledge or resolve alerts with custom audit resolution notes.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#05070a] border border-slate-800 space-y-2">
              <h4 className="font-mono text-emerald-400 font-bold text-xs flex items-center gap-2">
                <FileText className="w-4 h-4" /> Generating AI Compliance Audit Reports
              </h4>
              <p className="text-slate-300">
                Navigate to <strong className="text-white">Compliance Reports</strong> and click <strong className="text-cyan-400">"Generate AI Report"</strong> to generate SOC2, ISO27001, or EU AI Act compliance certifications with automated executive sign-offs.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'live-simulation',
      title: '7. Live Guardrail Simulation & FAQ',
      icon: Play,
      content: (
        <div className="space-y-4 text-slate-300 font-sans leading-relaxed text-xs">
          <p className="text-sm">
            Test the live guardrail engine right now by simulating an untrusted prompt injection anomaly!
          </p>

          <div className="p-5 rounded-xl bg-[#05070a] border border-cyan-500/40 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-bold flex items-center gap-2 text-xs">
                <Terminal className="w-4 h-4" /> Interactive Guardrail Anomaly Tester
              </span>
            </div>

            <p className="text-slate-400 font-sans text-xs">
              Clicking the button below will send a high-velocity prompt injection transaction to the live intercept engine and verify detection latency.
            </p>

            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="px-4 py-2.5 rounded bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.4)] disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${simulating ? 'animate-bounce' : ''}`} />
              {simulating ? 'Intercepting Anomaly...' : 'Simulate Live Prompt Injection Anomaly'}
            </button>

            {simulationMsg && (
              <div className="p-3 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{simulationMsg}</span>
              </div>
            )}
          </div>

          <h3 className="font-mono text-sm font-bold text-white pt-4 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded bg-[#05070a] border border-slate-800 space-y-1">
              <strong className="text-cyan-300 font-mono block">Q: Does AgentWatch delay my AI agent tool execution?</strong>
              <p className="text-slate-300">A: No. The intercept engine processes incoming JSON payloads with a latency of &lt;15ms.</p>
            </div>

            <div className="p-3.5 rounded bg-[#05070a] border border-slate-800 space-y-1">
              <strong className="text-cyan-300 font-mono block">Q: How do I unfreeze an agent after an anomaly?</strong>
              <p className="text-slate-300">A: Go to the AI Fleet tab, select the frozen agent, review the alert log, and click "Resume Agent" once verified.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const filteredSections = sections.filter(sec => 
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans text-slate-200">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-gradient-to-r from-[#0d1117] via-[#091523] to-[#0d1117] border border-cyan-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-mono text-white tracking-wide flex items-center gap-2">
                AgentWatch End-to-End User Manual
              </h1>
              <p className="text-xs text-slate-400">
                Complete operational documentation, SDK integration guides, API specs & guardrail handbook.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-72 z-10 font-mono text-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search user manual topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#05070a] border border-cyan-500/30 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* MANUAL BODY CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-1 space-y-2 font-mono text-xs">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider px-2 font-bold mb-2">
            Manual Table of Contents
          </div>

          <div className="space-y-1">
            {filteredSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
                    activeSection === sec.id
                      ? 'bg-cyan-500 text-[#05070a] font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                      : 'bg-[#0d1117] text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{sec.title.split('.')[1]}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                </button>
              );
            })}
          </div>

          {/* Quick Links Card */}
          <div className="p-4 rounded-xl bg-[#0d1117] border border-slate-800 space-y-2 pt-4">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Quick Actions</div>
            <button
              onClick={() => setActiveView('analyzer')}
              className="w-full py-2 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" /> Run Analyzer Agent
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className="w-full py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> Open Mission Control
            </button>
          </div>
        </div>

        {/* MAIN READING AREA */}
        <div className="lg:col-span-3 space-y-6">
          {sections.map((sec) => {
            if (activeSection !== sec.id && searchQuery === '') return null;
            if (searchQuery !== '' && !sec.title.toLowerCase().includes(searchQuery.toLowerCase())) return null;

            const Icon = sec.icon;

            return (
              <div key={sec.id} className="p-6 rounded-xl bg-[#0d1117] border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4 font-mono">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-bold text-white tracking-wide">
                    {sec.title}
                  </h2>
                </div>

                {sec.content}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
