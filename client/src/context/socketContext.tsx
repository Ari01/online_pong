import { createContext } from "react";
import socketio, { Socket } from "socket.io-client";

export const chatSocket = socketio(`${process.env.REACT_APP_CHAT}`);
export const gameSocket = socketio(`${process.env.REACT_APP_GAME}`);

export const ChatContext = createContext<Socket>(chatSocket);
export const GameContext = createContext<Socket>(gameSocket);