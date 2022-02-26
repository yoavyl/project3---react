"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_error_1 = __importDefault(require("../03-Models/client-error"));
// Catch-All
function errorsHandler(err, request, response, next) {
    console.log(err);
    // Crash, like throw...:
    if (err instanceof Error) {
        response.status(err.status || 500).send(err.message); // short circuit like react
        // err status for sysrem errors, like bad JSON
        return;
    }
    // Client error:
    if (err instanceof client_error_1.default) {
        response.status(err.status).send(err.message);
        return;
    }
    next(); // just in case
}
exports.default = errorsHandler;
