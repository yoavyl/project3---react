"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
function safeDelete(absolutePath) {
    try {
        // if undefined / null - do nothing
        if (!absolutePath)
            return;
        // only if file exists - try to delete it
        if (fs_1.default.existsSync(absolutePath)) {
            fs_1.default.unlinkSync(absolutePath); // delete file
        }
    }
    catch (err) { // do nothing on fail.
        console.error(err); // or log file  // console.error -> like console log but styled as error
    }
}
exports.default = safeDelete;
