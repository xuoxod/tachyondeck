export class SignalingService {
  private url: string;
  public ws: WebSocket | null = null;
  private messageQueue: any[] = [];
  private listeners: Record<string, ((data: any) => void)[]> = {};
  
  private reconnectAttempts = 0;
  private reconnectTimeout: any = null;
  private isIntentionallyClosed = false;
  private state: string = 'disconnected';

  constructor(url: string) {
    this.url = url;
  }

  public on(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  public off(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  private setState(newState: string) {
    this.state = newState;
    this.emit('connectionStateChange', newState);
  }

  connect() {
    this.isIntentionallyClosed = false;
    this.setState('connecting');
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0; // Reset backoff
      this.setState('connected');
      
      // Flush queued messages
      while (this.messageQueue.length > 0) {
        const msg = this.messageQueue.shift();
        this.ws?.send(JSON.stringify(msg));
      }
    };

    this.ws.onmessage = (event: any) => {
      try {
        const parsed = JSON.parse(event.data);
        this.emit('message', parsed);
      } catch (err) {
        // Discard malformed JSON gracefully rather than crashing the thread
        console.warn('SignalingService: Dropped malformed msg', err);
      }
    };

    this.ws.onclose = () => {
      this.ws = null;
      this.setState('disconnected');

      if (!this.isIntentionallyClosed) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.warn('SignalingService: WS Error', error);
      // Error will often precede a close event, cleanup/reconnect happens in onclose
    };
  }

  disconnect() {
    this.isIntentionallyClosed = true;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setState('disconnected');
  }

  sendMessage(payload: any) {
    if (this.ws && this.ws.readyState === 1) { // 1 == OPEN
      this.ws.send(JSON.stringify(payload));
    } else if (this.ws && this.ws.readyState === 0) { // 0 == CONNECTING
      this.messageQueue.push(payload);
    } else {
      // Socket is closed or closing. Softly drop it.
      console.warn('SignalingService: Msg dropped, socket closed.');
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;

    // Exponential Backoff algorithm (Maxes out to prevent unbounded delays)
    // Retry formula: 2^attempts * 1000ms. (1s, 2s, 4s, 8s, 16s... max 30s)
    const delay = Math.min(Math.pow(2, this.reconnectAttempts) * 1000, 30000);
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, delay);
  }
}
