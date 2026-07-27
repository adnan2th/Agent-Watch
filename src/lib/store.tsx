import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  getDocs,
  updateDoc,
  addDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Agent, Transaction, SecurityAlert, ComplianceReport, OrganizationSettings, ActivityFeedItem, AgentStatus, UserProfile, AnalyzerAgentResult } from '../types';
import { initialAgents, initialTransactions, initialAlerts, initialReports, initialSettings } from './seedData';

interface AgentWatchContextType {
  agents: Agent[];
  transactions: Transaction[];
  alerts: SecurityAlert[];
  reports: ComplianceReport[];
  settings: OrganizationSettings;
  activityFeed: ActivityFeedItem[];
  loading: boolean;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedAgentId: string | null;
  setSelectedAgentId: (id: string | null) => void;
  addAgent: (agentData: Omit<Agent, 'id' | 'riskScore' | 'currentSpend' | 'lastActive' | 'createdDate' | 'promptInjectionRisk' | 'anomalyRate'>) => Promise<Agent>;
  updateAgentStatus: (agentId: string, status: AgentStatus) => Promise<void>;
  updateAgentLimits: (agentId: string, budgetLimit: number, maxSingleTxLimit: number, autoFreezeEnabled: boolean) => Promise<void>;
  toggleKillSwitch: (agentId: string) => Promise<void>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  resolveAlert: (alertId: string, resolvedBy: string, notes: string) => Promise<void>;
  triggerSimulatedAnomaly: () => Promise<void>;
  generateAIComplianceReport: (title: string, framework: string) => Promise<ComplianceReport | null>;
  sendLiveIntercept: (payload: { agentId: string; agentName?: string; payloadType?: 'transaction' | 'prompt_input' | 'log'; amount?: number; vendor?: string; promptText?: string; details?: string }) => Promise<any>;
  saveSettings: (newSettings: Partial<OrganizationSettings>) => Promise<void>;
  currentUser: UserProfile | null;
  registerAccount: (userData: Omit<UserProfile, 'id' | 'apiKey' | 'createdDate'>) => Promise<UserProfile>;
  logoutUser: () => void;
  analyzerResult: AnalyzerAgentResult | null;
  isAnalyzing: boolean;
  runAnalyzerAgentScan: () => Promise<AnalyzerAgentResult | null>;
  applyAnalyzerRemediation: (actionType: string) => Promise<void>;
  refreshDatabase: () => Promise<void>;
}

const AgentWatchContext = createContext<AgentWatchContextType | null>(null);

