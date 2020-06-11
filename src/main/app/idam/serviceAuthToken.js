"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const jwtUtils_1 = require("shared/utils/jwtUtils");
class ServiceAuthToken {
    constructor(bearerToken) {
        this.bearerToken = bearerToken;
        this.bearerToken = bearerToken;
    }
    hasExpired() {
        const { exp } = jwtUtils_1.JwtUtils.decodePayload(this.bearerToken);
        return moment().unix() >= exp;
    }
}
exports.ServiceAuthToken = ServiceAuthToken;
