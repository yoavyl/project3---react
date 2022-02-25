import UserModel from "../03-Models/user-model";
import express, { NextFunction, Request, Response } from "express";
import logic from "../05-BLL/auth-logic"
import CredentialsModel from "../03-Models/credentials-model";

const router = express.Router();

//POST api/auth/register
router.post("/register", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const user = new UserModel(request.body);
        const token = await logic.register(user);
        response.status(201).json(token);
    } catch(err: any) {
        next(err)
    }
});

//POST api/auth/login
router.post("/login", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const credentials = new CredentialsModel(request.body);
        const token = await logic.login(credentials);
        response.status(201).json(token);

    } catch(err: any) {
        next(err)
    }
});

//POST api/auth/checkUsername/:username
router.get("/checkUsername/:username", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const username = request.params.username;
        const count = await logic.checkUsername(username);
        response.status(201).json(count);
    } catch(err: any) {
        next(err)
    }
});



export default router;