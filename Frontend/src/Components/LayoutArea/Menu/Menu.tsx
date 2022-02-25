import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Unsubscribe } from "redux";
import Roles from "../../../Models/Roles";
import { authStore } from "../../../Redux/Store";
import "./Menu.css";

function Menu(): JSX.Element {

    const [isAdmin, setIsAdmin] = useState<boolean>(true); // default true in heroku
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // default has to be true in heroku

    const unsubscribeMe: Unsubscribe = authStore.subscribe(() => {
        
        let user = authStore.getState().user;
        if (!user) {
            setIsLoggedIn(false);
            setIsAdmin(false);
        } else {
            setIsLoggedIn(true);
            const role = user?.role;
            if (role === Roles.Admin) setIsAdmin(true);
            if (role !== Roles.Admin) setIsAdmin(false);
        }
    });

    useEffect(() => {

        const user = authStore.getState().user;

        if (!user) {
            setIsLoggedIn(false);
            setIsAdmin(false);
        } else {
            const role = user?.role;
            if (role !== Roles.Admin) setIsAdmin(false);
        }

    }, []);

    useEffect( () => {
        return () => {
            unsubscribeMe();   
        };
    },  []);

    return (
        <div className="Menu">
            {isLoggedIn && <>
                <NavLink to="/home">Vacation List</NavLink>
            </>}
            {isAdmin && <>
                <NavLink to={"/chart"}>Followers Graph</NavLink>
                <NavLink to={"/add-vacation"}>Add a Vacation</NavLink>
            </>}
            <NavLink to="/about">About / READ ME</NavLink>
        </div>
    );
}

export default Menu;
