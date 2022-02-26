"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
var FollowerModel = /** @class */ (function () {
    function FollowerModel(follower) {
        this.userId = follower.userId;
        this.vacationId = follower.vacationId;
    }
    FollowerModel.prototype.validatePost = function () {
        var _a;
        var result = FollowerModel.postValidationSchema.validate(this, { abortEarly: false });
        return (_a = result.error) === null || _a === void 0 ? void 0 : _a.message;
    };
    ;
    FollowerModel.postValidationSchema = joi_1.default.object({
        userId: joi_1.default.number().required().integer(),
        vacationId: joi_1.default.number().required().integer()
    });
    return FollowerModel;
}());
exports.default = FollowerModel;
