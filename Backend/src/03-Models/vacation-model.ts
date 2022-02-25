import { UploadedFile } from "express-fileupload";
import Joi from "joi"


class VacationModel {
    public id: number;
    public details: string;
    public destination: string;
    public price: number;
    public followers: number;
    public imageName: string;
    public fromDate: string;
    public toDate: string;
    public image: UploadedFile; // frontend uploads image to backend
    public isUserFollowing: boolean;


    public constructor(vacation: VacationModel) {
        this.id =vacation.id;
        this.details=vacation.details;
        this.destination=vacation.destination
        this.price=vacation.price;
        this.followers=vacation.followers;
        this.imageName=vacation.imageName;
        this.fromDate=vacation.fromDate;
        this.toDate=vacation.toDate;
        this.image=vacation.image;
        this.isUserFollowing=vacation.isUserFollowing;
    }

    private static postValidationSchema = Joi.object({
        id: Joi.forbidden(),
        details: Joi.string().required().min(2).max(100),
        destination: Joi.string().required().min(2).max(100),
        price: Joi.number().required().positive(),
        followers: Joi.forbidden(),
        imageName: Joi.forbidden(),
        fromDate: Joi.string().required(), 
        toDate: Joi.string().required(), 
        image: Joi.object().required(),
        isUserFollowing: Joi.forbidden()
    });

    private static putValidationSchema = Joi.object({
        id: Joi.number().required().positive().integer(),
        details: Joi.string().required().min(2).max(100),
        destination: Joi.string().required().min(2).max(100),
        price: Joi.number().required().positive(),
        followers: Joi.forbidden(),
        imageName: Joi.forbidden(),
        fromDate: Joi.string().required(), 
        toDate: Joi.string().required(), 
        image: Joi.object().optional(),
        isUserFollowing: Joi.forbidden()
    });


    public validatePost() {
        const result = VacationModel.postValidationSchema.validate(this,{abortEarly:false});
        return result.error?.message;            
    };

    public validatePut() {
        const result = VacationModel.putValidationSchema.validate(this,{abortEarly:false});
        return result.error?.message;            
    };
}

export default VacationModel;