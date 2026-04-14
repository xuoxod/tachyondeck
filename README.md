# 🌌 TachyonDeck

## The Command Center for Zero-Trust Infrastructure

*A beautiful, lightning-fast cross-platform interface securely bridging edge nodes to your pocket.*

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

---

## 📖 Overview

**TachyonDeck** is the sleek, universally adaptable counterpart to the headless **[TachyonFlux](https://github.com/xuoxod/tachyonflux)** edge node. 

Instead of clunky terminals or complicated VPN setup files, TachyonDeck establishes a direct, end-to-end encrypted connection right to your private servers, presenting an elegant management dashboard right on your mobile screen.

## 📚 Documentation & Guides

For the sake of staying clutter-free, we've broken our documentation into dedicated guides:

- **[System Requirements & Quickstart Guide](docs/GETTING_STARTED.md)**
  *Step-by-step instructions for launching your multi-device setup (Mobile, Chrome, Smart TVs) using Expo.*
- **[Actionable Usage Scenarios](docs/USAGE_SCENARIOS.md)**
  *Learn exactly how to use the dashboard on your commute, or as a static Smart Display on an Echo Show.*
- **[Full Usage Manual](USAGE.md)**
  *Learn how to pair devices safely, execute restricted proxy commands, and view UI metrics.*

---

## ⚡ Core Features

- **🚀 Highly Performant Interface:** Optimized list rendering easily handles thousands of rapid terminal logs gracefully.
- **🔒 True NAT Traversal:** Connects straight to your edge nodes without opening router ports via strict data tunneling.
- **📱 Universally Platform-Agnostic:** Code once, run everywhere. Compiles natively to iOS, Android, and modern Web browsers.

---

## 🧪 Running the Test Suite

TachyonDeck is built with an unwavering emphasis on Test-Driven Development (TDD).

To execute the test suite:
```bash
npm run test
```

---

## 🤝 Open Source Best Practices

- **Strict Validation:** Always run the local test suites to ensure edge-node architectural safety before submitting updates.
- **Clean Architecture:** Interface modules are elegantly uncoupled from the under-the-hood encryption drivers, allowing for continuous UI evolution without risking tunnel stability.
