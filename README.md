# 🌌 tachyondeck

## The React Native / Expo Mobile Client for Tachyonflux

*A performant, cross-platform terminal interface bridging WebRTC endpoints securely to your mobile device.*

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)

---

## 📖 Overview

**tachyondeck** is the mobile-exclusive counterpart to the [tachyonflux](https://github.com/emhcet/tachyonflux) edge node. Built rigorously with Test-Driven Development (TDD) and strict Separation of Concerns (SoC), it provides a near-native `Bash`-like terminal experience on iOS and Android devices without sacrificing performance—even when rendering thousands of lines of real-time server output.

By connecting directly to the `tachyonflux` WebRTC node, `tachyondeck` bypasses traditional firewalls and restrictive NATs, allowing administrators to manage distributed nodes effortlessly from their pocket.

---

## ⚡ Features

- **🚀 Highly Performant Terminal UI:** Leverages React Native's `FlatList` virtualization to handle massive, lightning-fast JSON log streams without Out-Of-Memory (OOM) crashes.
- **🔒 WebRTC Signaling & NAT Traversal:** Connects straight to the edge-nodes via exponential backoff WebSockets and pure DataChannels.
- **🏗️ TDD-First Architecture:** Hardened with exhaustive edge-case test suites (rendering behavior, dropped sockets, malformed JSON).
- **📱 True Cross-Platform:** Write once in TypeScript, compile flawlessly to iOS, Android, and Web PWA via Expo.

---

## 🛠️ Usage Example

Integrating the `tachyondeck` core services into an application is done cleanly via the `useTachyon` custom hook.

### 1. Establish the Connection

```typescript
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Terminal } from './src/components/Terminal';
import { useTachyon } from './src/hooks/useTachyon';

const TACHYONFLUX_WS = 'ws://192.168.1.100:8080/terminal';

export default function App() {
  const { output, isConnected, sendCommand, connect, disconnect } = useTachyon({ url: TACHYONFLUX_WS });

  useEffect(() => {
    connect(); // Initialize sequence under-the-hood
    return () => disconnect();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <Text style={{ color: isConnected ? '#0f0' : '#f00', padding: 20 }}>
        [STATUS]: {isConnected ? 'ONLINE' : 'OFFLINE'}
      </Text>
      
      {/* Feed the high-performance UI Component */}
      <Terminal output={output} onCommandSubmit={sendCommand} />
    </View>
  );
}
```

### 2. Under the Hood (SignalingService)

Want to interface with the raw WebRTC transport instead of the UI hooks? Use the class directly:

```typescript
import { SignalingService } from './src/services/SignalingService';

const signaling = new SignalingService('wss://turn.rmediatech.com/secure');

signaling.on('connectionStateChange', (state) => {
  console.log('Tachyon flux socket is now:', state);
});

signaling.on('message', (msg) => {
  if (msg.type === 'system_message') {
    console.log('[SYSTEM]:', msg.data);
  }
});

signaling.connect();
signaling.sendMessage({ type: 'terminal_input', data: 'ls -la /var/log' });
```

---

## 🏃 Quickstart

Ensure you have Node.js 18+ and `npm` installed. We recommend installing the Expo Go app on your physical device for immediate testing.

```bash
# 1. Clone & Enter Directory
cd tachyondeck

# 2. Install Dependencies
npm install --legacy-peer-deps

# 3. Run the TDD Suite (Ensure green state)
npm test

# 4. Launch the Expo bundler
npx expo start
```

*Note: Scan the generated QR code using your physical device's camera (iOS) or Expo Go app (Android) to load the UI.*

---

## 📂 Architecture & SoC

```text
📦 tachyondeck
├── 📁 assets/              # Static images, fonts, splash screens
├── 📁 docs/                # Deep-dive architectural documentation
├── 📁 src/
│   ├── 📁 components/      # Pure, dumb UI elements (Terminal.tsx + Terminal.test.tsx)
│   ├── 📁 hooks/           # Intermediary logic layers connecting services to components (useTachyon)
│   ├── 📁 screens/         # High-level layouts grouping multiple components
│   └── 📁 services/        # Headless DataChannel/WebSocket drivers (SignalingService.ts)
├── 📄 App.tsx              # Expo application root
└── 📄 jest.config.js       # Strict Node-mock layout for React Native headless TDD
```

## 🤝 Rules of Engagement

- **No naked merges:** `npm test` requires 100% green coverage against structural crashes and edge-cases before committing.
- **Lower case only:** This repository and all references are exclusively normalized to `tachyondeck`.

## Real-World Scenarios & Setup Guides

The true power of the `tachyonflux`/`tachyondeck` ecosystem lies in its ability to securely bridge your mobile device to private networks without port forwarding, VPNs, or exposing public interfaces. 

### Scenario 1: The Remote Webcam / Local Network Bridge (Zero-Trust Edge)
**The Problem:** You have standard IP network cameras (or IoT devices) on your home Wi-Fi. You want to view their feeds or administrative consoles from your phone while traveling, but you refuse to open ports on your home router or expose the cameras to the public internet.
**The Solution:** 
1. **Setup `tachyonflux`:** Install and run the `tachyonflux` agent on a Raspberry Pi, Mac, or Windows desktop that is connected to the same home LAN as your webcams.
2. **Setup `tachyondeck`:** Open the `tachyondeck` mobile app on your phone and authenticate.
3. **The Workflow:** 
    * `tachyonflux` establishes a secure outbound signaling connection to the `rmediatech` signaling server.
    * When you open `tachyondeck`, it signals the `flux` node and establishes an end-to-end encrypted WebRTC DataChannel directly to your home machine.
    * From the mobile app, you send a proxied HTTP GET request to the camera's local IP (e.g., `http://192.168.1.50:80`).
    * `tachyonflux` executes the local network request on your behalf and pipes the MJPEG stream or administrative HTML console back through the encrypted DataChannel to your phone screen. Your home network remains completely locked down from the outside.

### Scenario 2: Secure Smart Home / Home Assistant Integration
**The Problem:** You run Home Assistant or local smart home hubs but don't want to expose your internal `8123` port to the web, risking a critical network breach.
**The Solution:**
1. **Setup `tachyonflux`:** Run `tachyonflux` as a background service on the same machine or network hosting Home Assistant.
2. **Setup `tachyondeck`:** Configure custom macro buttons in your `tachyondeck` app interface.
3. **The Workflow:** 
    * Pressing a button on your phone sends a pre-configured JSON payload through the WebRTC tunnel directly to the `flux` node.
    * `tachyonflux` translates this into an internal `POST http://127.0.0.1:8123/api/...` to trigger your smart home automations securely, acting as an internal, authenticated API proxy.

### Scenario 3: Remote Server Script Execution & Jumpbox Management
**The Problem:** You manage a fleet of remote Linux servers (or a cloud VPC) and occasionally need to restart services, check system health, or tail logs while away from your laptop. SSH clients on mobile are notoriously clunky.
**The Solution:**
1. **Setup `tachyonflux`:** Deploy `tachyonflux` inside the VPC alongside your critical infrastructure as a lightweight service.
2. **Setup `tachyondeck`:** Use the mobile UI's terminal execution or custom command features.
3. **The Workflow:** 
    * `tachyonflux` acts as a secure, authenticated, programmatic jumpbox.
    * Using `tachyondeck`, you can execute quick diagnostic commands like `tail -n 50 /var/log/syslog` or `docker restart web_container`. The `flux` node runs the command locally and streams the standard output directly to your phone. It functionally replaces the need to fumble with mobile SSH keys for rapid triage incidents.
