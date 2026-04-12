# 🎣 `src/hooks` | Logic Connectors

This module integrates non-React backend operations from `src/services/` into functional hooks usable directly by `src/components/` and `src/screens/`.

## 🏛️ Philosophy

Hooks must isolate state management (like tracking an array of logs via `useState` and processing message bursts via `useEffect`) away from the UI layers. Services fire raw network events; your hook maps those to actionable UI variables (`output`, `isConnected`).

### 📖 Available Hooks

#### `useTachyon.ts`

The primary hook that spins up a `SignalingService`, attaches its event loops (`connectionStateChange`, `message`), and caches incoming terminal traces into string arrays suitable for a `<Terminal />` `FlatList`.

**Core Return Pattern:**

```tsx
import { useTachyon } from '../hooks/useTachyon';

const App = () => {
    // Completely uncoupled connection lifecycle: 
    // Data stream goes into 'output' — which feeds raw presentation strings directly.
    const { isConnected, output, connect, disconnect, sendCommand } = useTachyon({
         url: "ws://localhost:8080/terminal" 
    });

    return <MyUI outputLogs={output} isReady={isConnected} />
}
```
