# Feature Flag Service

A lightweight, extensible system for managing feature toggles that enables granular control over feature releases without redeploying code.

## Project Overview

Core goal: Decouple feature deployment from code deployment by providing a central service for runtime toggles, targeted rollouts, and audit logs.

Ideal for:
- Phased rollouts
- Canary tests
- A/B experiments
- Emergency kill-switches

## Features

### Core Features
- CRUD API for Flags (Create, Read, Update, Delete via authenticated endpoints)
- Runtime Evaluation Logic with:
  - `enabled` switch
  - `rolloutPercentage` buckets (0-25, 26-50, 51-75, 76-100)
  - `targetUsers` list
- Environment Segmentation (dev, staging, prod)
- Redis Caching for sub-millisecond lookups
- Audit Logging with `FlagLog` schema
- Server-Side Pagination & Rate-Limiting
- Stats Controller (`/api/flags/stats`) with metrics:
  - Total, enabled/disabled counts
  - Flags per environment
  - Rollout bucket distribution
  - `newThisWeek`, `evalsThisWeek`

### Dashboard
- React + Tailwind UI
- Stat cards (KPI widgets)
- Charts (Pie, Bar, Horizontal Bar) via Chart.js
- Mock Users for testing

## Tech Stack

**Backend**: Node.js, Express, Mongoose (MongoDB), Redis  
**Frontend**: React.js, Tailwind CSS, Chart.js (`react-chartjs-2`)  
**Auth & Security**: JWT auth (planned), rate-limiter  
**DevOps**: Git, Docker (planned), GitHub Actions (planned)

## Usage

1. Start Backend:
```bash
npm install && npm run dev
2. Start Frontend:
```bash
npm install && npm start
