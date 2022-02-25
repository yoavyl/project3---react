import express, { NextFunction, Request, Response } from "express";
import verifyAdmin from "../02-Middleware/verify-admin";
import verifyUserNotAdmin from "../02-Middleware/verify-user-not-admin";
import FollowerModel from "../03-Models/follower-model";
import logic from "../05-BLL/followers-logic";


const router = express.Router();

// POST api/followers/remove
router.post("/remove", verifyUserNotAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const follower = new FollowerModel(request.body);
        await logic.removeFollower(follower);
        response.sendStatus(204);    }
    catch(err: any) {
        next(err);
    }
});

// POST FOLLOWER api/followers/add
router.post("/add", verifyUserNotAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const follower = new FollowerModel(request.body);
        const addedFollower = await logic.addFollower(follower);
        response.status(201).json(addedFollower);
    } 
    catch(err: any) {
        next(err);
    }
});

// GET api/followers/stats
router.get("/stats", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const stats = await logic.getStats();
        response.json(stats);
    } catch (err: any) {
        next(err);
    }
});


export default router;