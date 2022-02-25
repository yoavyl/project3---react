import Joi from "joi";

class CredentialsModel {
    public username: string;
    public password: string;

    constructor(credentials: CredentialsModel) {
        this.username = credentials.username;
        this.password = credentials.password;
    }

    private static postValidationSchema = Joi.object({
        username: Joi.string().required().min(8).max(20),
        // password regex already includes min and max # of characters
        password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    });

    public validatePost() {
        const result = CredentialsModel.postValidationSchema.validate(this,{abortEarly:false});
        return result.error?.message;            
    }
}

export default CredentialsModel;