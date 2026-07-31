import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import {
  ProtocolMessage,
  MessageType,
  InitSessionMessage,
  UserJoinedMessage,
  UserLeftMessage,
  CursorMoveMessage,
  DocumentUpdateMessage,
  SelectionChangeMessage,
  UserPresence,
  HEARTBEAT_INTERVAL_MS
} from '@figma-clone/shared';
interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
  userId?: string;
  roomId?: string;
}
export class RealtimeServer {
  private wss: WebSocketServer;
  private users: Map<string, UserPresence> = new Map();
  private rooms: Map<string, Set<ExtendedWebSocket>> = new Map();
  private documentState: Map<string, any[]> = new Map();
  constructor(server: HttpServer) {
    this.wss = new WebSocketServer({ server });
    this.setupServer();
    this.setupHeartbeat();
  }
  private setupServer() {
    this.wss.on('connection', (ws: ExtendedWebSocket) => {
      ws.isAlive = true;
      ws.on('pong', () => {
        ws.isAlive = true;
      });
      ws.on('message', (data: string) => {
        try {
          const message = JSON.parse(data.toString()) as ProtocolMessage;
          this.handleMessage(ws, message);
        } catch (err) {
          console.error('[WS Error] Failed to parse message:', err);
        }
      });
      ws.on('close', () => {
        this.handleDisconnect(ws);
      });
      ws.on('error', (err) => {
        console.error('[WS Error]', err);
        this.handleDisconnect(ws);
      });
    });
  }
  private setupHeartbeat() {
    setInterval(() => {
      this.wss.clients.forEach((ws) => {
        const extWs = ws as ExtendedWebSocket;
        if (!extWs.isAlive) {
          return extWs.terminate();
        }
        extWs.isAlive = false;
        extWs.ping();
      });
    }, HEARTBEAT_INTERVAL_MS);
  }
  private handleMessage(ws: ExtendedWebSocket, message: ProtocolMessage) {
    switch (message.type) {
      case MessageType.INIT_SESSION:
        this.handleInitSession(ws, message);
        break;
      case MessageType.CURSOR_MOVE:
        this.broadcast(ws, message);
        if (ws.userId) {
          const user = this.users.get(ws.userId);
          if (user) {
            user.cursor = { x: message.payload.x, y: message.payload.y };
          }
        }
        break;
      case MessageType.DOCUMENT_UPDATE:
        if (ws.roomId) {
          this.documentState.set(ws.roomId, message.payload.shapes);
        }
        this.broadcast(ws, message);
        break;
      case MessageType.SELECTION_CHANGE:
        this.broadcast(ws, message);
        break;
      case MessageType.PING:
        ws.send(JSON.stringify({ type: MessageType.PONG, timestamp: Date.now() }));
        break;
      default:
        console.warn('[WS] Unknown message type:', message.type);
    }
  }
  private handleInitSession(ws: ExtendedWebSocket, message: InitSessionMessage) {
    const { userId, roomId } = message.payload;
    const name = `User ${userId.substring(0, 4)}`;
    ws.userId = userId;
    ws.roomId = roomId;
    const userPresence: UserPresence = {
      userId,
      name,
      color: this.getRandomColor()
    };
    this.users.set(userId, userPresence);
    let room = this.rooms.get(roomId);
    if (!room) {
      room = new Set();
      this.rooms.set(roomId, room);
    }
    room.add(ws);
    const currentUsers = Array.from(room)
      .map(client => client.userId)
      .filter(id => id && id !== userId)
      .map(id => this.users.get(id!))
      .filter(u => u !== undefined) as UserPresence[];
    ws.send(JSON.stringify({
      type: MessageType.INIT_SESSION,
      timestamp: Date.now(),
      payload: {
        userId,
        roomId,
        users: currentUsers
      }
    }));
    if (this.documentState.has(roomId)) {
      ws.send(JSON.stringify({
        type: MessageType.DOCUMENT_UPDATE,
        timestamp: Date.now(),
        payload: {
          shapes: this.documentState.get(roomId)!
        }
      }));
    }
    const joinMessage: UserJoinedMessage = {
      type: MessageType.USER_JOINED,
      timestamp: Date.now(),
      senderId: userId,
      payload: {
        roomId,
        name
      }
    };
    this.broadcast(ws, joinMessage);
    console.log(`[WS] User ${userId} joined room ${roomId}`);
  }
  private handleDisconnect(ws: ExtendedWebSocket) {
    if (ws.userId && ws.roomId) {
      this.users.delete(ws.userId);
      const room = this.rooms.get(ws.roomId);
      if (room) {
        room.delete(ws);
        if (room.size === 0) {
          this.rooms.delete(ws.roomId);
          this.documentState.delete(ws.roomId);
        }
      }
      const leaveMessage: UserLeftMessage = {
        type: MessageType.USER_LEFT,
        timestamp: Date.now(),
        senderId: ws.userId
      };
      this.broadcastToRoom(ws.roomId, leaveMessage, ws);
      console.log(`[WS] User ${ws.userId} left room ${ws.roomId}`);
    }
  }
  private broadcast(sender: ExtendedWebSocket, message: ProtocolMessage) {
    if (sender.roomId) {
      this.broadcastToRoom(sender.roomId, message, sender);
    }
  }
  private broadcastToRoom(roomId: string, message: ProtocolMessage, exclude?: ExtendedWebSocket) {
    const room = this.rooms.get(roomId);
    if (room) {
      const data = JSON.stringify(message);
      room.forEach(client => {
        if (client !== exclude && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    }
  }
  private getRandomColor(): string {
    const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
