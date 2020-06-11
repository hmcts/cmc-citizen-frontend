"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
class JwtExtractor {
    static extract(req) {
        return req.cookies[config.get('session.cookieName')];
    }
}
exports.JwtExtractor = JwtExtractor;
