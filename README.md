# 🌌 TachyonDeck

## The Mobile Command Center for Zero-Trust Infrastructure

*A beautiful, lightning-fast cross-platform terminal interface securely bridging WebRTC edges to your pocket.*

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)

---

## 📖 Overview

**TachyonDeck** is the sleek, mobile-exclusive counterpart to the headless [TachyonFlux](https://github.com/xuoxod/tachyonflux) edge node.

Instead of dealing with clunky mobile SSH clients or complicated VPNs, TachyonDeck establishes a direct, end-to-end encrypted peer connection right to your remote servers and smart homes. It gives you an elegant, lag-free management dashboard right natively on your iOS, Android, or Web device.

---

## ⚡ Core Features

- **🚀 Highly Performant Terminal UI:** Leverages deeply optimized list virtualization to handle thousands of lines of rapid terminal logs without stuttering.
- **🔒 True NAT Traversal:** Connects straight to your edge nodes without opening router ports via strict WebRTC tunneling.
- **📱 True Cross-Platform:** Built natively using React Native. Compile flawlessly to iOS, Android, and Web PWA via Expo.
- **🛠️ Zero-Trust Design:** Never exposes your infrastructure IP addresses to the public internet.

---

## 📚 Official Guides & Documentation

- [**TachyonDeck Mobile Usage Guide**](https://github.com/xuoxod/tachyondeck/blob/main/USAGE.md) - Step-by-step instructions for securely controlling your servers from your phone.
- [**Architectural Documentation**](https://github.com/xuoxod/tachyondeck/tree/main/docs) - A deeper look at how the app performs headless DataChannel operations underneath the UI.
- [**The TachyonFlux Edge Node**](https://github.com/xuoxod/tachyonflux) - Head to the main zero-trust tunnel agent repository to see how the other half of the magic works!

---

## 🛠️ Developer Quickstart

To run the open-source version locally:

1. Ensure you have Node.js 18+ and `npm` installed. We highly recommend downloading the **Expo Go** app on your physical mobile device for immediate testing!

```bash
# 1. Clone & Enter Directory
git clone https://github.com/xuoxod/tachyondeck.git
cd tachyondeck

# 2. Install Dependencies
npm install --legacy-peer-deps

# 3. Launch the Bundler
npx expo start
```

1. Scan the generated QR code using your physical device's camera (iOS) or the Expo Go app (Android) to load the UI straight to your screen!

---

## � Running the Test Suite

TachyonDeck is built with a deep emphasis on Test-Driven Development (TDD). We simulate an entire raw WebSocket Network Server and WebRTC DataChannel lifecycle to test Edge Cases (like malformed JSON and connection drops) entirely headless inside Node.js.

To run the Jest test suite:

```bash
npm run test
```

---

## �🤝 Open Source Best Practices

- **Strict CI Pipeline:** This repository follows a strict TDD methodology. Always run your local test suites before submitting Pull Requests.
- **Clean Architecture:** Our UI components (views) are completely decoupled from our headless WebSocket drivers (`SignalingService.ts`), allowing fast UI iterations without breaking the secure tunnel logic.
