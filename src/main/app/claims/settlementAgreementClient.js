"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const request_1 = require("client/request");
exports.claimStoreApiUrl = `${config.get('claim-store.url')}/claims`;
class SettlementAgreementClient {
    rejectSettlementAgreement(externalId, user) {
        const options = {
            method: 'POST',
            uri: `${exports.claimStoreApiUrl}/${externalId}/settlement-agreement/reject`,
            body: '',
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        };
        return request_1.request(options).then(function (response) {
            return response;
        });
    }
    countersignSettlementAgreement(externalId, user) {
        const options = {
            method: 'POST',
            uri: `${exports.claimStoreApiUrl}/${externalId}/settlement-agreement/countersign`,
            body: '',
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        };
        return request_1.request(options).then(function (response) {
            return response;
        });
    }
}
exports.SettlementAgreementClient = SettlementAgreementClient;
