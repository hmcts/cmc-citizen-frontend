"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_base64_1 = require("js-base64");
class JwtUtils {
    static decodePayload(jwt) {
        try {
            const payload = jwt.substring(jwt.indexOf('.'), jwt.lastIndexOf('.'));
            return JSON.parse(js_base64_1.Base64.decode(payload));
        }
        catch (err) {
            throw new Error(`Unable to parse JWT token: ${jwt}`);
        }
    }
}
exports.JwtUtils = JwtUtils;
