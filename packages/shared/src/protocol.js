"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["INIT_SESSION"] = "INIT_SESSION";
    MessageType["PING"] = "PING";
    MessageType["PONG"] = "PONG";
    MessageType["CURSOR_MOVE"] = "CURSOR_MOVE";
    MessageType["SELECTION_CHANGE"] = "SELECTION_CHANGE";
    MessageType["DOCUMENT_UPDATE"] = "DOCUMENT_UPDATE";
    MessageType["USER_JOINED"] = "USER_JOINED";
    MessageType["USER_LEFT"] = "USER_LEFT";
    MessageType["ERROR"] = "ERROR";
})(MessageType || (exports.MessageType = MessageType = {}));
