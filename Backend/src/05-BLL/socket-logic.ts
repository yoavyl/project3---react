import { Server as HttpServer } from "http";
import { Server as SocketIoServer, Socket} from "socket.io"
import VacationModel from "../03-Models/vacation-model";

let socketIoSerever: SocketIoServer;

function initSocketIo(httpServer: HttpServer): void {

    const options = {
        cors: { origin: "*" }
    };

    socketIoSerever = new SocketIoServer(httpServer, options);

    socketIoSerever.sockets.on("connection", (socket: Socket) => {
        console.log("One client has been connected..");

        socket.on("disconnect", () => {
            console.log("One client has been disconnected..");
        })
    });

}

function emitAddVacation(vacation: VacationModel): void {
    socketIoSerever.sockets.emit("admin-add-vacation", vacation);
}

function emitUpdateVacation(vacation: VacationModel): void {
    socketIoSerever.sockets.emit("admin-update-vacation", vacation);
}

function emitDeleteVacation(id: number): void {
    socketIoSerever.sockets.emit("admin-delete-vacation", id);
}

export default {
    initSocketIo,
    emitAddVacation,
    emitUpdateVacation,
    emitDeleteVacation
}