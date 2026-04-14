import { SignalingService } from './SignalingService';

// Mock WebSockets for our Node/Jest environment
class MockWebSocket {
  url: string;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onclose: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  readyState: number = 0; // CONNECTING
  
  close = jest.fn();
  send = jest.fn();

  constructor(url: string) {
    this.url = url;
    // Keep track of the instances for testing
    (global as any).latestWebSocket = this;
  }
}

(global as any).WebSocket = MockWebSocket as any;

describe('SignalingService', () => {
  let service: SignalingService;
  const testUrl = 'wss://turn.rmediatech.com/ws';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (global as any).latestWebSocket = null;
  });

  afterEach(() => {
    if (service) {
      service.disconnect();
    }
  });

  it('should connect to the specified WebSocket URL', () => {
    service = new SignalingService(testUrl);
    service.connect();

    const ws = (global as any).latestWebSocket;
    expect(ws).toBeDefined();
    expect(ws.url).toBe(testUrl);
  });

  it('should emit connection state changes', () => {
    service = new SignalingService(testUrl);
    const mockStateChange = jest.fn();
    service.on('connectionStateChange', mockStateChange);
    
    service.connect();
    const ws = (global as any).latestWebSocket;
    
    // Simulate connection open
    ws.readyState = 1; // OPEN
    ws.onopen!();
    
    expect(mockStateChange).toHaveBeenCalledWith('connected');

    // Simulate connection close
    ws.onclose!({});
    expect(mockStateChange).toHaveBeenCalledWith('disconnected');
  });

  it('should successfully send JSON formatted messages when connected', () => {
    service = new SignalingService(testUrl);
    service.connect();
    
    const ws = (global as any).latestWebSocket;
    ws.readyState = 1; // OPEN
    ws.onopen!();

    service.sendMessage({ type: 'sdp_offer', payload: { sdp: 'fake-sdp-data' } });
    
    expect(ws.send).toHaveBeenCalledWith(JSON.stringify({
      type: 'sdp_offer',
      payload: { sdp: 'fake-sdp-data' }
    }));
  });

  it('should queue messages if sent before the connection is open, then flush them', () => {
    service = new SignalingService(testUrl);
    service.connect();
    
    const ws = (global as any).latestWebSocket;
    
    // Sent while readyState = 0 (CONNECTING)
    service.sendMessage({ type: 'ice_candidate', payload: { candidate: 'fake-candidate' } });
    expect(ws.send).not.toHaveBeenCalled();

    // Trigger open
    ws.readyState = 1;
    ws.onopen!();

    // Should automatically flush the queue
    expect(ws.send).toHaveBeenCalledTimes(1);
    expect(ws.send).toHaveBeenCalledWith(JSON.stringify({
      type: 'ice_candidate',
      payload: { candidate: 'fake-candidate' }
    }));
  });

  it('should drop messages or handle gracefully if sent after disconnection without crashing', () => {
    service = new SignalingService(testUrl);
    service.connect();
    
    const ws = (global as any).latestWebSocket;
    ws.readyState = 3; // CLOSED
    
    // Attempt sending
    expect(() => {
      service.sendMessage({ type: 'ping', payload: {} });
    }).not.toThrow();
  });

  it('should successfully parse incoming valid JSON messages and emit them', () => {
    service = new SignalingService(testUrl);
    service.connect();

    const mockMessageHandler = jest.fn();
    service.on('message', mockMessageHandler);

    const ws = (global as any).latestWebSocket;
    ws.readyState = 1;

    // Simulate incoming message
    ws.onmessage!({ data: JSON.stringify({ type: 'sdp_answer', payload: { sdp: 'answer-data' } }) });

    expect(mockMessageHandler).toHaveBeenCalledWith({
      type: 'sdp_answer',
      payload: { sdp: 'answer-data' }
    });
  });

  it('should handle malformed JSON messages gracefully without crashing the app', () => {
    service = new SignalingService(testUrl);
    service.connect();

    const mockMessageHandler = jest.fn();
    service.on('message', mockMessageHandler);

    const ws = (global as any).latestWebSocket;
    
    // Simulating garbage data from a rogue peer or network glitch
    expect(() => {
      ws.onmessage!({ data: '{{{ NOT VALID JSON :::' });
    }).not.toThrow();

    expect(mockMessageHandler).not.toHaveBeenCalled();
  });

  it('should automatically attempt reconnection with exponential backoff on unexpected drops', () => {
    service = new SignalingService(testUrl);
    service.connect();
    
    const firstWs = (global as any).latestWebSocket;
    firstWs.onclose!({}); // Simulate an unexpected drop

    // First retry should happen after 1000ms
    jest.advanceTimersByTime(1000);
    const secondWs = (global as any).latestWebSocket;
    expect(secondWs).not.toBe(firstWs); // A new WebSocket instance was created
    
    // Simulate drop again
    secondWs.onclose!({});
    
    // Second retry should happen after 2000ms (Exponential backoff)
    jest.advanceTimersByTime(1000);
    expect((global as any).latestWebSocket).toBe(secondWs); // Not yet created

    jest.advanceTimersByTime(1000); // Cross the 2000ms threshold
    const thirdWs = (global as any).latestWebSocket;
    expect(thirdWs).not.toBe(secondWs); // Third instance created
  });

  it('should NOT attempt reconnection if disconnect() is called intentionally', () => {
    service = new SignalingService(testUrl);
    service.connect();
    
    service.disconnect(); // Intentional closure
    const ws = (global as any).latestWebSocket;
    ws.onclose!({}); // Simulate the actual close event firing
    
    jest.advanceTimersByTime(10000); // Advance time well past backoff
    
    expect(ws.close).toHaveBeenCalledTimes(1);
    expect((global as any).latestWebSocket).toBe(ws); // No new instance was created
  });
});
