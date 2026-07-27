export type AgentStatus = 'Active' | 'Suspended' | 'Flagged' | 'Throttled' | 'Idle';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  riskScore: number; // 0 to 100
  model: string;
  budgetLimit: number;
  currentSpend: number;
  department: string;
  lastActive: string;
  createdDate: string;
  promptInjectionRisk: number; // 0-100
  anomalyRate: number; // percentage
  avatarColor?: string;
  maxSingleTxLimit: number;
  autoFreezeEnabled: boolean;
}

export type TransactionStatus = 'Approved' | 'Flagged' | 'Blocked' | 'Pending Review';

export interface Transaction {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  recipient: string;
  amount: number;
  category: string;
  anomalyScore: number; // 0 to 100
  status: TransactionStatus;
  reasoning: string;
  rawPayload: string;
  currency?: string;
}

export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type AlertStatus = 'Active' | 'Acknowledged' | 'Resolved' | 'False Positive';

export interface SecurityAlert {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  threatVector: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export type ReportStatus = 'Compliant' | 'Under Review' | 'Action Required' | 'Draft';

export interface ComplianceReport {
  id: string;
  title: string;
  type: string;
  period: string;
  score: number;
  status: ReportStatus;
  generatedAt: string;
  summary: string;
  framework: string;
  author: string;
  sections?: { heading: string; content: string }[];
}

export interface OrganizationSettings {
  id: string;
  companyName: string;
  globalMaxTransaction: number;
  autoFreezeThreshold: number;
  webhookUrl: string;
  requireDualApproval: boolean;
  securityEmail: string;
  apiKey: string;
  environment: 'Production' | 'Staging' | 'Sandbox';
  anomalySensitivity: 'Low' | 'Medium' | 'High' | 'Strict';
}

export interface AnalyzerRemediation {
  id: string;
  actionType: 'FREEZE_HIGH_RISK' | 'ENABLE_DUAL_APPROVAL' | 'STRICT_SENSITIVITY' | 'LOWER_GLOBAL_LIMIT';
  title: string;
  description: string;
  impact: 'High' | 'Critical' | 'Medium';
  applied: boolean;
}

export interface AnalyzerAgentResult {
  scanTimestamp: string;
  overallScore: number; // 0 - 100 (100 = completely secure)
  healthStatus: 'Optimal Security' | 'Caution Required' | 'Critical Vulnerability';
  totalAgentsAnalyzed: number;
  totalSpendAnalyzed: number;
  activeAlertsAnalyzed: number;
  executiveSummary: string;
  threatVectors: {
    title: string;
    description: string;
    severity: 'Critical' | 'High' | 'Medium';
    affectedAgents: string[];
    suggestedFix: string;
  }[];
  agentBreakdown: {
    agentId: string;
    agentName: string;
    riskScore: number;
    spendRatio: number; // spend / limit percentage
    promptInjectionThreat: number;
    diagnosis: string;
    recommendation: string;
  }[];
  strategicSuggestions: {
    category: 'Financial Safety' | 'Prompt Defense' | 'Governance & Access';
    priority: 'Immediate' | 'High' | 'Recommended';
    title: string;
    details: string;
    expectedOutcome: string;
  }[];
  remediations: AnalyzerRemediation[];
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  accountType: 'Individual' | 'Company';
  companyName: string;
  role: string;
  apiKey: string;
  createdDate: string;
}

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  agentName: string;
  type: 'transaction' | 'alert' | 'status_change' | 'config_update';
  title: string;
  details: string;
  severity?: 'normal' | 'warning' | 'danger';
}
