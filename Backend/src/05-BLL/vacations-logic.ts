import { OkPacket } from "mysql";
import { v4 as uuid } from "uuid";
import config from "../01-Utils/config";
import safeDelete from "../01-Utils/safe-delete";
import ClientError from "../03-Models/client-error";
import VacationModel from "../03-Models/vacation-model";
import dal from "../04-DAL/dal";
import socketLogic from "./socket-logic";
import followersLogic from "../05-BLL/followers-logic";

async function getAllVacations(): Promise<VacationModel[]> {
    const sql = `SELECT id, details, DATE_FORMAT(fromDate, "%Y-%m-%d") AS fromDate, 
                DATE_FORMAT(toDate, "%Y-%m-%d") AS toDate, destination, imageName, 
                followers, price from Vacations`
    const vacations = await dal.execute(sql);
    vacations.map(v => v.isUserFollowing = false); 
    return vacations;
}

async function getAllVacationsPerUser(userId: number): Promise<VacationModel[]> {
    const sql = `SELECT Vacations.id, details, DATE_FORMAT(fromDate, "%Y-%m-%d") AS fromDate, 
                DATE_FORMAT(toDate, "%Y-%m-%d") AS toDate, destination, imageName, 
                followers, price
                FROM Vacations JOIN Followers on Vacations.id = Followers.vacationId 
                WHERE userId = ${userId}`
    const vacationsPerUser = await dal.execute(sql);
    vacationsPerUser.map(v => v.isUserFollowing = true);
    return vacationsPerUser;
}

async function getOneVacation(id: number): Promise<VacationModel> {
    const sql = "SELECT * FROM Vacations WHERE id = " + id;
    const vacations = await dal.execute(sql);
    const vacation = vacations[0];
    return vacation;
}

async function addVacation(vacation: VacationModel): Promise<VacationModel> {
    const errors = vacation.validatePost(); // including image validation
    if (errors) {
        throw new ClientError(400, errors)
    }

    // take the orginal extension (tiff, jpg.jpeg, gif, png, bmp...):
    const extension = vacation.image.name.substring(vacation.image.name.lastIndexOf(".")); //".jpg" etc.
    // create uuid file name
    vacation.imageName = uuid() + extension;

    const sql = `INSERT INTO Vacations(destination, details, imageName, fromDate, toDate, price) 
                VALUES ('${vacation.destination}', '${vacation.details}', '${vacation.imageName}',
                '${vacation.fromDate}', '${vacation.toDate}', ${vacation.price})`;
    const result: OkPacket = await dal.execute(sql);
    vacation.id = result.insertId;

    // save image to disk
    await vacation.image.mv(config.imageFolder + vacation.imageName);

    delete vacation.image;

    //socket.io
    socketLogic.emitAddVacation(vacation);

    return vacation;
}

async function updateVacation(vacation: VacationModel): Promise<VacationModel> {
    const errors = vacation.validatePut();
    if (errors) {
        throw new ClientError(400, errors)
    }

    // get existing DB product and update with frontend values
    const dbVacation = await getOneVacation(vacation.id);
    for (const prop in vacation) {
        if (vacation[prop] === undefined) {
            vacation[prop] = dbVacation[prop]
        }
    }

    // if user sent an image
    if (vacation.image !== undefined) {
        // take the orginal extension (tiff, jpg.jpeg, gif, png, bmp...):
        const extension = vacation.image.name.substring(vacation.image.name.lastIndexOf(".")); //".jpg" etc.
        // create uuid file name
        vacation.imageName = uuid() + extension;

        await vacation.image.mv(config.imageFolder + vacation.imageName); // u/l new image to disk
        safeDelete(config.imageFolder + dbVacation.imageName); // delete the old image from disk

        delete vacation.image;
    }

    const sql = `UPDATE Vacations SET
                destination = '${vacation.destination}', 
                details = '${vacation.details}', 
                imageName ='${vacation.imageName}',
                fromDate = '${vacation.fromDate}', 
                toDate = '${vacation.toDate}', 
                price = ${vacation.price}
                WHERE id = ${vacation.id}`;
    const info: OkPacket = await dal.execute(sql);

    //socket.io
    socketLogic.emitUpdateVacation(vacation);

    return vacation;
}

async function deleteVacation(id: number): Promise<void> {
    // before delete, remove all followers of vacation from followers table (MUST, there are constrains in DB)
    await followersLogic.removeAllFollowersPerVacation(id);
    
    const dbVacation = await getOneVacation(id); // i need that for imageName
    const sql = "DELETE FROM Vacations WHERE id = " + id;
    const results: OkPacket = await dal.execute(sql); 

    // delete the old image from DB
    safeDelete(config.imageFolder + dbVacation.imageName);

    //socket.io
    socketLogic.emitDeleteVacation(id);
}

export default {
    getAllVacations,
    getAllVacationsPerUser,
    addVacation,
    updateVacation,
    deleteVacation,    
};

    