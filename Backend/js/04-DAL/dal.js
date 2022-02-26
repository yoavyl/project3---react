"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("mysql"));
var config_1 = __importDefault(require("../01-Utils/config"));
// import dotenv from "dotenv"; // .env
// dotenv.config();
var connection = mysql_1.default.createPool({
    host: config_1.default.mySql.host,
    user: config_1.default.mySql.user,
    password: config_1.default.mySql.password,
    database: config_1.default.mySql.database
});
function execute(sql) {
    return new Promise(function (resolve, reject) {
        connection.query(sql, function (err, result) {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}
exports.default = {
    execute: execute
};
