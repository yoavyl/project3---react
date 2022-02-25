import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv"; // .env
dotenv.config();

import config from "./01-Utils/config";
import errorsHandler from "./02-Middleware/errors-handler";
import ClientError from "./03-Models/client-error";
import fileUpload from "express-fileupload";
import socketLogic from './05-BLL/socket-logic';
import vacationsController from "./06-Controllers/vacations-controller";
import authController from "./06-Controllers/auth-controller";
import followersController from "./06-Controllers/followers-controller"
import path from "path"; // for heroku cloud / production

const expressServer = express();

expressServer.use(cors());

expressServer.use(fileUpload());

expressServer.use(express.json()); 

// set the folder of index.html, for cloud u/l purposes
if (process.env.ENVIRONMENT === "production") { 
    expressServer.use(express.static(path.join(__dirname, "./07-Frontend")));
}

expressServer.use("/api/followers", followersController);
expressServer.use("/api/vacations", vacationsController);
expressServer.use("/api/auth", authController);
expressServer.use("*", (request: Request, response: Response, next: NextFunction) => {

    if (process.env.ENVIRONMENT === "development") { 
        const cleinetErr = new ClientError(404, "Route Not Found") // for dev purposes
        next(cleinetErr); // will jump tp Catch-All middlewar (error-handler) // for dev purposes
    }

    if (process.env.ENVIRONMENT === "production") { 
        // for cloud purposes: send back index.html on any route not found (SPA behavior)
        response.sendFile(path.join(__dirname, "./07-Frontend/index.html")); 
    }
})
expressServer.use(errorsHandler); 
const httpServer = expressServer.listen(config.port, () => console.log("Listening..."));
socketLogic.initSocketIo(httpServer);
