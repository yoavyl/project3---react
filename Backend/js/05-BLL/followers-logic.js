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
var client_error_1 = __importDefault(require("../03-Models/client-error"));
var dal_1 = __importDefault(require("../04-DAL/dal"));
function addFollower(follower) {
    return __awaiter(this, void 0, void 0, function () {
        var errors, sqlCheckFollowerTable, followers, sqlFollowersTable, result, sqlVacationsTable, info;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = follower.validatePost();
                    if (errors) {
                        throw new client_error_1.default(400, errors);
                    }
                    sqlCheckFollowerTable = "SELECT * FROM Followers \n                                WHERE userId=".concat(follower.userId, " \n                                AND vacationId=").concat(follower.vacationId);
                    return [4 /*yield*/, dal_1.default.execute(sqlCheckFollowerTable)];
                case 1:
                    followers = _a.sent();
                    if (followers.length > 0)
                        throw new client_error_1.default(406, "user already follows this vacation");
                    sqlFollowersTable = "INSERT INTO followers \n                            VALUES (".concat(follower.userId, ", ").concat(follower.vacationId, ")");
                    return [4 /*yield*/, dal_1.default.execute(sqlFollowersTable)];
                case 2:
                    result = _a.sent();
                    sqlVacationsTable = "UPDATE Vacations \n                            SET followers = followers + 1 \n                            WHERE id = ".concat(follower.vacationId);
                    return [4 /*yield*/, dal_1.default.execute(sqlVacationsTable)];
                case 3:
                    info = _a.sent();
                    return [2 /*return*/, follower];
            }
        });
    });
}
function removeFollower(follower) {
    return __awaiter(this, void 0, void 0, function () {
        var errors, sqlCheckFollowerTable, followers, sqlFollowerTable, results, sqlVacationsTable, info;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = follower.validatePost();
                    if (errors) {
                        throw new client_error_1.default(400, errors);
                    }
                    sqlCheckFollowerTable = "SELECT * FROM Followers \n                                WHERE userId=".concat(follower.userId, " \n                                AND vacationId=").concat(follower.vacationId);
                    return [4 /*yield*/, dal_1.default.execute(sqlCheckFollowerTable)];
                case 1:
                    followers = _a.sent();
                    if (followers.length === 0)
                        throw new client_error_1.default(404, "user already not follows this vacation");
                    sqlFollowerTable = "DELETE FROM Followers \n                            WHERE vacationId=".concat(follower.vacationId, " \n                            AND userId=").concat(follower.userId);
                    return [4 /*yield*/, dal_1.default.execute(sqlFollowerTable)];
                case 2:
                    results = _a.sent();
                    sqlVacationsTable = "UPDATE Vacations \n                            SET followers = followers - 1 \n                            WHERE id = ".concat(follower.vacationId);
                    return [4 /*yield*/, dal_1.default.execute(sqlVacationsTable)];
                case 3:
                    info = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getStats() {
    return __awaiter(this, void 0, void 0, function () {
        var sql, vacations;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sql = "SELECT COUNT(userId) AS followers, destination\n                FROM Followers JOIN Vacations \n                ON Followers.vacationId = Vacations.id \n                GROUP BY vacationId\n                ORDER BY followers DESC, destination ASC";
                    return [4 /*yield*/, dal_1.default.execute(sql)];
                case 1:
                    vacations = _a.sent();
                    return [2 /*return*/, vacations];
            }
        });
    });
}
exports.default = {
    addFollower: addFollower,
    removeFollower: removeFollower,
    getStats: getStats
};
