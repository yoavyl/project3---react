"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var VacationModel = /** @class */ (function () {
    function VacationModel(vacation) {
        this.id = vacation.id;
        this.details = vacation.details;
        this.destination = vacation.destination;
        this.price = vacation.price;
        this.followers = vacation.followers;
        this.imageName = vacation.imageName;
        this.fromDate = vacation.fromDate;
        this.toDate = vacation.toDate;
        this.image = vacation.image;
        this.isUserFollowing = vacation.isUserFollowing;
    }
    VacationModel.prototype.validatePost = function () {
        var _a;
        var result = VacationModel.postValidationSchema.validate(this, { abortEarly: false });
        return (_a = result.error) === null || _a === void 0 ? void 0 : _a.message;
    };
    ;
    VacationModel.prototype.validatePut = function () {
        var _a;
        var result = VacationModel.putValidationSchema.validate(this, { abortEarly: false });
        return (_a = result.error) === null || _a === void 0 ? void 0 : _a.message;
    };
    ;
    VacationModel.postValidationSchema = joi_1.default.object({
        id: joi_1.default.forbidden(),
        details: joi_1.default.string().required().min(2).max(100),
        destination: joi_1.default.string().required().min(2).max(100),
        price: joi_1.default.number().required().positive(),
        followers: joi_1.default.forbidden(),
        imageName: joi_1.default.forbidden(),
        fromDate: joi_1.default.string().required(),
        toDate: joi_1.default.string().required(),
        image: joi_1.default.object().required(),
        isUserFollowing: joi_1.default.forbidden()
    });
    VacationModel.putValidationSchema = joi_1.default.object({
        id: joi_1.default.number().required().positive().integer(),
        details: joi_1.default.string().required().min(2).max(100),
        destination: joi_1.default.string().required().min(2).max(100),
        price: joi_1.default.number().required().positive(),
        followers: joi_1.default.forbidden(),
        imageName: joi_1.default.forbidden(),
        fromDate: joi_1.default.string().required(),
        toDate: joi_1.default.string().required(),
        image: joi_1.default.object().optional(),
        isUserFollowing: joi_1.default.forbidden()
    });
    return VacationModel;
}());
exports.default = VacationModel;
