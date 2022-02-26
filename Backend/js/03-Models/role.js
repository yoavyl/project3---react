"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Role;
(function (Role) {
    // i made the enum this way since from my research, I get that the best way to avoid all the issues
    // related to enums in TypeScript comparison is to declare them the following way.
    // The reason is that when TypeScript is compiled to JavaScript enums are parsed as objects,
    // the result may be comparing string vs number which may end up in false results,
    // like I got (before doing it this way) when I added VerifyLogin in the backend 
    // or IsAdmin functions in frontend.
    Role["User"] = "User";
    Role["Admin"] = "Admin";
})(Role || (Role = {}));
exports.default = Role;
