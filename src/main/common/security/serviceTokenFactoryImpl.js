"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idamClient_1 = require("idam/idamClient");
let token;
class ServiceAuthTokenFactoryImpl {
    async get() {
        if (token === undefined || token.hasExpired()) {
            token = await idamClient_1.IdamClient.retrieveServiceToken();
        }
        return token;
    }
}
exports.ServiceAuthTokenFactoryImpl = ServiceAuthTokenFactoryImpl;
