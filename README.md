# Feature Flag Service

A lightweight, extensible system for managing feature toggles, enabling granular control over feature releases without redeploying code.

## 📌 Project Overview

**Goal:** Decouple feature deployment from code deployment by providing a central service for runtime toggles, targeted rollouts, and analytics.

**Current capabilities:**  
- Create, delete, and manage feature flags via a clean API and dashboard  
- Real-time evaluation logic with rollout percentages and targeted users  
- Stats and analytics for quick flag insights  

**Future vision:**  
Expand into phased rollouts, canary releases, and A/B testing to make it a lightweight experimentation platform.

---

## ✅ Implemented Features

- **CRUD API for Flags** (Create, Read, Update, Delete)  
- **Runtime Evaluation Logic**: `enabled` switch, `rolloutPercentage`, `targetUsers`  
- **Environment Segmentation** (`dev`, `staging`, `prod`)  
- **Redis Caching** for fast lookups  
- **Audit Logging** with `FlagLog` schema  
- **Server-Side Pagination & Rate-Limiting**  
- **Stats Controller** with:
  - Total / enabled / disabled counts
  - Flags per environment
  - Rollout bucket distribution
  - Weekly stats (`newThisWeek`, `evalsThisWeek`)  
- **React + Tailwind Dashboard** with Chart.js visualizations  
- **Dockerized setup** for easy deployment  
- **GitHub Actions** for CI/CD automation

---

## 🧪 Coming Next: Mini A/B-Testing & Experimentation Module

Turn the flag system into a lightweight experimentation platform.

**Planned:**
1. **Experiment Entity** with variants, weights, and metrics  
2. **Variant Assignment Logic** for sticky user experiences  
3. **Event Tracking API** for conversions  
4. **Analytics Dashboard** with lift, conversion rates, and visual charts  
5. **Lightweight SDK** for easy integration  
6. **CI/CD hooks** for automated publishing

---

## 💡 Why This Matters

Feature flags are a powerful tool for modern software delivery.  
With this system (and planned extensions), teams can:

- **Phased Rollouts:** Gradually enable a feature for a percentage of users to reduce risk.  
- **Canary Testing:** Deploy new code to a small segment before a full rollout.  
- **A/B Testing:** Serve different feature variants to different groups and measure impact.  
- **Emergency Kill-Switches:** Instantly disable problematic features without redeploying code.  

This architecture lays the foundation for all these scenarios — even if some are not yet implemented.

---

## 🛠 Tech Stack

**Backend:** Node.js, Express, Mongoose, Redis  
**Frontend:** React, Tailwind CSS, Chart.js (`react-chartjs-2`)  
**Auth:** JWT (planned)  
**DevOps:** Git, Docker, GitHub Actions

---

## 🚀 Usage

1. **Start Backend:**
```bash
cd backend
npm install
npm run dev
2. **Start Frontend:**
```bash
cd frontend
npm install
npm start

