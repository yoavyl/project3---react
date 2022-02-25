import { authStore, vacationsStore } from './../Redux/Store';
import { Socket, io } from "socket.io-client";
import VacationModel from "../Models/VacationModel";
import { vacationAddedAction, vacationDeletedAction, vacationUpdatedAction } from "../Redux/VacationsState";
import config from "../Utils/config";
import UserModel from '../Models/UserModel';
import myVacationService from './VacationService';
import Roles from '../Models/Roles';

interface AuthMenuState {
	user: UserModel;
}

class SocketIoService {

    private socket: Socket;

    private user = authStore.getState().user;


    public connect(): void {

        // connect to socket server
        this.socket = io(config.urls.socketServer);

        // so that admin will update itself via sockets
        if (this.user?.role === Roles.Admin) return

        // listen to add vacation by admin
        this.socket.on("admin-add-vacation", (vacation: VacationModel) => {
            // the new vacation has 0 followers, and the user is not following it
            vacation.followers=0;
            vacation.isUserFollowing=false;
            // always added to all vacations (only)
            vacationsStore.dispatch(vacationAddedAction(vacation));
        });

        // listen to update vacation by admin
        this.socket.on("admin-update-vacation", async (vacation: VacationModel) => {
            // update all vacations and / or user vacations
            vacationsStore.dispatch(vacationUpdatedAction(vacation));
        });

        // listen to update vacation by admin
        this.socket.on("admin-delete-vacation", async (id: number) => {
            // deletes in all vacations and / or user vacations
            // note to self: can't i just straight delete it? yes, since the admin deletes as well
            const vacations = await myVacationService.getAllVacations();
            const index = vacations.findIndex(v => v.id === id);
            if (index >=0) {
                vacationsStore.dispatch(vacationDeletedAction(id));
            }
        })

    }

    public disconnect(): void {
        this.socket.disconnect();
    }

}

const socketIoService = new SocketIoService();

export default socketIoService;