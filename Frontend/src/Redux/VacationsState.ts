import VacationModel from "../Models/VacationModel";

// Vacations AppState: the application level date
export class VacationState {
    public allVacations: VacationModel[] = [];
    public userVacations: VacationModel[] = [];
}

// Vacation Action Types: which actions we can perform on the data
export enum VacationActionType {
    fetchAllVacations = "fetchAllVacations", // all vacations from DB
    fetchUserVacations = "fetchUserVacations",  // only vacations this user follows, based on followers table
    addVacation = "addVacation", // add vacation by admin to all vacations only (added vacation is always not followed)
    updatedVacation = "updatedVacation", // both in all vacations and / or user vacations
    deletedVacation = "deletedVacation", // in all vacations and / or user vacations
    emptyVacationsOnLogout = "emptyVacationsOnLogout"
}

// Vacation Action: a single object containing data to perform single action type
export interface VacationAction {
    type: VacationActionType; // the action type
    payload: any; // the action data
}


// Vacation Action Creators: 
export function allVacationsDownloadedAction(allVacations: VacationModel[]): VacationAction {
    return { type: VacationActionType.fetchAllVacations, payload: allVacations };
}
export function userVacationsDownloadedAction(userVacations: VacationModel[]): VacationAction {
    return { type: VacationActionType.fetchUserVacations, payload: userVacations };
}
export function vacationAddedAction(vacationToAdd: VacationModel): VacationAction {
    return { type: VacationActionType.addVacation, payload: vacationToAdd };
}
export function vacationUpdatedAction(vacationToUpdate: VacationModel): VacationAction {
    return { type: VacationActionType.updatedVacation, payload: vacationToUpdate };
}
export function vacationDeletedAction(idToDelete: number): VacationAction {
    return { type: VacationActionType.deletedVacation, payload: idToDelete };
}
export function emptyVacationsStore(): VacationAction {
    return { type: VacationActionType.emptyVacationsOnLogout, payload: null };
}



// Vacations Reducer:
export function vacationsReducer(currentState: VacationState = new VacationState(), action: VacationAction): VacationState {
    
    // duplicate curret state into a new one
    const newState = { ...currentState };

    switch(action.type) {
        case VacationActionType.fetchAllVacations: // Here payload is all vacations (VacationModel[])
            newState.allVacations = action.payload;
            break;

        case VacationActionType.fetchUserVacations: // Here payload is all vacations (VacationModel[])
            newState.userVacations = action.payload;
            break;

        case VacationActionType.addVacation: // Here payload is the added vacation (VacationModel)
            const vacation = action.payload;
            if (newState.allVacations.find(p => p.id === vacation.id) === undefined) {
                newState.allVacations.push(action.payload);
            }
            break;

        case VacationActionType.updatedVacation: { // Here payload is the updated vacation (VacationModel)
            const indexAllVacations = newState.allVacations.findIndex(v => v.id === action.payload.id);
            newState.allVacations[indexAllVacations] = action.payload;
            const indexUserVacations = newState.userVacations.findIndex(v => v.id === action.payload.id);
            if (indexUserVacations >=0) {
                newState.userVacations[indexUserVacations] = action.payload;
            }
            break;
        }
        case VacationActionType.deletedVacation: { // Here payload is the deleted vacation's id (number)
            const indexAllVacations = newState.allVacations.findIndex(v => v.id === action.payload);
            if (indexAllVacations >=0) {
                delete newState.allVacations[indexAllVacations];
            }
            const indexUserVacations = newState.userVacations.findIndex(v => v.id === action.payload);
            if (indexUserVacations >=0) {
                delete newState.userVacations[indexUserVacations];
            }
            break;
        }

        // for logout and re-login with a different user purposes
        case VacationActionType.emptyVacationsOnLogout: {
            newState.allVacations = [];
            newState.userVacations = [];
            break;
        }
    }

    return newState;
}