import { OkPacket } from "mysql";
import CredentialsModel from "../03-Models/credentials-model";
import UserModel from "../03-Models/user-model";
import dal from "../04-DAL/dal";
import jwt from "../01-Utils/jwt"
import Role from "../03-Models/role";
import ClientError from '../03-Models/client-error';
import crypto from "../01-Utils/crypto"

// check if (how many times) username exists in DB
async function checkUsername(username: string): Promise<{count: number}> {
    const sql = `SELECT COUNT(username) AS count FROM Users WHERE username = '${username}'`;
    const usernameCountArray = await dal.execute(sql);
    const usernameCount = usernameCountArray[0];
    return usernameCount;
}

async function register(user: UserModel): Promise<string> {

    const errors = user.validatePost();
    if (errors) {
        throw new ClientError(400, errors)
    }
    
    // check if (how many times) username exists in DB
    const usernameCount = await checkUsername(user.username);
    if(usernameCount.count > 0) throw new ClientError(403, "username is not avilable. choose another one"); // or 409?

    // hash password befora saving in DB
    user.password = crypto.hash(user.password);

    //set default role as user
    user.role = Role.User;
    const sql = `INSERT INTO Users(firstName, lastName, username, password, role) 
                VALUES ('${user.firstName}', '${user.lastName}', '${user.username}', 
                '${user.password}', '${user.role}')`;
    const result: OkPacket = await dal.execute(sql);
    user.id = result.insertId;

    // remove password
    delete user.password

    // generate new token
    const token = jwt.getNewToken(user);
    return token;
}

async function login(credentials: CredentialsModel): Promise<string> {

    const errors = credentials.validatePost();
    if (errors) {
        throw new ClientError(400, errors)
    }
    // get all users
    const sqlToCheck = "SELECT * FROM Users";
    // verify user doesn't exist in DB
    const users = await dal.execute(sqlToCheck);

    // hash login password before searching in DB users
    credentials.password = crypto.hash(credentials.password);

    //find the given user
    const user = users.find(u => u.username === credentials.username && u.password === credentials.password);
    if (!user) throw new ClientError(401, "Incorrect username or password");

    // remove password
    delete user.password;

    // generate new token
    const token = jwt.getNewToken(user);
    return token; 
}

export default {
    register,
    login,
    checkUsername
};