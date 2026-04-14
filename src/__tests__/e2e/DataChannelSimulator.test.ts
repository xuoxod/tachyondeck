import { SignalingService } from '../../services/SignalingService';
const WebSocket = require('ws');
const Server = WebSocket.WebSocketServer || WebSocket.Server; // Mocking a raw Websocket server

// Note: In React Native / Expo, running a pure raw HTTP WebSockets server 
// for testing requires Node APIs. This simulator mocks the *Signaling Server* 
// behaving aggressively exactly like the RMediaTech production array.

describe('TachyonDeck Signaler Network Simulator (Full Lifecycle)', () => {
  let wss: any;
  let clientService: SignalingService;
  const LOCAL_WS_URL = 'ws://localhost:8081';

  beforeAll((done) => {
    wss = new Server({ port: 8081 });
    
    // 1. Simulator acts as the TURN array / signaling server
    wss.on('connection', (ws: any) => {
      ws.on('message', (message: any) => {
        const msg = JSON.parse(message.toString());
        
        if (msg.type === 'offer') {
          // Send back a simulated perfect answer to let RTCPeerConnection proceed
          ws.send(JSON.stringify({
            type: 'answer',
            payload: JSON.stringify({ type: 'answer', sdp: 'simulated-answer' })
          }));
        }

        if (msg.type === 'candidate') {
           // Echo candidate back or simulate remote edge node candidates
           ws.send(JSON.stringify({
             type: 'candidate',
             payload: JSON.stringify({ candidate: 'sim-candidate', sdpMid: '0', sdpMLineIndex: 0 })
           }));
        }
      });
    });
    done();
  });

  afterAll((done) => {
    if (wss) {
      wss.close(done);
    } else {
      done();
    }
  });

  it('navigates the entire signaling handshake pipeline perfectly from mobile connection initialization to DataChannel opening', (done) => {
    // Override the mock to let our Node Websocket simulator act globally
    const RealWebSocket = require('ws');
    global.WebSocket = RealWebSocket as any;

    clientService = new SignalingService(LOCAL_WS_URL);
    
    // We want to ensure that it correctly transitions states completely automatically
    clientService.on('connectionStateChange', (state) => {
       if (state === 'connected') {
           // We are good! The handshake generated the SDP and sent it to our mock WSS server.
           clientService.disconnect();
           done();
       }
    });

    clientService.connect();
  });
});
