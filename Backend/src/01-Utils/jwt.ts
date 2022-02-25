import {Request} from "express"
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken"
import config  from "./config";
import UserModel  from "../03-Models/user-model";

const secretKey = "I-love-Elinor";

function getNewToken(user: UserModel): string {
    const payload = { user }
    const token = jwt.sign(payload, secretKey, {expiresIn: config.loginExpiresIn});
    return token;
}

function verifyToken(request: Request): Promise<boolean> {
    return new Promise((resolve, reject) => {
        try {
            // if missing authorization header
            if (!request.headers.authorization) {
                resolve(false);
                return;
            }

            // authorization format: "Bearer the-token"
            const token = request.headers.authorization.substring(7); // "Bearer ...."

            // if missing token
            if (!token) {
                resolve(false);
                return;
            }

            // verify token
            jwt.verify(token, secretKey, (err: VerifyErrors, payload: JwtPayload) => {  // payload = {user: {firstName....}} -> payload is an object thatcontains the user

                // if token invalid (expires / wrong format...)
                if(err) {
                    resolve(false);
                    return; 
                }

                // token is valid
                resolve(true);
            });

        } catch (err:any) {
            reject(err)
        }
    })
}

// must call that function only when yoken is verified
function getUserFromToken(request: Request): UserModel {

    // get token from request
    const token = request.headers.authorization.substring(7); // "Bearer ...."

    // extraבt payload
    const payload = jwt.decode(token);

    return (payload as any).user; // 
}

export default {
    getNewToken,
    verifyToken,
    getUserFromToken
}