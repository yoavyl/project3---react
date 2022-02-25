import Joi from "joi";
import Role from "./role";

class UserModel {
    public id: number;
    public firstName: string;
    public lastName: string;
    public username: string;
    public password: string;
    public role: Role;

    constructor(user: UserModel) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.password = user.password;
        this.role = user.role;
    }

    // validation Scheme
    private static postValidationSchema = Joi.object({
        id: Joi.forbidden(),
        firstName: Joi.string().required().min(2).max(20).regex(/^[A-Z]/),
        lastName: Joi.string().required().min(2).max(20).regex(/^[A-Z]/),
        username: Joi.string().required().min(8).max(20),
        // password regex already includes min and max # of characters
        password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
        role: Joi.string().valid(...Object.values(Role)).optional()
    });

    public validatePost() {
        const result = UserModel.postValidationSchema.validate(this,{abortEarly:false});
        return result.error?.message;            
    }
}

export default UserModel;