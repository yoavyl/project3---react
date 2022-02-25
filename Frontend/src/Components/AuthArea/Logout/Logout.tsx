import { useEffect } from "react";
import { useNavigate } from "react-router";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import myVacationService from "../../../Services/VacationService";

function Logout(): JSX.Element {

    const navigator = useNavigate();

    useEffect((async () => {
        await authService.logout();
        notifyService.success("You are now logged out");

        // empty vacations store (all vacations and user vacations)
        myVacationService.emptyVacationsStore();

        navigator("/login");
    }) as any, []); 

    return null; // no UI
}

export default Logout;
