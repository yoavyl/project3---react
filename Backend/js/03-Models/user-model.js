"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var role_1 = __importDefault(require("./role"));
var UserModel = /** @class */ (function () {
    function UserModel(user) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.password = user.password;
        this.role = user.role;
    }
    UserModel.prototype.validatePost = function () {
        var _a;
        var result = UserModel.postValidationSchema.validate(this, { abortEarly: false });
        return (_a = result.error) === null || _a === void 0 ? void 0 : _a.message;
    };
    // validation Scheme
    UserModel.postValidationSchema = joi_1.default.object({
        id: joi_1.default.forbidden(),
        firstName: joi_1.default.string().required().min(2).max(20).regex(/^[A-Z]/),
        lastName: joi_1.default.string().required().min(2).max(20).regex(/^[A-Z]/),
        username: joi_1.default.string().required().min(8).max(20),
        // password regex already includes min and max # of characters
        password: joi_1.default.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
        role: (_a = joi_1.default.string()).valid.apply(_a, Object.values(role_1.default)).optional()
    });
    return UserModel;
}());
exports.default = UserModel;
