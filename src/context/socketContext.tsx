import { createContext } from "react";
import socketio, { Socket } from "socket.io-client";

export const chatSocket = socketio(`${process.env.REACT_APP_CHAT}`);
export const gameSocket = socketio(`${process.env.REACT_APP_GAME}`);

console.log('chat socket is')
console.log(`${process.env.REACT_APP_CHAT}`)
console.log('game socket is')
console.log(`${process.env.REACT_APP_GAME}`)

export const ChatContext = createContext<Socket>(chatSocket);
export const GameContext = createContext<Socket>(gameSocket);