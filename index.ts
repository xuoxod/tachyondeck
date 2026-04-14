import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in a custom dev client or in a native production build,
// the environment is set up appropriately
registerRootComponent(App);
