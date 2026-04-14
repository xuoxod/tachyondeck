import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity, BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Terminal } from './src/components/Terminal';
import { useTachyon } from './src/hooks/useTachyon';

const TACHYONFLUX_WS_URL = 'https://rmediatech.com/api/signal/tachyon'; // Connect to the global signaling backbone

export default function App() {
  const {
    output,
    isConnected,
    sendCommand,
    connect,
    disconnect
  } = useTachyon({ url: TACHYONFLUX_WS_URL });

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const handleExit = useCallback(() => {
    disconnect();
    setTimeout(() => {
      BackHandler.exitApp();
    }, 150);
  }, [disconnect]);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>tachyondeck</Text>
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, isConnected ? styles.connected : styles.disconnected]}>
              {isConnected ? 'ONLINE' : 'OFFLINE'}
            </Text>
            {!isConnected && <ActivityIndicator size="small" color="#ff4444" style={styles.loader} />}
            <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
              <Text style={styles.exitButtonText}>EXIT</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Terminal
          output={output}
          onCommandSubmit={sendCommand}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingTop: 50, // Safe area substitute
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1e1e1e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#00ffcc',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  connected: {
    color: '#00ff00',
  },
  disconnected: {
    color: '#ff4444',
  },
  loader: {
    marginLeft: 8,
  },
  exitButton: {
    marginLeft: 15,
    backgroundColor: '#2a2a2a',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#444',
  },
  exitButtonText: {
    color: '#ff4444',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
