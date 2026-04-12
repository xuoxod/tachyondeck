import React, { useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Terminal } from './src/components/Terminal';
import { useTachyon } from './src/hooks/useTachyon';

const TACHYONFLUX_WS_URL = 'ws://192.168.1.100:8080/terminal'; // Replace with a local IP in real app

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TachyonDeck</Text>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, isConnected ? styles.connected : styles.disconnected]}>
            {isConnected ? 'ONLINE' : 'OFFLINE'}
          </Text>
          {!isConnected && <ActivityIndicator size="small" color="#ff4444" style={styles.loader} />}
        </View>
      </View>
      <Terminal 
        output={output} 
        onCommandSubmit={sendCommand} 
      />
    </View>
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
});
