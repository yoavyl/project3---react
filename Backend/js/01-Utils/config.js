"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Config = /** @class */ (function () {
    function Config() {
        this.mySql = { host: "", user: "", password: "", database: "" };
    }
    return Config;
}());
var DevelopmentConfig = /** @class */ (function (_super) {
    __extends(DevelopmentConfig, _super);
    function DevelopmentConfig() {
        var _this = _super.call(this) || this;
        _this.port = 3001;
        _this.mySql = { host: "localhost", user: "root", password: "", database: "Observacation" };
        _this.loginExpiresIn = "7d"; // 7 days
        _this.imageFolder = "./src/Assets/Images/Vacations/";
        return _this;
    }
    return DevelopmentConfig;
}(Config));
var ProductionConfig = /** @class */ (function (_super) {
    __extends(ProductionConfig, _super);
    function ProductionConfig() {
        var _this = _super.call(this) || this;
        _this.port = +process.env.PORT;
        // connection parameters for heroku app are in a seperate file, which needs to be hidden
        _this.mySql = { host: process.env.HEROKU_HOST, user: process.env.HEROKU_USER, password: process.env.HEROKU_PASSWORD, database: process.env.HEROKU_DATABASE };
        _this.loginExpiresIn = "7d"; // 7 days
        _this.imageFolder = "./Assets/Images/Vacations/";
        return _this;
    }
    return ProductionConfig;
}(Config));
var config = process.env.ENVIRONMENT === "development" ? new DevelopmentConfig() : new ProductionConfig();
exports.default = config;
