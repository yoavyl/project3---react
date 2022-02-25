import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import { Unsubscribe } from "redux";
import Roles from "../../../Models/Roles";
import { authStore } from "../../../Redux/Store";
import Login from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import Register from "../../AuthArea/Register/Register";
import AddVacation from "../../VacationArea/AddVacation/AddVacation";
import BarChart from "../../VacationArea/BarChart/BarChart";
import UpdateVacation from "../../VacationArea/UpdateVacation/UpdateVacation";
import VacationsList from "../../VacationArea/VacationsList/VacationsList";
import About from "../About/About";
import Page404 from "../Page404/Page404";

function Router(): JSX.Element {

    // isLoggedIn is set "true" as default, coz otherwise user is automatically redirected to login
    // even if there is a token (since the html is rendered before useEffect)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // default true for heroku purposes
    
    // (this is relevant when i go directly to admin related url (/add-vacation), 
    // so it refreshes the app and deletes redux)
    // so for that purpose isAdmin is default true, but then I check if it is so
    const [isAdmin, setIsAdmin] = useState<boolean>(true); // default true for heroku purposes

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
        <div className="Router">
			<Routes>
                <Route path="*" element={<Page404 />} />
                <Route path="/home" element={isLoggedIn ? <VacationsList /> : <Navigate replace to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/chart" element={isAdmin ? <BarChart />: <Navigate replace to="/login" />} />
                <Route path="/add-vacation" element={isAdmin ? <AddVacation /> : <Navigate replace to="/login" />} />
                <Route path="/update-vacation/:id" element={isAdmin ? <UpdateVacation /> : <Navigate replace to="/login" />} />
                <Route path="/" element={<Navigate to="/home" />} />
            </Routes>
        </div>
    );
}

export default Router;
