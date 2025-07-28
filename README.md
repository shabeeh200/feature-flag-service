# Feature Flag Service

A minimal microservice for managing feature toggles in your applications.

## Features
- Create, read, update, delete feature flags  
- Toggle flags on/off at runtime  
- Secured with a single `X-API-KEY` header  
- In-memory caching for fast lookups

## Tech Stack
- **Backend:** Node.js, Express  
- **Cache:** node-cache  
- **AWS Lambda**

## Roadmap (Work In Progress)

- ✅ Core CRUD & evaluation logic  
- ✅ Redis‑backed caching (multi‑instance safe)  
- 🔄 Admin dashboard (React + JWT authentication)  
- 🌍 Geography‑based rollouts  
- 📊 Metrics & monitoring endpoints  
- 📄 OpenAPI docs

