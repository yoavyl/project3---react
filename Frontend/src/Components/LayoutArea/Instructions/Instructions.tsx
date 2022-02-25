import { useEffect, useState } from "react";
import { Unsubscribe } from "redux";
import Roles from "../../../Models/Roles";
import { authStore } from "../../../Redux/Store";
import "./Instructions.css";

function Instructions(): JSX.Element {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // default has to be true in heroku
    const [isAdmin, setIsAdmin] = useState<boolean>(true);

    const unsubscribeMe: Unsubscribe = authStore.subscribe(() => {

        const user = authStore.getState().user;
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

        let user = authStore.getState().user;
        if (user) {
            // setIsLoggedIn(true);
            const role = user?.role;
            if (role !== Roles.Admin) setIsAdmin(false);
        } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
        }
    }, []);

    useEffect( () => {
        return () => {
            unsubscribeMe();   
        };
    },  []);
    
    return (
        <div className="Instructions">
            {isLoggedIn && !isAdmin && <>
                <div className="Numbering">
                    1. Select a vacation
                </div>
                <div className="Numbering">
                    2. Tag ❤️ to follow
                </div>
                <div className="Numbering">
                    3. Stay updated
                </div>
            </>}
        </div>
    );
}

export default Instructions;
