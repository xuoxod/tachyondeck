# 📚 `docs/` | The Deep Dive Repository

Welcome to the `tachyondeck` documentation root. As the system scales its native mobile capacities, these markdown documents serve to bridge the gap between "what the code does" and "why we architected it this way".

## 🚧 The Core Design Mandates

### 1. `useTachyon` - **The Separation Hook**

A fundamental premise in `tachyondeck` is that our UI components (`<Terminal />`, `<NavBar />`) have **zero knowledge** of our WebSockets, PeerConnections, and `signaling`. They are rigorously decoupled. We bridge these worlds exclusively via `useTachyon` or custom container-level Controllers (`screens`).

Whenever you are adding new state derived from a Go server component (say, a new `/api/admin` endpoint check), pipe the raw JSON payloads through a separate `/services/MyService.ts` and construct a middleman hook in `src/hooks/`. Your React Native component should accept only simple arrays and boolean flags.

### 2. High-Performance Mobile Constraints

We are building a terminal app rendering hundreds, potentially thousands of rows per minute as `tachyonflux` edge nodes dump telemetry directly into the DataChannel.

**Never Use `<ScrollView>`!** `<ScrollView>` eagerly renders every string child passed into it, crashing a low-end Android device when log traces hit line `1000`. You must utilize React Native strictly with the `<FlatList />` (which prunes hidden DOM elements as they scroll off-screen).

### 3. Graceful Socket Death

WebSockets connected dynamically across LTE/5G drop constantly. Your service logic queues actions locally if the status shifts to `CONNECTING` or `RECONNECTING` rather than crashing the thread with a generic unhandled promise rejection.

## 📖 Upcoming Guides

- `NATIVE_TESTING.md`: Resolving headless Jest mock scopes without throwing Expo Metro registry reference errors.
- `WEBRTC_ICE.md`: Our strategy to punch directly through carrier-grade firewall NATs bypassing the secondary STUN layers.
