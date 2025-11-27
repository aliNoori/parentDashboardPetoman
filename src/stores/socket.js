// stores/socket.js
import { defineStore } from "pinia";
import { io } from "socket.io-client";

export const useSocketStore = defineStore("socket", {
    state: () => ({
        socket: null,
    }),
    actions: {
        connect(token) {
            if (!this.socket) {
                const socketUrl = import.meta.env.VITE_SOCKET_URL;
                this.socket = io(socketUrl, {
                    path: "/socket.io",
                    query: { token },
                    transports: ["websocket"],
                });
            }
        },
    },
});
