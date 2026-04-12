export class SignalingService {
  private url: string;
  private ws: WebSocket | null = null;
  private messageQueue: any[] = [];
  private onStateChangeCb: ((connected: boolean) => void) | null = null;
  private onMessageCb: ((msg: any) => void) | null = null;
  
  private reconnectAttempts = 0;
  private reconnectTimeout: any = null;
  private isIntentionallyClosed = false;

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    this.isIntentionallyClosed = false;
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0; // Reset backoff
      if (this.onStateChangeCb) this.onStateChangeCb(true);
      
      // Flush queued messages
      while (this.messageQueue.length > 0) {
        const msg = this.messageQueue.shift();
        this.ws?.send(JSON.stringify(msg));
      }
    };

    this.ws.onmessage = (event: any) => {
      try {
        const parsed = JSON.parse(event.data);
        if (this.onMessageCb) this.onMessageCb(parsed);
      } catch (err) {
        // Discard malformed JSON gracefully rather than crashing the thread
        console.warn('SignalingService: Dropped malformed msg', err);
      }
    };

    this.ws.onclose = () => {
      this.ws = null;
      if (this.onStateChangeCb) this.onStateChangeCb(false);

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
    if (this.onStateChangeCb) this.onStateChangeCb(false);
  }

  sendMessage(type: string, payload: any) {
    const message = { type, payload };
    
    if (this.ws && this.ws.readyState === 1) { // 1 == OPEN
      this.ws.send(JSON.stringify(message));
    } else if (this.ws && this.ws.readyState === 0) { // 0 == CONNECTING
      this.messageQueue.push(message);
    } else {
      // Socket is closed or closing. Softly drop it.
      console.warn('SignalingService: Msg dropped, socket closed.');
    }
  }

  onMessage(callback: (msg: any) => void) {
    this.onMessageCb = callback;
  }

  onConnectionStateChange(callback: (connected: boolean) => void) {
    this.onStateChangeCb = callback;
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
