
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

---

## Screenshot

<img width="3138" height="1444" alt="Capturdqe" src="https://github.com/user-attachments/assets/760824bf-1a7e-459d-bbf6-8a8d019aa8df" />

<img width="3147" height="1451" alt="cw" src="https://github.com/user-attachments/assets/49c85ddb-16c1-44e2-9c1f-3f2d0c2b52af" />

<img width="3041" height="1302" alt="Capteure" src="https://github.com/user-attachments/assets/af3f0a9f-0232-4313-899b-d09407f01aa7" />

<img width="3001" height="1416" alt="Cassspture" src="https://github.com/user-attachments/assets/c65e7fe7-acda-4fd0-9f4b-c992085f1573" />



## 🚀 How to Run the Project

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **Git**
- A **Firebase** project
- A **Google Gemini API Key**

---

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/AgentWatch.git
cd AgentWatch
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file in the project root.

```bash
cp .env.example .env
```

Add your API keys and configuration values:

```env
# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Server
PORT=5000
```

---

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
Frontend: http://localhost:5173
Backend : http://localhost:5000
```

---

### 5. Build for Production

```bash
npm run build
```

---

### 6. Preview the Production Build

```bash
npm run preview
```

---

## 🧪 Available Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Start the development server |
| `npm run build` | Build the project for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run the linter (if configured) |

---

## ✅ Verify Installation

After starting the application:

- Open **http://localhost:5173**
- Ensure the dashboard loads successfully.
- Verify the backend API is running.
- Confirm Firebase connects without errors.
- Test that Google Gemini integration is working.
