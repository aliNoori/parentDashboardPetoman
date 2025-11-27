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
                this.socket = io("http://localhost:3000", {
                    path: "/socket.io",
                    query: { token },
                    transports: ["websocket"],
                });
            }
        },
    },
});
