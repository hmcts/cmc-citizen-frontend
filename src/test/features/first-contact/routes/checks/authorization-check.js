"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorization_check_1 = require("test/routes/authorization-check");
const paths_1 = require("first-contact/paths");
function checkAuthorizationGuards(app, method, pagePath) {
    authorization_check_1.checkAuthorizationGuards(app, method, pagePath, paths_1.Paths.startPage.uri);
}
exports.checkAuthorizationGuards = checkAuthorizationGuards;
