# 📡 `src/services` | WebRTC & Network Drivers

Welcome to the `services` module. This directory encapsulates the heavy-lifting logic: WebRTC peering, ICE negotiation, WebSocket connections with TURN servers, and any telemetry fetching outside the React Lifecycle.

## 🏛️ Philosophy

1. **State-Agnostic Drivers:** Nothing in `/services/` should ever use React Hooks (`useState`, `useEffect`). These are pure TypeScript classes or standard ESM modules. They export EventEmitters or Promisified results.
2. **Defensive Programming:** Sockets die randomly; firewalls drop DataChannels mid-transfer. Your code *anticipates failure* via exponential backoffs, pre-queueing messages, and catching thrown `JSON.parse` mismatches without bubbling an app crash (`try/catch/warn`).
3. **P2P Authority:** Security is governed here. Cryptographic signatures or JSON parsing routines exist here to protect the UI layers.

---

### 📖 Available Services

#### `SignalingService.ts`

The cornerstone routing class negotiating initial handshakes between our mobile PWA and the deployed Go Edge Nodes.

**Architecture Specs:**

- Automatically queues `.sendMessage()` arrays when the socket state is `CONNECTING`.
- Fires internal exponential reconnection polling if disconnected organically.
- Safely swallows malformed JSON messages from bad actors rather than crashing the React thread.

**Standalone Initialization Usage:**

```typescript
import { SignalingService } from './SignalingService';

const tachyonSignal = new SignalingService('wss://our-go-backend.com/ws');

tachyonSignal.on('connectionStateChange', (status) => {
  if (status === 'connected') {
    // Authenticate the session
    tachyonSignal.sendMessage({ type: 'auth_payload', data: 'xx-token' });
  }
});

tachyonSignal.on('message', (msg) => {
  console.log('Incoming Raw Data:', msg);
});

// Kick off the lifecycle
tachyonSignal.connect();
```
