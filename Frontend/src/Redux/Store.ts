import { createStore } from "redux";
import { vacationsReducer } from "./VacationsState";
import { authReducer } from "./AuthState";


export const authStore = createStore(authReducer);
export const vacationsStore = createStore(vacationsReducer);
