import crypto from "crypto";

function hash(plainText: string): string {

    if(!plainText) return null;

    // Hashing with salt:
    const salt = "YoavIsTheKing"
    return crypto.createHmac("sha512", salt).update(plainText).digest("hex"); // hex = hexadeciaml (0-9 & A-F)
}

export default {
    hash
};