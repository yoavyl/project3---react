import { OkPacket } from "mysql";
import ClientError from "../03-Models/client-error";
import FollowerModel from "../03-Models/follower-model";
import VacationModel from "../03-Models/vacation-model";
import dal from "../04-DAL/dal";

async function addFollower(follower: FollowerModel): Promise<FollowerModel> {

    const errors = follower.validatePost();
    if (errors) {
        throw new ClientError(400, errors)
    }

    // check if user already follows this vacation, so not to insert it again to Followers table
    const sqlCheckFollowerTable = `SELECT * FROM Followers 
                                WHERE userId=${follower.userId} 
                                AND vacationId=${follower.vacationId}`;
    const followers = await dal.execute(sqlCheckFollowerTable);
    if (followers.length > 0) throw new ClientError(406, "user already follows this vacation");

    // add follower to followers table
    const sqlFollowerTable = `INSERT INTO followers 
                            VALUES (${follower.userId}, ${follower.vacationId})`;
    const result: OkPacket = await dal.execute(sqlFollowerTable);

    // update +1 to followers in vacations table
    const sqlVacationsTable = `UPDATE Vacations 
                            SET followers = followers + 1 
                            WHERE id = ${follower.vacationId}`;
    const info: OkPacket = await dal.execute(sqlVacationsTable);   

    return follower;
}

async function removeFollower(follower: FollowerModel): Promise<void> {

    const errors = follower.validatePost();
    if (errors) {
        throw new ClientError(400, errors)
    }

    // check if user already unfollows this vacation, 
    // otherwise it will delete followers from vacation table forver on sqlVacationsTable
    const sqlCheckFollowerTable = `SELECT * FROM Followers 
                                WHERE userId=${follower.userId} 
                                AND vacationId=${follower.vacationId}`;
    const followers = await dal.execute(sqlCheckFollowerTable);
    if (followers.length === 0) throw new ClientError(404, "user already not follows this vacation");

    // remove follower from followers table
    const sqlFollowerTable = `DELETE FROM Followers 
                            WHERE vacationId=${follower.vacationId} 
                            AND userId=${follower.userId}`;
    const results: OkPacket = await dal.execute(sqlFollowerTable);   
    
    // update -1 to followers in vacations table
    const sqlVacationsTable = `UPDATE Vacations 
                            SET followers = followers - 1 
                            WHERE id = ${follower.vacationId}`;
    const info: OkPacket = await dal.execute(sqlVacationsTable);      
}

async function getStats(): Promise<VacationModel[]> {
    // get only followed vacations from the followers table, sorted by number of followers, then by ABC
    // (i know i could have written another sql request using only followers field on vacations table)
    const sql = `SELECT COUNT(userId) AS followers, destination
                FROM Followers JOIN Vacations 
                ON Followers.vacationId = Vacations.id 
                GROUP BY vacationId
                ORDER BY followers DESC, destination ASC`
    const vacations = await dal.execute(sql);
    return vacations;
}


export default {
    addFollower,
    removeFollower,
    getStats
};
    