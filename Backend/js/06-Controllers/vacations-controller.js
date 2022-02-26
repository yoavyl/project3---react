"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var verify_admin_1 = __importDefault(require("../02-Middleware/verify-admin"));
var verify_token_1 = __importDefault(require("../02-Middleware/verify-token"));
var client_error_1 = __importDefault(require("../03-Models/client-error"));
var vacation_model_1 = __importDefault(require("../03-Models/vacation-model"));
var vacations_logic_1 = __importDefault(require("../05-BLL/vacations-logic"));
var router = express_1.default.Router();
// GET /api/vacations
router.get("/", verify_token_1.default, function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vacations, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, vacations_logic_1.default.getAllVacations()];
            case 1:
                vacations = _a.sent();
                response.json(vacations);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                next(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/vacations/vacations-per-user/:userid/
router.get("/vacations-per-user/:userId", verify_token_1.default, function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, vacationsPerUser, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = +request.params.userId;
                return [4 /*yield*/, vacations_logic_1.default.getAllVacationsPerUser(userId)];
            case 1:
                vacationsPerUser = _a.sent();
                response.json(vacationsPerUser);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                next(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put("/:id", verify_admin_1.default, function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, vacation, updatedVacation, err_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = +request.params.id;
                request.body.id = id;
                request.body.image = (_a = request.files) === null || _a === void 0 ? void 0 : _a.image;
                vacation = new vacation_model_1.default(request.body);
                return [4 /*yield*/, vacations_logic_1.default.updateVacation(vacation)];
            case 1:
                updatedVacation = _b.sent();
                response.json(updatedVacation);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _b.sent();
                next(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/vacations
// router.post("/", async (request: Request, response: Response, next: NextFunction) => {
router.post("/", verify_admin_1.default, function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vacation, addedVacation, err_4;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                // if admin didn't upload an image - throw an error
                if (!((_a = request.files) === null || _a === void 0 ? void 0 : _a.image))
                    throw new client_error_1.default(400, "Missing image.");
                request.body.image = (_b = request.files) === null || _b === void 0 ? void 0 : _b.image; // "image" -> the name in the model
                vacation = new vacation_model_1.default(request.body);
                return [4 /*yield*/, vacations_logic_1.default.addVacation(vacation)];
            case 1:
                addedVacation = _c.sent();
                response.status(201).json(addedVacation);
                return [3 /*break*/, 3];
            case 2:
                err_4 = _c.sent();
                next(err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// DELETE /api/vacations/7
router.delete("/:id", verify_admin_1.default, function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = +request.params.id;
                return [4 /*yield*/, vacations_logic_1.default.deleteVacation(id)];
            case 1:
                _a.sent();
                response.sendStatus(204);
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                next(err_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/images/:imageName", function (request, response, next) {
    try {
        var imageName = request.params.imageName;
        var absolutePath = path_1.default.join(__dirname, "..", "Assets", "Images", "Vacations", imageName);
        response.sendFile(absolutePath);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
