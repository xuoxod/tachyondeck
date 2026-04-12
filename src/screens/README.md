# 📱 `src/screens` | Application Layouts

Welcome to the `screens` directory. These are top-level views composed of multiple `components` tied explicitly into data `hooks`. 

### 🏛️ Philosophy
1. **Container / Presentational:** A `screen` acts as a 'smart' container to route navigation parameters, inject authentication, and render high-level user flows like `LoginScreen` or `DashboardScreen`.
2. **Minimal UI Syntax:** You shouldn't see raw structural styles like `{ margin: 10, padding: 5, fontSize: 16 }` spread everywhere here. You should see `<PageWrapper><Terminal output={...} /></PageWrapper>`.
3. **Expo Router Compatible:** These root modules export `default` bindings compatible with the underlying navigator.

*No Screens have formally been implemented yet outside the main `App.tsx` testbed. But you'll construct them here when routing begins!*
