"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var CredentialsModel = /** @class */ (function () {
    function CredentialsModel(credentials) {
        this.username = credentials.username;
        this.password = credentials.password;
    }
    CredentialsModel.prototype.validatePost = function () {
        var _a;
        var result = CredentialsModel.postValidationSchema.validate(this, { abortEarly: false });
        return (_a = result.error) === null || _a === void 0 ? void 0 : _a.message;
    };
    CredentialsModel.postValidationSchema = joi_1.default.object({
        username: joi_1.default.string().required().min(8).max(20),
        // password regex already includes min and max # of characters
        password: joi_1.default.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    });
    return CredentialsModel;
}());
exports.default = CredentialsModel;
