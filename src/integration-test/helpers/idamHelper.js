"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const idamClient_1 = require("integration-test/helpers/clients/idamClient");
class IdamHelper extends codecept_helper {
    createCitizenUser() {
        return this.createRandomUser('citizen');
    }
    async createRandomUser(userRoleCode) {
        const email = this.generateRandomEmailAddress();
        await idamClient_1.IdamClient.createUser(email, userRoleCode);
        return email;
    }
    generateRandomEmailAddress() {
        return `civilmoneyclaims+automatedtest-${require('randomstring').generate(7)}@gmail.com`;
    }
}
// Node.js style export is required by CodeceptJS framework
module.exports = IdamHelper;
