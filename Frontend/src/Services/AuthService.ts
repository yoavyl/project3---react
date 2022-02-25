import { authStore } from '../Redux/Store';
import axios from "axios";
import CredentialsModel from "../Models/CredentialsModel";
import UserModel from "../Models/UserModel";
import Roles from "../Models/Roles";
import { loginAction, logoutAction, registerAction } from "../Redux/AuthState";
import config from "../Utils/config";

class AuthService {

    public async register(user: UserModel): Promise<void> {
        const response = await axios.post<string>(config.urls.register, user);
        const token = response.data;
        authStore.dispatch(registerAction(token));
    }

    public async login(cerdentials: CredentialsModel): Promise<void> {
        const response = await axios.post<string>(config.urls.login, cerdentials);
        const token = response.data;
        authStore.dispatch(loginAction(token));
    }

    // check how many times a username exists on DB
    public async checkUsername(username: string): Promise<number> {
        const response = await axios.get<{count: number}>(config.urls.checkUsername + username);
        const countObj = response.data;
        const count = +countObj.count;
        return count;
    }

    public async logout(): Promise<void> {
        authStore.dispatch(logoutAction());
    }

    public isLoggedIn(): boolean {
        return authStore.getState().token !== null;
    }

    public isAdmin(): boolean {
        const user = authStore.getState().user;
        if (user) {
            const role = user.role;
            if (role === Roles.Admin) return true;   
            if (role === Roles.User) return false;   
        }
        return false;   
    }

}

const authService = new AuthService();

export default authService;