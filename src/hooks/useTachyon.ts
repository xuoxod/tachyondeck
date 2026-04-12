import { useState, useEffect, useCallback, useRef } from 'react';
import { SignalingService } from '../services/SignalingService';

interface UseTachyonProps {
  url: string;
}

interface UseTachyonResult {
  output: string[];
  isConnected: boolean;
  sendCommand: (command: string) => void;
  connect: () => void;
  disconnect: () => void;
}

export const useTachyon = ({ url }: UseTachyonProps): UseTachyonResult => {
  const [output, setOutput] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const signalingServiceRef = useRef<SignalingService | null>(null);

  useEffect(() => {
    signalingServiceRef.current = new SignalingService(url);

    const connectionHandler = (state: string) => {
      setIsConnected(state === 'connected');
    };

    const messageHandler = (msg: any) => {
      if (msg.type === 'terminal_output' && msg.data) {
        setOutput((prev) => [...prev, msg.data]);
      } else if (msg.type === 'system_message' && msg.data) {
        setOutput((prev) => [...prev, `[SYSTEM]: ${msg.data}`]);
      }
    };

    signalingServiceRef.current.on('connectionStateChange', connectionHandler);
    signalingServiceRef.current.on('message', messageHandler);

    return () => {
      if (signalingServiceRef.current) {
        signalingServiceRef.current.off('connectionStateChange', connectionHandler);
        signalingServiceRef.current.off('message', messageHandler);
        signalingServiceRef.current.disconnect();
      }
    };
  }, [url]);

  const sendCommand = useCallback((command: string) => {
    if (command.trim() === '') return;
    
    // Optimistic UI update
    setOutput((prev) => [...prev, `> ${command}`]);
    
    if (signalingServiceRef.current) {
      signalingServiceRef.current.sendMessage({
        type: 'terminal_input',
        data: command
      });
    }
  }, []);

  const connect = useCallback(() => {
    if (signalingServiceRef.current) {
      signalingServiceRef.current.connect();
    }
  }, []);

  const disconnect = useCallback(() => {
    if (signalingServiceRef.current) {
      signalingServiceRef.current.disconnect();
    }
  }, []);

  return {
    output,
    isConnected,
    sendCommand,
    connect,
    disconnect
  };
};
