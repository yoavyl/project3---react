import axios from "axios";
import VacationModel from "../Models/VacationModel";
import { vacationsStore } from "../Redux/Store";
import { emptyVacationsStore, userVacationsDownloadedAction, vacationAddedAction, vacationDeletedAction, allVacationsDownloadedAction, vacationUpdatedAction } from "../Redux/VacationsState";
import config from "../Utils/config";

class VacationService {

    public async getAllVacations(): Promise<VacationModel[]> {
        if (vacationsStore.getState().allVacations?.length === 0) {
            const response =  await axios.get<VacationModel[]>(config.urls.vacations);
            const vacations = response.data;
            vacationsStore.dispatch(allVacationsDownloadedAction(vacations)) // send d/l action to redux
        }
        return vacationsStore.getState().allVacations;
    }

    // get one vacation from all vacations (used only in update vacation component)
    public async getOneVacation(id: number): Promise<VacationModel> {
        const vacations = vacationsStore.getState().allVacations;
        const vacation = vacations.find(p => p.id === id);
        if (vacation) {
            return vacation;
        }
        const response =  await axios.get<VacationModel>(config.urls.vacations + id);
        return response.data;
    }

    public async getAllVacationsPerUser(userId: number): Promise<VacationModel[]> {
        if (vacationsStore.getState().userVacations?.length === 0) {
            const response =  await axios.get<VacationModel[]>(config.urls.vacations + "vacations-per-user/" + userId);
            const userVacations = response.data;
            vacationsStore.dispatch(userVacationsDownloadedAction(userVacations)); // send d/l action to redux
        }
        return vacationsStore.getState().userVacations;
    }


    public async addVacation(vacation: VacationModel): Promise<VacationModel> {
        const myFormdata = new FormData();
        myFormdata.append("details", vacation.details);
        myFormdata.append("destination", vacation.destination);
        myFormdata.append("price", vacation.price.toString());
        myFormdata.append("fromDate", vacation.fromDate.toString());
        myFormdata.append("toDate", vacation.toDate.toString());
        myFormdata.append("image", vacation.image.item(0));

        // post method gets address + vacation to add
        const response = await axios.post<VacationModel>(config.urls.vacations, myFormdata);
        const addedVacation = response.data;
        // always added to all vacations (only)
        vacationsStore.dispatch(vacationAddedAction(addedVacation));
        return addedVacation;
    }

    public async updateVacation(vacation: VacationModel): Promise<VacationModel> {
        const myFormdata = new FormData();
        if (vacation.details) myFormdata.append("details", vacation.details);
        if (vacation.destination) myFormdata.append("destination", vacation.destination);
        if (vacation.price) myFormdata.append("price", vacation.price.toString());
        if (vacation.fromDate) myFormdata.append("fromDate", vacation.fromDate.toString());
        if (vacation.toDate) myFormdata.append("toDate", vacation.toDate.toString());
        if (vacation.image) myFormdata.append("image", vacation.image.item(0));

        // post method gets address + vacation to add
        const response = await axios.put<VacationModel>(config.urls.vacations + vacation.id, myFormdata);
        const updatedVacation = response.data;
        vacationsStore.dispatch(vacationUpdatedAction(updatedVacation));
        return updatedVacation;
    }

    public async deleteVacation(id: number): Promise<void> {
        await axios.delete(config.urls.vacations + id);
        vacationsStore.dispatch(vacationDeletedAction(id));
    }

    public async emptyVacationsStore() {
        vacationsStore.dispatch(emptyVacationsStore()); 
    }

}

const myVacationService = new VacationService();

export default myVacationService;