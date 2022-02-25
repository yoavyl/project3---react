import express, { NextFunction, Request, Response } from "express";
import path from "path";
import verifyAdmin from "../02-Middleware/verify-admin";
import verifyToken from "../02-Middleware/verify-token";
import ClientError from "../03-Models/client-error";
import VacationModel from "../03-Models/vacation-model";
import logic from "../05-BLL/vacations-logic";


const router = express.Router();

// GET /api/vacations
router.get("/", verifyToken, async (request: Request, response: Response, next: NextFunction) => { 

    try {
        const vacations = await logic.getAllVacations();
        response.json(vacations);
    } catch (err: any) {
        next(err);
    }
});

// GET /api/vacations/vacations-per-user/:userid/
router.get("/vacations-per-user/:userId", verifyToken, async (request: Request, response: Response, next: NextFunction) => { 
    try {
        const userId = +request.params.userId;
        const vacationsPerUser = await logic.getAllVacationsPerUser(userId);
        response.json(vacationsPerUser);
    } catch (err: any) {
        next(err);
    }
});

router.put("/:id", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {

    try {
        const id = +request.params.id;
        request.body.id = id;
        request.body.image = request.files?.image; 
        const vacation = new VacationModel(request.body);
        const updatedVacation = await logic.updateVacation(vacation);
        response.json(updatedVacation);
    }
    catch(err: any) {
        next(err);
    }
});


// POST /api/vacations
// router.post("/", async (request: Request, response: Response, next: NextFunction) => {
router.post("/", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {

    try {
        // if admin didn't upload an image - throw an error
        if (!request.files?.image) throw new ClientError(400, "Missing image.");

        request.body.image = request.files?.image;  // "image" -> the name in the model
        const vacation = new VacationModel(request.body);        
        const addedVacation = await logic.addVacation(vacation); 
        response.status(201).json(addedVacation);
    } catch (err: any) {
        next(err);
    }
});

// DELETE /api/vacations/7
router.delete("/:id", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        await logic.deleteVacation(id);
        response.sendStatus(204);
    } catch (err: any) {
        next(err);
    }
});

router.get("/images/:imageName", (request: Request, response: Response, next: NextFunction) => {
    try {
        const imageName = request.params.imageName;
        const absolutePath = path.join(__dirname, "..", "Assets", "Images", "Vacations", imageName);
        response.sendFile(absolutePath);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;