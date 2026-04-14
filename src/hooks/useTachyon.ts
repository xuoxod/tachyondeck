import { useState, useEffect, useCallback, useRef } from 'react';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';
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

const rtcConfig = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

export const useTachyon = ({ url }: UseTachyonProps): UseTachyonResult => {
  const [output, setOutput] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const signalingServiceRef = useRef<SignalingService | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<any | null>(null); // RTCDataChannel
  const candidateQueueRef = useRef<RTCIceCandidate[]>([]);

  const connect = useCallback(() => {
    if (signalingServiceRef.current) {
      signalingServiceRef.current.disconnect();
    }

    // Clear candidate queue on connect
    candidateQueueRef.current = [];

    setOutput(prev => [...prev, `[SYSTEM]: Connecting to signaling...`]);

    const sig = new SignalingService(url);
    signalingServiceRef.current = sig;

    const pc = new RTCPeerConnection(rtcConfig);
    pcRef.current = pc;

    sig.on('connectionStateChange', async (state: string) => {
      if (state === 'connected') {
        setOutput(prev => [...prev, `[SYSTEM]: Signal connected! Handshaking...`]);

        try {
          const offer = await pc.createOffer({});
          const offerPayload = offer.toJSON ? offer.toJSON() : offer;

          // React Native setState is asynchronous.
          // Wait for the local description to be set BEFORE sending the offer
          // so ICE candidates serialize properly.
          await pc.setLocalDescription(offer);

          sig.sendMessage({
            type: 'offer',
            data: offerPayload
          });
        } catch (e) {
          console.error("Offer error", e);
        }
      }
    });

    sig.on('message', async (msg: any) => {
      try {
        if (msg.type === 'answer') {
          if (pc.signalingState !== 'have-local-offer') {
            console.log('Skipping answer, signalingState is already:', pc.signalingState);
            return;
          }
          // Try to decode strings, fallback to raw object if it's already an object
          const answer = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
          await pc.setRemoteDescription(new RTCSessionDescription(answer));

          // Process queued candidates now that remote description is set
          while (candidateQueueRef.current.length > 0) {
            const candidate = candidateQueueRef.current.shift();
            if (candidate) {
              await pc.addIceCandidate(candidate);
            }
          }
        } else if (msg.type === 'candidate') {
          const candidateData = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
          const candidate = new RTCIceCandidate(candidateData);

          // Ensure we have a remoteDescription before adding candidates, otherwise queue them
          if (!pc.remoteDescription) {
            console.log('Queueing candidate, remote description not set yet.');
            candidateQueueRef.current.push(candidate);
            return;
          }

          await pc.addIceCandidate(candidate);
        }
      } catch (err) {
        console.warn('Failed to process webRTC signal', err);
      }
    });

    pc.addEventListener('icecandidate', (event: any) => {
      if (event.candidate) {
        const candPayload = event.candidate.toJSON ? event.candidate.toJSON() : event.candidate;
        sig.sendMessage({
          type: 'candidate',
          data: candPayload
        });
      }
    });

    // Create the DataChannel our Go sandbox expects
    const dc = pc.createDataChannel('sandbox-rpc');
    dcRef.current = dc;

    dc.addEventListener('open', () => {
      setIsConnected(true);
      setOutput(prev => [...prev, `[SYSTEM]: WebRTC P2P DataChannel OPEN!`]);
    });

    dc.addEventListener('close', () => {
      setIsConnected(false);
      setOutput(prev => [...prev, `[SYSTEM]: WebRTC DataChannel Closed`]);
    });

    dc.addEventListener('message', (e: any) => {
      if (typeof e.data === 'string') {
        try {
          const res = JSON.parse(e.data);

          if (res.success) {
            setOutput(prev => [...prev, res.data]);
          } else {
            setOutput(prev => [...prev, `[ERROR]: ${res.error}\n${res.data || ''}`]);
          }
        } catch (err) {
          // If the message is not JSON, string it out raw
          setOutput(prev => [...prev, e.data]);
        }
      }
    });

    sig.connect();
  }, [url]);

  const disconnect = useCallback(() => {
    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (signalingServiceRef.current) {
      signalingServiceRef.current.disconnect();
      signalingServiceRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const sendCommand = useCallback((command: string) => {
    if (command.trim() === '') return;

    setOutput((prev) => [...prev, `> ${command}`]);

    if (dcRef.current && isConnected) {
      // Split command into base and args string
      const parts = command.trim().split(' ');
      const cmd = parts[0];
      const argsStr = parts.slice(1).join(' ');

      const req = {
        action: 'pty_exec',
        auth_token: 'default_secure_token_change_me',
        params: {
          cmd: cmd,
          args: argsStr
        }
      };

      dcRef.current.send(JSON.stringify(req));
    } else {
      setOutput((prev) => [...prev, `[SYSTEM]: Cannot send command, DataChannel not open.`]);
    }
  }, [isConnected]);

  return {
    output,
    isConnected,
    sendCommand,
    connect,
    disconnect
  };
};
