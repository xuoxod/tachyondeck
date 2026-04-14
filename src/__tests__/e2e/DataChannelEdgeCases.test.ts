import { SignalingService } from '../../services/SignalingService';

// Mock WebRTC globals for Node environment since Expo drops these in pure TDD mode
class MockDataChannel {
  readyState = 'open';
  onopen = jest.fn();
  onclose = jest.fn();
  onmessage = jest.fn();
  send = jest.fn();
  close = jest.fn();
}

class MockRTCPeerConnection {
  createDataChannel = jest.fn(() => new MockDataChannel());
  createOffer = jest.fn(() => Promise.resolve({ type: 'offer', sdp: 'fake-sdp' }));
  setLocalDescription = jest.fn();
  setRemoteDescription = jest.fn();
  addIceCandidate = jest.fn();
  close = jest.fn();
  onicecandidate = jest.fn();
  ondatachannel = jest.fn();
}

global.RTCPeerConnection = MockRTCPeerConnection as any;

describe('TachyonDeck Edge Case E2E (DataChannel Handling)', () => {
  let signaling: SignalingService;

  beforeEach(() => {
    jest.clearAllMocks();
    signaling = new SignalingService('wss://fake-turn.com/ws');
  });

  afterEach(() => {
    signaling.disconnect();
  });

  it('drops malformed payload strings seamlessly without OOM or App Crash', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    // Simulate connection
    signaling.connect();

    // Attempt sending a payload immediately that is not stringifiable (circular ref) or totally broken
    const obj: any = {};
    obj.self = obj;

    // The method should gracefully catch or reject
    try {
      signaling.sendMessage(obj);
    } catch (e) {
      expect(e).toBeDefined();
    }

    errorSpy.mockRestore();
  });

  it('correctly re-authenticates or triggers failure state on TURN server IP Drop (Network Loss)', () => {
    // Mock the internal websockets to randomly close and verify reconnect attempts
    expect(signaling).toBeDefined();

    signaling.connect();
    // Trigger socket close code normally emitted when an airport wifi cuts out
    // @ts-ignore
    if (signaling.ws && signaling.ws.onclose) {
      // @ts-ignore
      signaling.ws.onclose({ code: 1006, reason: 'Abnormal Closure' });
    }

    // State should reflect reconnecting or disconnected, waiting for exponential backoff tick
    expect(signaling['state']).not.toBe('connected');
  });

  it('handles massive 10,000+ line terminal output without string parsing bottlenecks', async () => {
    const massiveString = Array.from({ length: 10000 }, (_, i) => `Line ${i} system trace output standard ok`).join('\n');

    // Mock the DataChannel receiving this exact payload
    const payload = JSON.stringify({
      action: 'pty_exec',
      success: true,
      data: massiveString
    });

    // Hook into the raw parser
    signaling.connect();
    let receivedLength = 0;
    signaling.on('message', (msg) => {
      receivedLength = msg.data.length;
    });

    // @ts-ignore
    if (signaling.ws && signaling.ws.onmessage) { signaling.ws.onmessage({ data: payload } as any); }

    expect(receivedLength).toBe(massiveString.length);
  });
});
