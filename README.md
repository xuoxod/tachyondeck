# 🌌 tachyondeck

## The React Native / Expo Mobile Client for Tachyonflux

*A performant, cross-platform terminal interface bridging WebRTC endpoints securely to your mobile device.*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)](#)
[![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)](#)

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
