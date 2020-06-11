"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorization_check_1 = require("test/routes/authorization-check");
function checkAuthorizationGuards(app, method, pagePath) {
    authorization_check_1.checkAuthorizationGuards(app, method, pagePath);
}
exports.checkAuthorizationGuards = checkAuthorizationGuards;
