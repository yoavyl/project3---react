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
var dal_1 = __importDefault(require("../04-DAL/dal"));
var jwt_1 = __importDefault(require("../01-Utils/jwt"));
var role_1 = __importDefault(require("../03-Models/role"));
var client_error_1 = __importDefault(require("../03-Models/client-error"));
var crypto_1 = __importDefault(require("../01-Utils/crypto"));
// check if (how many times) username exists in DB
function checkUsername(username) {
    return __awaiter(this, void 0, void 0, function () {
        var sql, usernameCountArray, usernameCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sql = "SELECT COUNT(username) AS count FROM Users WHERE username = '".concat(username, "'");
                    return [4 /*yield*/, dal_1.default.execute(sql)];
                case 1:
                    usernameCountArray = _a.sent();
                    usernameCount = usernameCountArray[0];
                    return [2 /*return*/, usernameCount];
            }
        });
    });
}
function register(user) {
    return __awaiter(this, void 0, void 0, function () {
        var errors, usernameCount, sql, result, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = user.validatePost();
                    if (errors) {
                        throw new client_error_1.default(400, errors);
                    }
                    return [4 /*yield*/, checkUsername(user.username)];
                case 1:
                    usernameCount = _a.sent();
                    if (usernameCount.count > 0)
                        throw new client_error_1.default(403, "username is not avilable. choose another one"); // or 409?
                    // hash password befora saving in DB
                    user.password = crypto_1.default.hash(user.password);
                    //set default role as user
                    user.role = role_1.default.User;
                    sql = "INSERT INTO Users(firstName, lastName, username, password, role) \n                VALUES ('".concat(user.firstName, "', '").concat(user.lastName, "', '").concat(user.username, "', \n                '").concat(user.password, "', '").concat(user.role, "')");
                    return [4 /*yield*/, dal_1.default.execute(sql)];
                case 2:
                    result = _a.sent();
                    user.id = result.insertId;
                    // remove password
                    delete user.password;
                    token = jwt_1.default.getNewToken(user);
                    return [2 /*return*/, token];
            }
        });
    });
}
function login(credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var errors, sqlToCheck, users, user, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = credentials.validatePost();
                    if (errors) {
                        throw new client_error_1.default(400, errors);
                    }
                    sqlToCheck = "SELECT * FROM Users";
                    return [4 /*yield*/, dal_1.default.execute(sqlToCheck)];
                case 1:
                    users = _a.sent();
                    // hash login password before searching in DB users
                    credentials.password = crypto_1.default.hash(credentials.password);
                    user = users.find(function (u) { return u.username === credentials.username && u.password === credentials.password; });
                    if (!user)
                        throw new client_error_1.default(401, "Incorrect username or password");
                    // remove password
                    delete user.password;
                    token = jwt_1.default.getNewToken(user);
                    return [2 /*return*/, token];
            }
        });
    });
}
exports.default = {
    register: register,
    login: login,
    checkUsername: checkUsername
};
