"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("client/request");
const claimStoreClient_1 = require("claims/claimStoreClient");
class CCJClient {
    static async request(externalId, countyCourtJudgment, user) {
        return request_1.request.post(`${claimStoreClient_1.claimStoreApiUrl}/${externalId}/county-court-judgment`, {
            body: countyCourtJudgment,
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        });
    }
    static async redetermination(externalId, reDetermination, user, madeBy) {
        return request_1.request.post(`${claimStoreClient_1.claimStoreApiUrl}/${externalId}/re-determination`, {
            body: { explanation: reDetermination.text, partyType: madeBy.value },
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        });
    }
}
exports.CCJClient = CCJClient;
