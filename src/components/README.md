# 🧩 `src/components` | Core UI Library

Welcome to the `components` directory. This module houses the "dumb" or strictly-presentational React Native constructs.

### 🏛️ Philosophy

1. **Strictly UI:** Components here should rarely, if ever, manage their own backend state or service injections. They take `props`, render beautifully, and emit events (`onChange`, `onSubmit`).
2. **Highly Performant:** We emphasize things like React Native's `FlatList`, manual `memo` wraps, and prop-pruning because this app must render dense datasets seamlessly.
3. **100% Tested:** Every component requires an adjacent `.test.tsx` file asserting layout states via testing-library and Jest before merging.

### 📖 Available Components

#### `<Terminal />`

A virtualization-backed, bash-style component that safely renders massive arrays of strings without causing Out-of-Memory (OOM) leaks.

**Usage:**

```tsx
import { Terminal } from './Terminal';

export function ExampleView() {
  const [logs] = useState(['Booting node...', 'Connect P2P', 'Connected.']);

  return (
    <Terminal 
      output={logs} 
      onCommandSubmit={(cmd) => console.log('User typed:', cmd)} 
    />
  );
}
```
