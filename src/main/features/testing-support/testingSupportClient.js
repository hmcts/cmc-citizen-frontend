"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimStoreClient_1 = require("claims/claimStoreClient");
const request_1 = require("client/request");
const featureToggles_1 = require("utils/featureToggles");
const testingSupportUrl = `${claimStoreClient_1.claimApiBaseUrl}/testing-support/claims`;
class TestingSupportClient {
    static updateResponseDeadline(updateRequest, user) {
        if (featureToggles_1.FeatureToggles.isEnabled('testingSupport')) {
            return request_1.request.put(`${testingSupportUrl}/${updateRequest.claimNumber}/response-deadline/${updateRequest.date.asString()}`, {
                headers: {
                    Authorization: `Bearer ${user.bearerToken}`
                }
            });
        }
        else {
            throw new Error('Testing support is not enabled');
        }
    }
}
exports.TestingSupportClient = TestingSupportClient;
