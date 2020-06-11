"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("client/request");
const HttpStatus = require("http-status-codes");
const config = require("config");
const claim_1 = require("claims/models/claim");
const claimModelConverter_1 = require("claims/claimModelConverter");
const responseModelConverter_1 = require("claims/responseModelConverter");
const errors_1 = require("errors");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const claimantResponseConverter_1 = require("claims/converters/claimantResponseConverter");
const ordersConverter_1 = require("claims/ordersConverter");
exports.claimApiBaseUrl = `${config.get('claim-store.url')}`;
exports.claimStoreApiUrl = `${exports.claimApiBaseUrl}/claims`;
const claimStoreResponsesApiUrl = `${exports.claimApiBaseUrl}/responses/claim`;
const logger = nodejs_logging_1.Logger.getLogger('claims/claimStoreClient');
function buildCaseSubmissionHeaders(claimant, features) {
    const headers = {
        Authorization: `Bearer ${claimant.bearerToken}`
    };
    if (features.length > 0) {
        headers['Features'] = features;
    }
    return headers;
}
class ClaimStoreClient {
    constructor(request = request_1.request) {
        this.request = request;
        // Nothing to do
    }
    savePaidInFull(externalId, submitter, draft) {
        return this.request
            .put(`${exports.claimStoreApiUrl}/${externalId}/paid-in-full`, {
            body: {
                'moneyReceivedOn': draft.datePaid.date.toMoment()
            },
            headers: {
                Authorization: `Bearer ${submitter.bearerToken}`
            }
        })
            .then(claim => {
            return new claim_1.Claim().deserialize(claim);
        });
    }
    saveClaim(draft, claimant, ...features) {
        const convertedDraftClaim = claimModelConverter_1.ClaimModelConverter.convert(draft.document);
        return this.request
            .post(`${exports.claimStoreApiUrl}/${claimant.id}`, {
            body: convertedDraftClaim,
            headers: buildCaseSubmissionHeaders(claimant, features)
        })
            .then(claim => {
            return new claim_1.Claim().deserialize(claim);
        })
            .catch((err) => {
            if (err.statusCode === HttpStatus.CONFLICT) {
                logger.warn(`Claim ${draft.document.externalId} appears to have been saved successfully on initial timed out attempt, retrieving the saved instance`);
                return this.retrieveByExternalId(draft.document.externalId, claimant);
            }
            else {
                throw err;
            }
        });
    }
    createCitizenClaim(draft, claimant, ...features) {
        const convertedDraftClaim = claimModelConverter_1.ClaimModelConverter.convert(draft.document);
        return this.request
            .put(`${exports.claimStoreApiUrl}/create-citizen-claim`, {
            body: convertedDraftClaim,
            headers: buildCaseSubmissionHeaders(claimant, features)
        })
            .then(claim => {
            return new claim_1.Claim().deserialize(claim);
        })
            .catch((err) => {
            if (err.statusCode === HttpStatus.CONFLICT) {
                logger.warn(`Claim ${draft.document.externalId} appears to have been saved successfully on initial timed out attempt, retrieving the saved instance`);
                return this.retrieveByExternalId(draft.document.externalId, claimant);
            }
            else {
                throw err;
            }
        });
    }
    initiatePayment(draft, claimant) {
        const convertedDraftClaim = claimModelConverter_1.ClaimModelConverter.convert(draft.document);
        return this.request
            .post(`${exports.claimStoreApiUrl}/initiate-citizen-payment`, {
            body: convertedDraftClaim,
            headers: buildCaseSubmissionHeaders(claimant, [])
        })
            .then(response => {
            return response.nextUrl;
        });
    }
    resumePayment(draft, claimant) {
        const convertedDraftClaim = claimModelConverter_1.ClaimModelConverter.convert(draft.document);
        return this.request
            .put(`${exports.claimStoreApiUrl}/resume-citizen-payment`, {
            body: convertedDraftClaim,
            headers: buildCaseSubmissionHeaders(claimant, [])
        })
            .then(response => {
            return response.nextUrl;
        });
    }
    saveResponseForUser(claim, draft, mediationDraft, directionsQuestionnaireDraft, user) {
        const response = responseModelConverter_1.ResponseModelConverter.convert(draft.document, mediationDraft.document, directionsQuestionnaireDraft.document, claim);
        const externalId = claim.externalId;
        const options = {
            method: 'POST',
            uri: `${claimStoreResponsesApiUrl}/${externalId}/defendant/${user.id}`,
            body: response,
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        };
        return request_1.request(options).then(function () {
            return Promise.resolve();
        });
    }
    saveOrder(ordersDraft, claim, user) {
        const reviewOrder = ordersConverter_1.OrdersConverter.convert(ordersDraft, claim, user);
        const externalId = ordersDraft.externalId;
        const options = {
            method: 'PUT',
            uri: `${exports.claimStoreApiUrl}/${externalId}/review-order`,
            body: reviewOrder,
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        };
        return request_1.request(options)
            .then(claim => {
            return new claim_1.Claim().deserialize(claim);
        });
    }
    retrieveByClaimantId(user) {
        if (!user) {
            return Promise.reject(new Error('User is required'));
        }
        return this.request
            .get(`${exports.claimStoreApiUrl}/claimant/${user.id}`, {
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        })
            .then((claims) => {
            return claims.map((claim) => new claim_1.Claim().deserialize(claim));
        });
    }
    retrieveByLetterHolderId(letterHolderId, bearerToken) {
        if (!letterHolderId) {
            return Promise.reject(new Error('Letter holder id must be set'));
        }
        return this.request
            .get(`${exports.claimStoreApiUrl}/letter/${letterHolderId}`, {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        })
            .then(claim => {
            if (claim) {
                return new claim_1.Claim().deserialize(claim);
            }
            else {
                throw new Error('Call was successful, but received an empty claim instance');
            }
        });
    }
    retrieveByExternalId(externalId, user) {
        if (!externalId || !user) {
            return Promise.reject(new Error('External id must be set and user must be set'));
        }
        return this.request
            .get(`${exports.claimStoreApiUrl}/${externalId}`, {
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        })
            .then((json) => {
            const claim = new claim_1.Claim().deserialize(json);
            if (user.id !== claim.claimantId && user.id !== claim.defendantId) {
                throw new errors_1.ForbiddenError();
            }
            return claim;
        });
    }
    retrieveByDefendantId(user) {
        if (!user) {
            return Promise.reject('User is required');
        }
        return this.request
            .get(`${exports.claimStoreApiUrl}/defendant/${user.id}`, {
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        })
            .then((claims) => claims.map(claim => new claim_1.Claim().deserialize(claim)));
    }
    linkDefendant(user) {
        const options = {
            method: 'PUT',
            uri: `${exports.claimStoreApiUrl}/defendant/link`,
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        };
        return request_1.request(options).then(function () {
            return Promise.resolve();
        });
    }
    requestForMoreTime(externalId, user) {
        if (!externalId) {
            return Promise.reject(new Error('External ID is required'));
        }
        if (!user || !user.bearerToken) {
            return Promise.reject(new Error('Authorisation token required'));
        }
        const options = {
            method: 'POST',
            uri: `${exports.claimStoreApiUrl}/${externalId}/request-more-time`,
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        };
        return request_1.request(options).then(function (response) {
            return response;
        });
    }
    isClaimLinked(reference) {
        if (!reference) {
            return Promise.reject(new Error('Claim reference is required'));
        }
        return this.request
            .get(`${exports.claimStoreApiUrl}/${reference}/defendant-link-status`)
            .then(linkStatus => linkStatus.linked);
    }
    async retrieveUserRoles(user) {
        if (!user) {
            return Promise.reject(new Error('User must be set'));
        }
        return this.request
            .get(`${exports.claimApiBaseUrl}/user/roles`, {
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        });
    }
    // This is a tactical solution until SIDAM is able to add roles to user ID
    addRoleToUser(user, role) {
        if (!user) {
            return Promise.reject(new Error('User is required'));
        }
        if (!role) {
            return Promise.reject(new Error('role is required'));
        }
        const options = {
            method: 'POST',
            uri: `${exports.claimApiBaseUrl}/user/roles`,
            body: { role: role },
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        };
        return request_1.request(options).then(function () {
            return Promise.resolve();
        });
    }
    saveClaimantResponse(claim, draft, mediationDraft, user, directionsQuestionnaireDraft) {
        const isDefendantBusiness = claim.claimData.defendant.isBusiness();
        const response = claimantResponseConverter_1.ClaimantResponseConverter.convertToClaimantResponse(claim, draft.document, mediationDraft.document, isDefendantBusiness, directionsQuestionnaireDraft);
        const externalId = claim.externalId;
        const options = {
            method: 'POST',
            uri: `${exports.claimApiBaseUrl}/responses/${externalId}/claimant/${user.id}`,
            body: response,
            headers: {
                Authorization: `Bearer ${user.bearerToken}`
            }
        };
        return request_1.request(options).then(function () {
            return Promise.resolve();
        });
    }
}
exports.ClaimStoreClient = ClaimStoreClient;
