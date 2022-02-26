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
var uuid_1 = require("uuid");
var config_1 = __importDefault(require("../01-Utils/config"));
var safe_delete_1 = __importDefault(require("../01-Utils/safe-delete"));
var client_error_1 = __importDefault(require("../03-Models/client-error"));
var dal_1 = __importDefault(require("../04-DAL/dal"));
var socket_logic_1 = __importDefault(require("./socket-logic"));
function getAllVacations() {
    return __awaiter(this, void 0, void 0, function () {
        var sql, vacations;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sql = "SELECT id, details, DATE_FORMAT(fromDate, \"%Y-%m-%d\") AS fromDate, \n                DATE_FORMAT(toDate, \"%Y-%m-%d\") AS toDate, destination, imageName, \n                followers, price from Vacations";
                    return [4 /*yield*/, dal_1.default.execute(sql)];
                case 1:
                    vacations = _a.sent();
                    vacations.map(function (v) { return v.isUserFollowing = false; });
                    return [2 /*return*/, vacations];
            }
        });
    });
}
function getAllVacationsPerUser(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var sql, vacationsPerUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sql = "SELECT Vacations.id, details, DATE_FORMAT(fromDate, \"%Y-%m-%d\") AS fromDate, \n                DATE_FORMAT(toDate, \"%Y-%m-%d\") AS toDate, destination, imageName, \n                followers, price\n                FROM Vacations JOIN Followers on Vacations.id = Followers.vacationId \n                WHERE userId = ".concat(userId);
                    return [4 /*yield*/, dal_1.default.execute(sql)];
                case 1:
                    vacationsPerUser = _a.sent();
                    vacationsPerUser.map(function (v) { return v.isUserFollowing = true; });
                    return [2 /*return*/, vacationsPerUser];
            }
        });
    });
}
function getOneVacation(id) {
    return __awaiter(this, void 0, void 0, function () {
        var sql, vacations, vacation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sql = "SELECT * FROM Vacations WHERE id = " + id;
                    return [4 /*yield*/, dal_1.default.execute(sql)];
                case 1:
                    vacations = _a.sent();
                    vacation = vacations[0];
                    return [2 /*return*/, vacation];
            }
        });
    });
}
function addVacation(vacation) {
    return __awaiter(this, void 0, void 0, function () {
        var errors, extension, sql, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = vacation.validatePost();
                    if (errors) {
                        throw new client_error_1.default(400, errors);
                    }
                    extension = vacation.image.name.substring(vacation.image.name.lastIndexOf("."));
                    // create uuid file name
                    vacation.imageName = (0, uuid_1.v4)() + extension;
                    sql = "INSERT INTO Vacations(destination, details, imageName, fromDate, toDate, price) \n                VALUES ('".concat(vacation.destination, "', '").concat(vacation.details, "', '").concat(vacation.imageName, "',\n                '").concat(vacation.fromDate, "', '").concat(vacation.toDate, "', ").concat(vacation.price, ")");
                    return [4 /*yield*/, dal_1.default.execute(sql)];
                case 1:
                    result = _a.sent();
                    vacation.id = result.insertId;
                    // save image to disk
                    return [4 /*yield*/, vacation.image.mv(config_1.default.imageFolder + vacation.imageName)];
                case 2:
                    // save image to disk
                    _a.sent();
                    delete vacation.image;
                    //socket.io
                    socket_logic_1.default.emitAddVacation(vacation);
                    return [2 /*return*/, vacation];
            }
        });
    });
}
function updateVacation(vacation) {
    return __awaiter(this, void 0, void 0, function () {
        var errors, dbVacation, prop, extension, sql, info;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = vacation.validatePut();
                    if (errors) {
                        throw new client_error_1.default(400, errors);
                    }
                    return [4 /*yield*/, getOneVacation(vacation.id)];
                case 1:
                    dbVacation = _a.sent();
                    for (prop in vacation) {
                        if (vacation[prop] === undefined) {
                            vacation[prop] = dbVacation[prop];
                        }
                    }
                    if (!(vacation.image !== undefined)) return [3 /*break*/, 3];
                    extension = vacation.image.name.substring(vacation.image.name.lastIndexOf("."));
                    // create uuid file name
                    vacation.imageName = (0, uuid_1.v4)() + extension;
                    return [4 /*yield*/, vacation.image.mv(config_1.default.imageFolder + vacation.imageName)];
                case 2:
                    _a.sent(); // u/l new image to disk
                    (0, safe_delete_1.default)(config_1.default.imageFolder + dbVacation.imageName); // delete the old image from disk
                    delete vacation.image;
                    _a.label = 3;
                case 3:
                    sql = "UPDATE Vacations SET\n                destination = '".concat(vacation.destination, "', \n                details = '").concat(vacation.details, "', \n                imageName ='").concat(vacation.imageName, "',\n                fromDate = '").concat(vacation.fromDate, "', \n                toDate = '").concat(vacation.toDate, "', \n                price = ").concat(vacation.price, "\n                WHERE id = ").concat(vacation.id);
                    return [4 /*yield*/, dal_1.default.execute(sql)];
                case 4:
                    info = _a.sent();
                    //socket.io
                    socket_logic_1.default.emitUpdateVacation(vacation);
                    return [2 /*return*/, vacation];
            }
        });
    });
}
function deleteVacation(id) {
    return __awaiter(this, void 0, void 0, function () {
        var dbVacation, sql, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getOneVacation(id)];
                case 1:
                    dbVacation = _a.sent();
                    sql = "DELETE FROM Vacations WHERE id = " + id;
                    return [4 /*yield*/, dal_1.default.execute(sql)];
                case 2:
                    results = _a.sent();
                    // delete the old image from DB
                    (0, safe_delete_1.default)(config_1.default.imageFolder + dbVacation.imageName);
                    //socket.io
                    socket_logic_1.default.emitDeleteVacation(id);
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = {
    getAllVacations: getAllVacations,
    getAllVacationsPerUser: getAllVacationsPerUser,
    addVacation: addVacation,
    updateVacation: updateVacation,
    deleteVacation: deleteVacation,
};
