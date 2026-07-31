import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { MessageType, ProtocolMessage } from '@figma-clone/shared';
import { db } from './database.js';
interface ClientConnection {
  ws: WebSocket;
  userId: string;
  roomId: string;
  isAlive: boolean;
}
export class RealtimeServer {
  private wss: WebSocketServer;
  private clients: Map<string, ClientConnection> = new Map();
  constructor(server: HttpServer) {
    this.wss = new WebSocketServer({ server });
    this.init();
  }
  private init(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      const userId = `user_${Math.random().toString(36).substring(2, 9)}`;
      const roomId = 'default-room'; 
      const conn: ClientConnection = {
        ws,
        userId,
        roomId,
        isAlive: true,
      };
      this.clients.set(userId, conn);
      console.log(`[WebSocket] Client connected: ${userId}`);
      const initMessage: ProtocolMessage = {
        type: MessageType.INIT_SESSION,
        timestamp: Date.now(),
        payload: {
          userId,
          roomId,
          users: Array.from(this.clients.values()).map(c => ({
            userId: c.userId,
            name: `User ${c.userId.slice(-4)}`,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
          })),
        },
      };
      ws.send(JSON.stringify(initMessage));
      ws.on('message', async (data: string) => {
        try {
          const message: ProtocolMessage = JSON.parse(data.toString());
          await this.handleMessage(conn, message);
        } catch (err) {
          console.error('[WebSocket] Failed to parse message', err);
        }
      });
      ws.on('pong', () => {
        conn.isAlive = true;
      });
      ws.on('close', () => {
        console.log(`[WebSocket] Client disconnected: ${userId}`);
        this.clients.delete(userId);
      });
    });
    setInterval(() => {
      this.wss.clients.forEach((ws: WebSocket) => {
        const conn = Array.from(this.clients.values()).find(c => c.ws === ws);
        if (conn) {
          if (!conn.isAlive) return ws.terminate();
          conn.isAlive = false;
          ws.ping();
        }
      });
    }, 30000);
  }
  private async handleMessage(client: ClientConnection, message: ProtocolMessage): Promise<void> {
    switch (message.type) {
      case MessageType.PING:
        client.ws.send(
          JSON.stringify({
            type: MessageType.PONG,
            timestamp: Date.now(),
          })
        );
        break;
      case MessageType.CURSOR_MOVE:
        this.broadcast(client.userId, message);
        break;
      case MessageType.DOCUMENT_UPDATE:
        this.broadcast(client.userId, message);
        break;
      default:
        console.log(`[WebSocket] Received message: ${message.type}`);
    }
  }
  private broadcast(senderId: string, message: ProtocolMessage): void {
    const payload = JSON.stringify({ ...message, senderId });
    for (const [id, client] of this.clients.entries()) {
      if (id !== senderId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(payload);
      }
    }
  }
}
