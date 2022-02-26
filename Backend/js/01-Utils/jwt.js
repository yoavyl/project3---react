"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("./config"));
var secretKey = "I-love-Elinor";
function getNewToken(user) {
    var payload = { user: user };
    var token = jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: config_1.default.loginExpiresIn });
    return token;
}
function verifyToken(request) {
    return new Promise(function (resolve, reject) {
        try {
            // if missing authorization header
            if (!request.headers.authorization) {
                resolve(false);
                return;
            }
            // authorization format: "Bearer the-token"
            var token = request.headers.authorization.substring(7); // "Bearer ...."
            // if missing token
            if (!token) {
                resolve(false);
                return;
            }
            // verify token
            jsonwebtoken_1.default.verify(token, secretKey, function (err, payload) {
                // if token invalid (expires / wrong format...)
                if (err) {
                    resolve(false);
                    return;
                }
                // token is valid
                resolve(true);
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
// must call that function only when yoken is verified
function getUserFromToken(request) {
    // get token from request
    var token = request.headers.authorization.substring(7); // "Bearer ...."
    // extraבt payload
    var payload = jsonwebtoken_1.default.decode(token);
    return payload.user; // 
}
exports.default = {
    getNewToken: getNewToken,
    verifyToken: verifyToken,
    getUserFromToken: getUserFromToken
};
