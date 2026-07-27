
# Run and deploy 

This contains everything you need to run your website locally.

View your website: https://agent-watch-fawn.vercel.app/

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the website:
   `npm run dev`
-----------------------------------------------------------------------------------
# 🛡️ AgentWatch

> Real-time AI Firewall for Autonomous AI Agents

Monitor, secure, and control autonomous AI agents with real-time protection against prompt injection, runaway spending, infinite tool loops, and compliance violations.

Built with React, Express, Firebase, and Google Gemini.

![License](https://img.shields.io/badge/license-MIT-blue)

![React](https://img.shields.io/badge/React-18-blue)

![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

![Firebase](https://img.shields.io/badge/Firebase-orange)

![Gemini](https://img.shields.io/badge/Google-Gemini-purple)

## Problem Statement

Autonomous AI agents can execute thousands of API calls without human supervision.

Organizations face several critical risks:

• Unlimited AI spending

• Infinite reasoning or tool-calling loops

• Prompt injection attacks

• Sensitive data leakage

• Lack of audit logs

• Missing compliance with SOC2, ISO27001, and the EU AI Act

Without centralized monitoring, AI agents become difficult to control and expensive to operate.

## Solution

AgentWatch acts as a real-time security firewall between AI agents and external tools.

Every request is intercepted, analyzed, monitored, and logged before execution.

Core capabilities include:

- Prompt injection detection
- Velocity-based spending limits
- AI-powered security auditing using Gemini
- One-click emergency kill switch
- Compliance report generation
- Complete audit trail

## 📊 Market Opportunity & Industry Insights

The rapid rise of **Agentic AI** is transforming enterprise software by enabling autonomous systems to reason, plan, and execute complex workflows with minimal human intervention. While AI adoption continues to accelerate, **governance, security, and financial oversight have not kept pace**, creating a significant opportunity for AI governance platforms.

### Industry Statistics

| Industry Insight | Statistic | Source |
|------------------|:---------:|--------|
| Organizations not prepared to adopt AI in day-to-day operations | **86%** | McKinsey – *The State of Organizations 2026* |
| Organizations deploying AI in at least one business function | **88%** | McKinsey – *The State of AI 2025* |
| Organizations experimenting with AI agents | **62%** | McKinsey – *The State of AI 2025* |
| Executives planning to increase AI budgets because of AI agents | **88%** | PwC AI Agent Survey |
| Companies already adopting AI agents | **79%** | PwC AI Agent Survey |

---

## 🚨 The Enterprise AI Governance Gap

As organizations deploy increasingly autonomous AI agents, they face several critical challenges:

- 💸 **Uncontrolled AI spending** and budget overruns
- 🔁 **Infinite reasoning** or tool-calling loops
- 🛡️ **Prompt injection** and agent hijacking attacks
- 📋 **Limited auditability** and operational visibility
- ⚖️ **Compliance challenges** with **SOC 2**, **ISO 27001**, and the **EU AI Act**

Without centralized monitoring and governance, autonomous AI agents can become costly, difficult to control, and challenging to secure.

---

## 🛡️ Why AgentWatch?

**AgentWatch** is a **B2B SaaS AI Governance Platform** that acts as a real-time security and financial control layer between autonomous AI agents and external tools or APIs.

It enables organizations to deploy AI agents safely by providing:

- ⚡ **Sub-15 ms** real-time request inspection
- 🛡️ Prompt injection detection and threat prevention
- 💰 Velocity-based spending limits and budget controls
- 🤖 Google Gemini-powered **Master Analyzer** for AI security audits
- 🚨 One-click **Emergency Quick Freeze (Kill Switch)**
- 📊 Complete audit logs and execution traceability
- 📑 Automated compliance reporting for **SOC 2**, **ISO 27001**, and the **EU AI Act**

AgentWatch empowers enterprises to scale autonomous AI systems with **security, transparency, compliance, and financial control**.

---

| Feature                    | Description                        |
| -------------------------- | ---------------------------------- |
| AI Firewall                | Intercepts every AI request        |
| Prompt Injection Detection | Blocks malicious prompts           |
| Spending Guard             | Prevents budget overruns           |
| Kill Switch                | Stops every active agent instantly |
| Master Analyzer            | Gemini-powered security analysis   |
| Audit Logs                 | Full execution history             |
| Compliance Reports         | SOC2, ISO27001, EU AI Act          |
| Dashboard                  | Real-time monitoring               |


User
 │
 ▼
AI Agent
 │
 ▼
AgentWatch Firewall
 │
 ├── Prompt Injection Detection
 ├── Spending Guard
 ├── Kill Switch
 ├── Audit Logger
 └── Gemini Master Analyzer
 │
 ▼
External APIs



| Layer      | Technology    |
| ---------- | ------------- |
| Frontend   | React 18      |
| Language   | TypeScript    |
| Styling    | Tailwind CSS  |
| Backend    | Express.js    |
| Database   | Firebase      |
| AI         | Google Gemini |
| Build Tool | Vite          |
