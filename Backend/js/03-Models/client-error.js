"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientError = /** @class */ (function () {
    function ClientError(status, message) {
        this.status = status;
        this.message = message;
    }
    return ClientError;
}());
exports.default = ClientError;
