"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const offerModelConvertor_1 = require("claims/offerModelConvertor");
const config = require("config");
const request_1 = require("client/request");
exports.claimStoreApiUrl = `${config.get('claim-store.url')}/claims`;
class OfferClient {
    static makeOffer(externalId, user, offerForm) {
        const offer = offerModelConvertor_1.OfferModelConverter.convert(offerForm);
        const options = {
            method: 'POST',
            uri: `${exports.claimStoreApiUrl}/${externalId}/offers/defendant`,
            body: offer,
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        };
        return request_1.request(options).then(function (response) {
            return response;
        });
    }
    static acceptOffer(externalId, user) {
        const options = {
            method: 'POST',
            uri: `${exports.claimStoreApiUrl}/${externalId}/offers/claimant/accept`,
            body: '',
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        };
        return request_1.request(options).then(function (response) {
            return response;
        });
    }
    static rejectOffer(externalId, user) {
        const options = {
            method: 'POST',
            uri: `${exports.claimStoreApiUrl}/${externalId}/offers/claimant/reject`,
            body: '',
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        };
        return request_1.request(options).then(function (response) {
            return response;
        });
    }
    static countersignOffer(externalId, user) {
        const options = {
            method: 'POST',
            uri: `${exports.claimStoreApiUrl}/${externalId}/offers/defendant/countersign`,
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
exports.OfferClient = OfferClient;
