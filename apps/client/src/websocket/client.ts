import { MessageType, ProtocolMessage } from '@figma-clone/shared';
type MessageHandler = (message: ProtocolMessage) => void;
export class RealtimeClient {
  private socket: WebSocket | null = null;
  private url: string;
  private handlers: Set<MessageHandler> = new Set();
  private pingInterval: number | null = null;
  public isConnected: boolean = false;
  constructor(url: string) {
    this.url = url;
  }
  public connect(): void {
    if (this.socket) return;
    this.socket = new WebSocket(this.url);
    this.socket.onopen = () => {
      console.log('[WebSocket Client] Connected to server');
      this.isConnected = true;
      this.startHeartbeat();
    };
    this.socket.onmessage = (event) => {
      try {
        const message: ProtocolMessage = JSON.parse(event.data);
        this.notify(message);
      } catch (err) {
        console.error('[WebSocket Client] Error parsing incoming message', err);
      }
    };
    this.socket.onclose = () => {
      console.log('[WebSocket Client] Disconnected from server');
      this.isConnected = false;
      this.stopHeartbeat();
      this.socket = null;
      setTimeout(() => this.connect(), 3000);
    };
    this.socket.onerror = (err) => {
      console.error('[WebSocket Client] Socket error:', err);
    };
  }
  public send(message: ProtocolMessage): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }
  public subscribe(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }
  private notify(message: ProtocolMessage): void {
    this.handlers.forEach((h) => h(message));
  }
  private startHeartbeat(): void {
    this.pingInterval = setInterval(() => {
      this.send({
        type: MessageType.PING,
        timestamp: Date.now(),
      });
    }, 15000) as unknown as number;
  }
  private stopHeartbeat(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}
