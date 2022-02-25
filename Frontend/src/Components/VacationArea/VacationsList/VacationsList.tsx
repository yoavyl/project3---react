import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Unsubscribe } from "redux";
import Roles from "../../../Models/Roles";
import UserModel from "../../../Models/UserModel";
import VacationModel from "../../../Models/VacationModel";
import { authStore, vacationsStore } from "../../../Redux/Store";
import myVacationService from "../../../Services/VacationService";
import VacationCard from "../VacationsCard/VacationCard";

function VacationsList(): JSX.Element {

    const [user, setUser] = useState<UserModel>();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [userVacations, setUserVacations] = useState<VacationModel[]>([]); // only user's vacations
    const [restVacations, setRestVacations] = useState<VacationModel[]>([]); // only non-user's vacations (all vacations minus user's vacations)

    const navigate = useNavigate();

    const unsubscribeMeAuthStore: Unsubscribe = authStore.subscribe(() => {
        const user = authStore.getState().user;
        setUser(user);
    });

    let unsubscribeMeVacationsStore: Unsubscribe;

    async function setUserVacationsAndRestVacationsForRegularUser(userId: number, allVacations: VacationModel[]) {
        const userVacations = await myVacationService.getAllVacationsPerUser(userId);
        if (userVacations.length > 0) {
            const userVacationFiltered = userVacations.map(vacation => { return vacation.id; });
            const restVacations = allVacations.filter(vacation => !userVacationFiltered.includes(vacation.id));
            setUserVacations(userVacations);
            setRestVacations(restVacations);
        } else {
            setRestVacations(allVacations);
        }
    }

    useEffect(() => {

        (async () => {

            const user = authStore.getState().user;
            if (user === null) {
                navigate("/login");
            } else {
                setUser(user);
                const allVacations = await myVacationService.getAllVacations();
                const role = user.role;

                // if Admin -> all vacations = rest of the vacations, user vacations is empty
                if (role === Roles.Admin) {
                    setIsAdmin(true);
                    setRestVacations(allVacations);
                    return;
                }

                await setUserVacationsAndRestVacationsForRegularUser(user.id, allVacations);

                // subscribe to changes (via sockets) in vacations store
                unsubscribeMeVacationsStore = vacationsStore.subscribe(async () => {
                    const allVacations = await myVacationService.getAllVacations();
                    setUserVacationsAndRestVacationsForRegularUser(user.id, allVacations);
                });

            }

        })();

        return () => {
            unsubscribeMeAuthStore();

            // if admin - unsubscribeMe2 does'nt get any value/subscription
            // so if i tried to unsubscribe there is a console error
            const user = authStore.getState().user;
            if (user.role !== Roles.Admin) {
                unsubscribeMeVacationsStore();
            }
        }

    }, []);


    return (
        <div className="VacationsList">
            {userVacations?.map(v => <VacationCard key={v?.id} vacation={v} user={user} isAdmin={isAdmin} />)}
            {restVacations?.map(v => <VacationCard key={v?.id} vacation={v} user={user} isAdmin={isAdmin} />)}
        </div>
    );
}

export default VacationsList;
