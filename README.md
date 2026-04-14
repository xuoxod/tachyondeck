# 🌌 TachyonDeck

## The Command Center for Zero-Trust Infrastructure

*A beautiful, lightning-fast cross-platform interface securely bridging edge nodes to your pocket.*

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

---

## 📖 Overview

**TachyonDeck** is the sleek, universally adaptable counterpart to the headless [TachyonFlux](https://github.com/xuoxod/tachyonflux) edge node.

Instead of dealing with clunky mobile terminal clients or complicated VPN configuration files, TachyonDeck establishes a direct, end-to-end encrypted connection right to your private servers. It provides an elegant, highly responsive management dashboard natively on your phone, tablet, or smart display.

---

## ⚡ Core Features

- **🚀 Highly Performant Interface:** Leverages deeply optimized rendering to handle thousands of lines of rapid terminal logs gracefully, without stuttering.
- **🔒 True NAT Traversal:** Connects straight to your edge nodes without opening router ports via strict, secure data tunneling.
- **📱 Universally Platform-Agnostic:** Code once, run everywhere. Designed to compile flawlessly to iOS, Android, and modern Web browsers.
- **🛠️ Zero-Trust Design:** Operates without exposing your infrastructure IP addresses to the public internet, dramatically reducing your attack surface against automated threats.

---

## 💻 System Requirements

TachyonDeck is built to be tested and deployed quickly across any modern ecosystem.

* **Development Environment:** Requires a standard Node.js environment (v18+) to run the bundler.
* **Mobile Testing:** We highly recommend the free **Expo Go** application (available on iOS and Android app stores) for immediate, over-the-air native device testing.
* **Web Testing:** Any modern browser (such as those running on a standard laptop, Google TV, or smart displays like the Echo Show).

---

## 📚 Usage Scenarios

TachyonDeck is perfect for seamless, multi-screen remote infrastructure management:

* **Scenario A: On-the-Go Phone Access**
  While commuting, open the TachyonDeck app on your smartphone to securely remote into your home office. Instantly check server health, restart failed services, or securely read logs right from the palm of your hand.
* **Scenario B: The Smart Display Dashboard**
  Launch the Web version of TachyonDeck through the built-in browser on an Echo Show or Google TV. Transform a device normally reserved for entertainment into a sleek, real-time monitoring dashboard for your internal network's health.
* **Scenario C: Desktop Operations**
  Run the dashboard simultaneously on a secondary laptop browser, giving yourself a beautifully formatted visual command center without installing heavy, specialized desktop clients.

---

## 🛠️ Step-by-Step Quickstart (Multi-Device Setup)

Want to see the app run on your cell phone, Google TV, and desktop simultaneously? You do **not** need App Store approvals or complex developer accounts! 

*(Make sure your TachyonFlux backend node is running on your network first. See the [TachyonFlux README](https://github.com/xuoxod/tachyonflux) for that quick step).*

**Step 1: Start the UI Bundler (On your Dev Laptop)**
Open a terminal in the `tachyondeck` project directory and start the local environment:
```bash
npm install --legacy-peer-deps
npx expo start
```
*A distinct QR code will immediately appear in your terminal window.*

**Step 2: Connect via Smartphone (iOS or Android)**
1. Download the free **Expo Go** app from your platform's app store.
2. Open Expo Go and tap the "Scan QR Code" option.
3. Point your camera at the terminal on your development laptop. The application will instantly synchronize over your Wi-Fi and resolve natively on your phone screen!

**Step 3: Connect via Smart TV or Smart Display (Web Mode)**
1. In the same terminal where the QR code is displayed, press the **`w`** key on your keyboard. This instructs the bundler to compile a universal Web version of your app.
2. Locate the web URL printed on the screen (usually resembling `http://192.168.1.XX:8081`).
3. Open the built-in browser on your Google TV, secondary laptop, or Echo Show, and type in that exact URL. 

*Presto! You are now securely managing your infrastructure from multiple physical screens at once.*

---

## 🧪 Running the Test Suite

TachyonDeck is built with an unwavering emphasis on Test-Driven Development (TDD). The internal test suite meticulously simulates network lifecycles and edge cases (like malformed data drops) completely headless.

To execute the test suite:
```bash
npm run test
```

---

## 🤝 Open Source Best Practices

- **Strict Validation:** Always run the local test suites to ensure edge-node architectural safety before submitting updates.
- **Clean Architecture:** Interface modules are elegantly uncoupled from the under-the-hood encryption drivers, allowing for continuous UI evolution without risking tunnel stability.
