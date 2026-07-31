export declare enum MessageType {
    INIT_SESSION = "INIT_SESSION",
    PING = "PING",
    PONG = "PONG",
    CURSOR_MOVE = "CURSOR_MOVE",
    SELECTION_CHANGE = "SELECTION_CHANGE",
    DOCUMENT_UPDATE = "DOCUMENT_UPDATE",
    USER_JOINED = "USER_JOINED",
    USER_LEFT = "USER_LEFT",
    ERROR = "ERROR"
}
export interface UserPresence {
    userId: string;
    name: string;
    color: string;
    cursor?: {
        x: number;
        y: number;
    };
}
export interface BaseMessage {
    type: MessageType;
    timestamp: number;
    senderId?: string;
}
export interface InitSessionMessage extends BaseMessage {
    type: MessageType.INIT_SESSION;
    payload: {
        userId: string;
        roomId: string;
        users: UserPresence[];
    };
}
export interface PingMessage extends BaseMessage {
    type: MessageType.PING;
}
export interface PongMessage extends BaseMessage {
    type: MessageType.PONG;
}
export interface CursorMoveMessage extends BaseMessage {
    type: MessageType.CURSOR_MOVE;
    payload: {
        x: number;
        y: number;
    };
}
export interface DocumentUpdateMessage extends BaseMessage {
    type: MessageType.DOCUMENT_UPDATE;
    payload: {
        shapes: any[];
    };
}
export interface SelectionChangeMessage extends BaseMessage {
    type: MessageType.SELECTION_CHANGE;
    payload: {
        selectedIds: string[];
    };
}
export interface UserJoinedMessage extends BaseMessage {
    type: MessageType.USER_JOINED;
    payload: {
        roomId: string;
        name: string;
    };
}
export interface UserLeftMessage extends BaseMessage {
    type: MessageType.USER_LEFT;
}
export interface ErrorMessage extends BaseMessage {
    type: MessageType.ERROR;
    payload: {
        code: string;
        message: string;
    };
}
export type ProtocolMessage = InitSessionMessage | PingMessage | PongMessage | CursorMoveMessage | DocumentUpdateMessage | SelectionChangeMessage | UserJoinedMessage | UserLeftMessage | ErrorMessage;
//# sourceMappingURL=protocol.d.ts.map