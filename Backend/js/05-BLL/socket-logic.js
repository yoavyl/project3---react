"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var socketIoSerever;
function initSocketIo(httpServer) {
    var options = {
        cors: { origin: "*" }
    };
    socketIoSerever = new socket_io_1.Server(httpServer, options);
    socketIoSerever.sockets.on("connection", function (socket) {
        console.log("One client has been connected..");
        socket.on("disconnect", function () {
            console.log("One client has been disconnected..");
        });
    });
}
function emitAddVacation(vacation) {
    socketIoSerever.sockets.emit("admin-add-vacation", vacation);
}
function emitUpdateVacation(vacation) {
    socketIoSerever.sockets.emit("admin-update-vacation", vacation);
}
function emitDeleteVacation(id) {
    socketIoSerever.sockets.emit("admin-delete-vacation", id);
}
exports.default = {
    initSocketIo: initSocketIo,
    emitAddVacation: emitAddVacation,
    emitUpdateVacation: emitUpdateVacation,
    emitDeleteVacation: emitDeleteVacation
};
