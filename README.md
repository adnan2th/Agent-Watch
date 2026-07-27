
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
