export class SignalingService {
  private url: string;
  private listeners: Record<string, ((data: any) => void)[]> = {};

  private isIntentionallyClosed = false;
  private state: string = 'disconnected';
  private sessionId: string;
  private seq: number = 0;
  private pollTimeout: any = null;

  // Track message queue for failures, though less critical than WS
  private messageQueue: any[] = [];

  constructor(url: string) {
    this.url = url;
    this.sessionId = `tachyondeck-${Math.random().toString(36).substring(2, 10)}`;
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

  public async connect() {
    this.isIntentionallyClosed = false;
    this.seq = 0;

    try {
      // Fast-forward past historical garbage before asserting 'connected'
      const response = await fetch(this.url);
      if (response.ok) {
        const text = await response.text();
        if (text) {
          const parsed = JSON.parse(text);
          if (parsed.maxSeq) {
            this.seq = parsed.maxSeq;
          }
        }
      }
    } catch (err) {
      console.warn('Initial signaling sync failed', err);
    }

    this.setState('connected');
    this.poll();
  }

  private async poll() {
    if (this.isIntentionallyClosed) return;

    try {
      const response = await fetch(`${this.url}?since=${this.seq}`);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const text = await response.text();
      if (text) {
        const parsed = JSON.parse(text);
        const messages = Array.isArray(parsed) ? parsed : (parsed.messages || []);

        if (Array.isArray(messages)) {
          for (const msg of messages) {
            if (msg.seq > this.seq) {
              this.seq = msg.seq;
            }

            // Ignore own messages
            if (msg.sessionId === this.sessionId) {
              continue;
            }

            // Only push WebRTC types to the React Hook
            if (['offer', 'answer', 'candidate'].includes(msg.type)) {
              // Remap for the React hooks expectations
              const forwardData = {
                type: msg.type,
                data: msg.data
              };
              this.emit('message', forwardData);
            }
          }
        }
      }
    } catch (err) {
      // Quiet fail - backoff briefly
      if (!this.isIntentionallyClosed) {
        this.pollTimeout = setTimeout(() => this.poll(), 2000);
        return;
      }
    }

    if (!this.isIntentionallyClosed) {
      // Loop again (long polling block)
      this.pollTimeout = setTimeout(() => this.poll(), 500);
    }
  }

  public disconnect() {
    this.isIntentionallyClosed = true;
    if (this.pollTimeout) {
      clearTimeout(this.pollTimeout);
      this.pollTimeout = null;
    }
    this.setState('disconnected');
  }

  public async sendMessage(payload: any) {
    if (this.isIntentionallyClosed) {
      this.messageQueue.push(payload);
      return;
    }

    // Structure for rmediatech signaling router
    const rmtMsg = {
      type: payload.type || 'chat',
      sessionId: this.sessionId,
      data: payload.data || payload
    };

    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rmtMsg)
      });

      if (!response.ok) {
        console.warn('SignalingService: Send failed', response.status);
      }
    } catch (err) {
      console.warn('SignalingService: Send exception', err);
    }
  }
}
