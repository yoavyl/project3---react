"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv")); // .env
dotenv_1.default.config();
var config_1 = __importDefault(require("./01-Utils/config"));
var errors_handler_1 = __importDefault(require("./02-Middleware/errors-handler"));
var client_error_1 = __importDefault(require("./03-Models/client-error"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var socket_logic_1 = __importDefault(require("./05-BLL/socket-logic"));
var vacations_controller_1 = __importDefault(require("./06-Controllers/vacations-controller"));
var auth_controller_1 = __importDefault(require("./06-Controllers/auth-controller"));
var followers_controller_1 = __importDefault(require("./06-Controllers/followers-controller"));
var path_1 = __importDefault(require("path")); // for heroku cloud / production
var expressServer = (0, express_1.default)();
expressServer.use((0, cors_1.default)());
expressServer.use((0, express_fileupload_1.default)());
expressServer.use(express_1.default.json());
// set the folder of index.html, for cloud u/l purposes
if (process.env.ENVIRONMENT === "production") {
    expressServer.use(express_1.default.static(path_1.default.join(__dirname, "./07-Frontend")));
}
expressServer.use("/api/followers", followers_controller_1.default);
expressServer.use("/api/vacations", vacations_controller_1.default);
expressServer.use("/api/auth", auth_controller_1.default);
expressServer.use("*", function (request, response, next) {
    if (process.env.ENVIRONMENT === "development") {
        var cleinetErr = new client_error_1.default(404, "Route Not Found"); // for dev purposes
        next(cleinetErr); // will jump tp Catch-All middlewar (error-handler) // for dev purposes
    }
    if (process.env.ENVIRONMENT === "production") {
        // for cloud purposes: send back index.html on any route not found (SPA behavior)
        response.sendFile(path_1.default.join(__dirname, "./07-Frontend/index.html"));
    }
});
expressServer.use(errors_handler_1.default);
var httpServer = expressServer.listen(config_1.default.port, function () { return console.log("Listening..."); });
socket_logic_1.default.initSocketIo(httpServer);
