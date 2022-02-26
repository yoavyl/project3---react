"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
function hash(plainText) {
    if (!plainText)
        return null;
    // Hashing with salt:
    var salt = "YoavIsTheKing";
    return crypto_1.default.createHmac("sha512", salt).update(plainText).digest("hex"); // hex = hexadeciaml (0-9 & A-F)
}
exports.default = {
    hash: hash
};