export const AgentWatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(initialAlerts);
  const [reports, setReports] = useState<ComplianceReport[]>(initialReports);
  const [settings, setSettings] = useState<OrganizationSettings>(initialSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<string>('landing'); // 'landing', 'dashboard', 'agents', 'transactions', 'alerts', 'reports', 'settings'
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // Computed Activity Feed
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);

  // Seed Firestore if empty
  const seedIfEmpty = useCallback(async () => {
    try {
      // Agents check
      const agentsSnap = await getDocs(collection(db, 'agents'));
      if (agentsSnap.empty) {
        for (const agent of initialAgents) {
          await setDoc(doc(db, 'agents', agent.id), agent);
        }
      }

      // Transactions check
      const txSnap = await getDocs(collection(db, 'transactions'));
      if (txSnap.empty) {
        for (const tx of initialTransactions) {
          await setDoc(doc(db, 'transactions', tx.id), tx);
        }
      }

      // Alerts check
      const alertSnap = await getDocs(collection(db, 'alerts'));
      if (alertSnap.empty) {
        for (const alt of initialAlerts) {
          await setDoc(doc(db, 'alerts', alt.id), alt);
        }
      }

      // Reports check
      const reportSnap = await getDocs(collection(db, 'reports'));
      if (reportSnap.empty) {
        for (const rep of initialReports) {
          await setDoc(doc(db, 'reports', rep.id), rep);
        }
      }

      // Settings check
      const settingsSnap = await getDocs(collection(db, 'settings'));
      if (settingsSnap.empty) {
        await setDoc(doc(db, 'settings', initialSettings.id), initialSettings);
      }
    } catch (err) {
      console.warn('Seeding fallback to local state:', err);
    }
  }, []);

  // Listen to Firestore
  useEffect(() => {
    seedIfEmpty();

    const unsubAgents = onSnapshot(collection(db, 'agents'), (snap) => {
      if (!snap.empty) {
        const list: Agent[] = [];
        snap.forEach((doc) => list.push(doc.data() as Agent));
        setAgents(list);
      }
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'agents');
      setLoading(false);
    });

    const unsubTx = onSnapshot(collection(db, 'transactions'), (snap) => {
      if (!snap.empty) {
        const list: Transaction[] = [];
        snap.forEach((doc) => list.push(doc.data() as Transaction));
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setTransactions(list);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'transactions');
    });

    const unsubAlerts = onSnapshot(collection(db, 'alerts'), (snap) => {
      if (!snap.empty) {
        const list: SecurityAlert[] = [];
        snap.forEach((doc) => list.push(doc.data() as SecurityAlert));
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setAlerts(list);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'alerts');
    });

    const unsubReports = onSnapshot(collection(db, 'reports'), (snap) => {
      if (!snap.empty) {
        const list: ComplianceReport[] = [];
        snap.forEach((doc) => list.push(doc.data() as ComplianceReport));
        list.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
        setReports(list);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'reports');
    });

    const unsubSettings = onSnapshot(collection(db, 'settings'), (snap) => {
      if (!snap.empty) {
        const item = snap.docs[0].data() as OrganizationSettings;
        setSettings(item);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'settings');
    });

    return () => {
      unsubAgents();
      unsubTx();
      unsubAlerts();
      unsubReports();
      unsubSettings();
    };
  }, [seedIfEmpty]);

  // Derive Activity Feed
  useEffect(() => {
    const feed: ActivityFeedItem[] = [];

    transactions.slice(0, 15).forEach((tx) => {
      feed.push({
        id: `act-tx-${tx.id}`,
        timestamp: tx.timestamp,
        agentName: tx.agentName,
        type: 'transaction',
        title: `${tx.status === 'Approved' ? 'Executed' : tx.status} $${tx.amount.toLocaleString()} to ${tx.recipient.slice(0, 24)}...`,
        details: `Category: ${tx.category} | Anomaly Score: ${tx.anomalyScore}`,
        severity: tx.anomalyScore > 75 ? 'danger' : tx.anomalyScore > 40 ? 'warning' : 'normal',
      });
    });

    alerts.slice(0, 10).forEach((alt) => {
      feed.push({
        id: `act-alt-${alt.id}`,
        timestamp: alt.timestamp,
        agentName: alt.agentName,
        type: 'alert',
        title: `SECURITY ALERT: ${alt.title}`,
        details: `${alt.severity} severity - Threat: ${alt.threatVector}`,
        severity: alt.severity === 'Critical' || alt.severity === 'High' ? 'danger' : 'warning',
      });
    });

    feed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setActivityFeed(feed.slice(0, 25));
  }, [transactions, alerts]);

  // Actions
  const addAgent = async (agentData: Omit<Agent, 'id' | 'riskScore' | 'currentSpend' | 'lastActive' | 'createdDate' | 'promptInjectionRisk' | 'anomalyRate'>): Promise<Agent> => {
    const id = `agent-${String(agents.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    
    const newAgent: Agent = {
      ...agentData,
      id,
      riskScore: 12, // Default safe baseline for newly provisioned agent
      currentSpend: 0,
      lastActive: 'Just now',
      createdDate: now.slice(0, 10),
      promptInjectionRisk: 5,
      anomalyRate: 0.0,
      status: 'Active',
      avatarColor: 'from-cyan-500 to-blue-600'
    };

    setAgents(prev => [newAgent, ...prev]);

    try {
      await setDoc(doc(db, 'agents', newAgent.id), newAgent);
    } catch (err) {
      console.warn('Agent saved to local state');
    }

    return newAgent;
  };

  const updateAgentStatus = async (agentId: string, status: AgentStatus) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status } : a));
    try {
      await updateDoc(doc(db, 'agents', agentId), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `agents/${agentId}`);
    }
  };

  const updateAgentLimits = async (agentId: string, budgetLimit: number, maxSingleTxLimit: number, autoFreezeEnabled: boolean) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, budgetLimit, maxSingleTxLimit, autoFreezeEnabled } : a));
    try {
      await updateDoc(doc(db, 'agents', agentId), { budgetLimit, maxSingleTxLimit, autoFreezeEnabled });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `agents/${agentId}`);
    }
  };

  const toggleKillSwitch = async (agentId: string) => {
    const target = agents.find(a => a.id === agentId);
    if (!target) return;
    const newStatus: AgentStatus = target.status === 'Suspended' ? 'Active' : 'Suspended';
    await updateAgentStatus(agentId, newStatus);
  };

  const acknowledgeAlert = async (alertId: string) => {
    setAlerts(prev => prev.map(alt => alt.id === alertId ? { ...alt, status: 'Acknowledged' } : alt));
    try {
      await updateDoc(doc(db, 'alerts', alertId), { status: 'Acknowledged' });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `alerts/${alertId}`);
    }
  };

  const resolveAlert = async (alertId: string, resolvedBy: string, notes: string) => {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setAlerts(prev => prev.map(alt => alt.id === alertId ? {
      ...alt,
      status: 'Resolved',
      resolvedBy: resolvedBy || 'Security Admin',
      resolvedAt: now,
      resolutionNotes: notes
    } : alt));
    try {
      await updateDoc(doc(db, 'alerts', alertId), {
        status: 'Resolved',
        resolvedBy: resolvedBy || 'Security Admin',
        resolvedAt: now,
        resolutionNotes: notes
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `alerts/${alertId}`);
    }
  };

  const triggerSimulatedAnomaly = async () => {
    const randomId = Math.floor(Math.random() * 9000 + 1000);
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    
    const newTx: Transaction = {
      id: `tx-sim-${randomId}`,
      timestamp: now,
      agentId: 'agent-005',
      agentName: 'VendorPay-AI',
      recipient: 'Simulated Off-Grid Routing Node #409',
      amount: Math.floor(Math.random() * 35000 + 15000),
      category: 'Simulated High-Risk Wire',
      anomalyScore: Math.floor(Math.random() * 20 + 80),
      status: 'Flagged',
      reasoning: 'Interactive Guardrail Sandbox Interception: Unexpected destination routing & velocity surge detected.',
      rawPayload: JSON.stringify({ action: "sandbox_simulation", amount: 25000, trigger: "live_interactive_demo" })
    };

    const newAlt: SecurityAlert = {
      id: `alt-sim-${randomId}`,
      timestamp: now,
      agentId: 'agent-005',
      agentName: 'VendorPay-AI',
      title: 'SIMULATED: Off-Grid Wire Intercepted',
      description: `Live Sandbox Interception of $${newTx.amount.toLocaleString()} wire attempt to unverified routing address. NeuralGuard blocked transaction.`,
      severity: 'Critical',
      status: 'Active',
      threatVector: 'Neural Sandbox Anomaly Sweep',
    };

    setTransactions(prev => [newTx, ...prev]);
    setAlerts(prev => [newAlt, ...prev]);

    try {
      await setDoc(doc(db, 'transactions', newTx.id), newTx);
      await setDoc(doc(db, 'alerts', newAlt.id), newAlt);
    } catch (err) {
      console.warn('Simulation saved to local state');
    }
  };

  const sendLiveIntercept = async (payload: { agentId: string; agentName?: string; payloadType?: 'transaction' | 'prompt_input' | 'log'; amount?: number; vendor?: string; promptText?: string; details?: string }) => {
    try {
      const res = await fetch('/api/v1/intercept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success && data.interceptResult) {
        const now = data.interceptResult.timestamp || new Date().toISOString().replace('T', ' ').slice(0, 19);
        const targetAgent = agents.find(a => a.id === payload.agentId);
        const agentName = payload.agentName || targetAgent?.name || payload.agentId;

        // Create UI transaction entry
        if (payload.payloadType === 'transaction' && payload.amount) {
          const newTx: Transaction = {
            id: data.interceptResult.transactionId || `tx-api-${Date.now()}`,
            timestamp: now,
            agentId: payload.agentId,
            agentName,
            recipient: payload.vendor || 'External API Webhook',
            amount: Number(payload.amount),
            category: 'API Webhook Intercept',
            anomalyScore: data.interceptResult.riskScore,
            status: data.interceptResult.status === 'APPROVED' ? 'Approved' : data.interceptResult.status === 'BLOCKED' ? 'Blocked' : 'Flagged',
            reasoning: data.interceptResult.decisionReason,
            rawPayload: JSON.stringify(payload, null, 2)
          };

          setTransactions(prev => [newTx, ...prev]);
          try {
            await setDoc(doc(db, 'transactions', newTx.id), newTx);
          } catch (e) {
            console.warn('Tx saved locally');
          }

          // Update agent spend
          if (targetAgent && data.interceptResult.status === 'APPROVED') {
            const updatedSpend = targetAgent.currentSpend + Number(payload.amount);
            setAgents(prev => prev.map(a => a.id === targetAgent.id ? { ...a, currentSpend: updatedSpend, lastActive: 'Just now' } : a));
            try {
              await updateDoc(doc(db, 'agents', targetAgent.id), { currentSpend: updatedSpend, lastActive: 'Just now' });
            } catch (e) {
              console.warn('Agent spend updated locally');
            }
          }
        }

        // If alert generated
        if (data.interceptResult.alertGenerated) {
          const newAlt: SecurityAlert = {
            id: `alt-api-${Date.now()}`,
            timestamp: now,
            agentId: payload.agentId,
            agentName,
            title: data.interceptResult.status === 'BLOCKED' ? 'API Intercept: Threat Blocked' : 'API Intercept: Risk Flagged',
            description: data.interceptResult.decisionReason,
            severity: data.interceptResult.status === 'BLOCKED' ? 'High' : 'Medium',
            status: 'Active',
            threatVector: payload.promptText ? 'Prompt Injection Pattern' : 'Transaction Boundary Breach'
          };

          setAlerts(prev => [newAlt, ...prev]);
          try {
            await setDoc(doc(db, 'alerts', newAlt.id), newAlt);
          } catch (e) {
            console.warn('Alert saved locally');
          }
        }
      }
      return data;
    } catch (err) {
      console.error('API Intercept call failed:', err);
      return { success: false, error: 'Failed to contact API interceptor server' };
    }
  };

  const generateAIComplianceReport = async (title: string, framework: string): Promise<ComplianceReport | null> => {
    try {
      const response = await fetch('/api/generate-audit-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          framework,
          agentCount: agents.length,
          totalSpend: agents.reduce((sum, a) => sum + a.currentSpend, 0),
          alertCount: alerts.filter(a => a.status === 'Active').length,
          anomalyRate: '1.2%'
        })
      });

      const data = await response.json();
      if (data && data.report) {
        const id = `rep-gen-${Math.floor(Math.random() * 9000 + 1000)}`;
        const newReport: ComplianceReport = {
          id,
          title: data.report.title || title,
          type: 'AI Audit Report',
          period: 'Live Audit Snapshot',
          score: data.report.score || 95,
          status: 'Compliant',
          generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
          summary: data.report.summary || 'Automated compliance report successfully compiled.',
          framework: data.report.framework || framework,
          author: 'AgentWatch Gemini AI Core',
          sections: data.report.sections || []
        };

        setReports(prev => [newReport, ...prev]);
        try {
          await setDoc(doc(db, 'reports', newReport.id), newReport);
        } catch (e) {
          console.warn('Report saved to local state');
        }

        return newReport;
      }
    } catch (err) {
      console.error('Failed to generate report via API:', err);
    }
    return null;
  };

  const saveSettings = async (newSettings: Partial<OrganizationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await updateDoc(doc(db, 'settings', settings.id), updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `settings/${settings.id}`);
    }
  };

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('agentwatch_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default workspace account
    return {
      id: 'usr-001',
      fullName: 'Alex Vance',
      email: 'alex.vance@enterprise-ai.io',
      accountType: 'Company',
      companyName: 'Apex AI Systems',
      role: 'Chief Information Security Officer (CISO)',
      apiKey: 'aw_live_key_994821a07c3e',
      createdDate: new Date().toISOString().slice(0, 10)
    };
  });

  const registerAccount = async (userData: Omit<UserProfile, 'id' | 'apiKey' | 'createdDate'>): Promise<UserProfile> => {
    const id = `usr-${Date.now().toString().slice(-6)}`;
    const apiKey = `aw_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 6)}`;
    const createdDate = new Date().toISOString().slice(0, 10);

    const newProfile: UserProfile = {
      ...userData,
      id,
      apiKey,
      createdDate
    };

    setCurrentUser(newProfile);
    localStorage.setItem('agentwatch_user', JSON.stringify(newProfile));

    // Update settings company name if provided
    if (userData.companyName) {
      await saveSettings({ companyName: userData.companyName, securityEmail: userData.email, apiKey });
    }

    try {
      await setDoc(doc(db, 'users', id), newProfile);
    } catch (err) {
      console.warn('User profile saved locally');
    }

    return newProfile;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('agentwatch_user');
  };

  const [analyzerResult, setAnalyzerResult] = useState<AnalyzerAgentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const runAnalyzerAgentScan = async (): Promise<AnalyzerAgentResult | null> => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/v1/analyzer-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agents,
          transactions,
          alerts,
          settings
        })
      });

      if (!res.ok) throw new Error('Failed to fetch analyzer response');
      const data = await res.json();
      if (data && data.result) {
        setAnalyzerResult(data.result);
        setIsAnalyzing(false);
        return data.result;
      }
    } catch (err) {
      console.warn('Analyzer endpoint fallback:', err);
    }

    // Fallback computed result if fetch fails
    const totalSpend = agents.reduce((sum, a) => sum + a.currentSpend, 0);
    const activeAlertsCount = alerts.filter(a => a.status === 'Active').length;
    const highRiskAgents = agents.filter(a => a.riskScore > 60);

    const fallbackRes: AnalyzerAgentResult = {
      scanTimestamp: new Date().toISOString(),
      overallScore: highRiskAgents.length > 1 ? 78 : 94,
      healthStatus: highRiskAgents.length > 1 ? 'Caution Required' : 'Optimal Security',
      totalAgentsAnalyzed: agents.length,
      totalSpendAnalyzed: totalSpend,
      activeAlertsAnalyzed: activeAlertsCount,
      executiveSummary: `Analyzer Agent scanned ${agents.length} active AI agents and $${totalSpend.toLocaleString()} in total transaction volume. System guardrails are functioning cleanly with ${activeAlertsCount} active alerts monitored.`,
      threatVectors: [
        {
          title: "Prompt Injection Attack Vector",
          description: "Potential context override attempt detected in recent webhook inputs.",
          severity: "High",
          affectedAgents: ["ProcureBot-X", "TreasuryDesk-X"],
          suggestedFix: "Enable Strict Prompt Sanitization and set Anomaly Sensitivity to Strict."
        }
      ],
      agentBreakdown: agents.map(a => ({
        agentId: a.id,
        agentName: a.name,
        riskScore: a.riskScore,
        spendRatio: Math.round((a.currentSpend / a.budgetLimit) * 100),
        promptInjectionThreat: a.promptInjectionRisk,
        diagnosis: a.riskScore > 60 ? `Elevated risk score (${a.riskScore}/100). High spend ratio vs budget limit.` : 'Optimal execution with normal parameter behavior.',
        recommendation: a.riskScore > 60 ? 'Throttling limit recommended to prevent budget overrun.' : 'Continue standard 24h cycle monitoring.'
      })),
      strategicSuggestions: [
        {
          category: "Financial Safety",
          priority: "Immediate",
          title: "Enable Dual-Approval on High Transactions",
          details: "Require compliance sign-off for single transactions over $10,000.",
          expectedOutcome: "Eliminates risk of unapproved autonomous payouts."
        },
        {
          category: "Prompt Defense",
          priority: "High",
          title: "Sanitize External API Prompt Payloads",
          details: "Wrap external agent input prompts in zero-trust isolation tags.",
          expectedOutcome: "Blocks prompt injection and instruction hijack."
        }
      ],
      remediations: [
        {
          id: "rem-1",
          actionType: "ENABLE_DUAL_APPROVAL",
          title: "Turn On Dual-Approval Policy",
          description: "Require dual compliance approval for payments >$10,000.",
          impact: "Critical",
          applied: settings.requireDualApproval
        },
        {
          id: "rem-2",
          actionType: "STRICT_SENSITIVITY",
          title: "Set Anomaly Sensitivity to Strict",
          description: "Automatically flag subtle transaction deviations.",
          impact: "High",
          applied: settings.anomalySensitivity === "Strict"
        },
        {
          id: "rem-3",
          actionType: "FREEZE_HIGH_RISK",
          title: "Throttle High Risk Agents (>75 Risk)",
          description: "Pause or throttle agents with elevated risk scores.",
          impact: "High",
          applied: false
        }
      ]
    };

    setAnalyzerResult(fallbackRes);
    setIsAnalyzing(false);
    return fallbackRes;
  };

  const applyAnalyzerRemediation = async (actionType: string) => {
    if (actionType === 'ENABLE_DUAL_APPROVAL') {
      await saveSettings({ requireDualApproval: true });
    } else if (actionType === 'STRICT_SENSITIVITY') {
      await saveSettings({ anomalySensitivity: 'Strict' });
    } else if (actionType === 'FREEZE_HIGH_RISK') {
      // Throttle all agents with riskScore > 60
      const riskyAgents = agents.filter(a => a.riskScore > 60);
      for (const agent of riskyAgents) {
        await updateAgentStatus(agent.id, 'Throttled');
      }
    }

    // Update local remediations state
    if (analyzerResult) {
      setAnalyzerResult({
        ...analyzerResult,
        remediations: analyzerResult.remediations.map(r => 
          r.actionType === actionType ? { ...r, applied: true } : r
        )
      });
    }
  };

  const refreshDatabase = async () => {
    setLoading(true);
    await seedIfEmpty();
    setLoading(false);
  };

  return (
    <AgentWatchContext.Provider value={{
      agents,
      transactions,
      alerts,
      reports,
      settings,
      activityFeed,
      loading,
      activeView,
      setActiveView,
      selectedAgentId,
      setSelectedAgentId,
      addAgent,
      updateAgentStatus,
      updateAgentLimits,
      toggleKillSwitch,
      acknowledgeAlert,
      resolveAlert,
      triggerSimulatedAnomaly,
      generateAIComplianceReport,
      sendLiveIntercept,
      saveSettings,
      currentUser,
      registerAccount,
      logoutUser,
      analyzerResult,
      isAnalyzing,
      runAnalyzerAgentScan,
      applyAnalyzerRemediation,
      refreshDatabase,
    }}>
      {children}
    </AgentWatchContext.Provider>
  );
};

export const useAgentWatch = () => {
  const context = useContext(AgentWatchContext);
  if (!context) {
    throw new Error('useAgentWatch must be used within an AgentWatchProvider');
  }
  return context;
};
