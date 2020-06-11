"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimStoreClient_1 = require("integration-test/helpers/clients/claimStoreClient");
const idamClient_1 = require("integration-test/helpers/clients/idamClient");
const request_1 = require("./clients/base/request");
const test_data_1 = require("integration-test/data/test-data");
const baseURL = process.env.CLAIM_STORE_URL;
const userEmails = new test_data_1.UserEmails();
class ClaimStoreHelper extends codecept_helper {
    async waitForOpenClaim(referenceNumber) {
        const maxAttempts = 120; // 60 seconds
        let isClaimOpen = false;
        let attempts = 0;
        do {
            attempts++;
            isClaimOpen = await claimStoreClient_1.ClaimStoreClient.isOpen(referenceNumber);
            await this.sleep(500);
        } while (!isClaimOpen && attempts < maxAttempts);
        return isClaimOpen;
    }
    async createClaim(claimData, submitterEmail, linkDefendant = true, features = ['admissions', 'directionsQuestionnaire'], role) {
        const submitter = await this.prepareAuthenticatedUser(submitterEmail);
        const { referenceNumber } = await claimStoreClient_1.ClaimStoreClient.create(claimData, submitter, features);
        await this.waitForOpenClaim(referenceNumber);
        if (linkDefendant) {
            await this.linkDefendant(referenceNumber);
        }
        return referenceNumber;
    }
    async linkDefendant(referenceNumber) {
        let password = process.env.SMOKE_TEST_USER_PASSWORD;
        let defendant = userEmails.getDefendant();
        let uri = `${baseURL}/testing-support/claims/${referenceNumber}/defendant`;
        await request_1.request.put({
            uri: uri,
            body: {
                'username': defendant,
                'password': password
            },
            json: true
        }).promise();
    }
    async respondToClaim(referenceNumber, ownerEmail, responseData, defendantEmail) {
        const owner = await this.prepareAuthenticatedUser(ownerEmail);
        const claim = await claimStoreClient_1.ClaimStoreClient.retrieveByReferenceNumber(referenceNumber, owner);
        const defendant = await this.prepareAuthenticatedUser(defendantEmail);
        await claimStoreClient_1.ClaimStoreClient.respond(claim.externalId, responseData, defendant);
    }
    async prepareAuthenticatedUser(userEmail) {
        const jwt = await idamClient_1.IdamClient.authenticateUser(userEmail);
        const user = await idamClient_1.IdamClient.retrieveUser(jwt);
        return Object.assign(Object.assign({}, user), { bearerToken: jwt });
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
// Node.js style export is required by CodeceptJS framework
module.exports = ClaimStoreHelper;
