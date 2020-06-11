"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const request_1 = require("client/request");
const stringUtils_1 = require("utils/stringUtils");
const claimStoreBaseUrl = config.get('claim-store.url');
class DocumentsClient {
    constructor(documentsUrl = `${claimStoreBaseUrl}/documents`) {
        this.documentsUrl = documentsUrl;
    }
    getSealedClaimPDF(claimExternalId, bearerToken) {
        return this.getPDF(claimExternalId, 'sealedClaim', bearerToken);
    }
    getClaimIssueReceiptPDF(claimExternalId, bearerToken) {
        return this.getPDF(claimExternalId, 'claimIssueReceipt', bearerToken);
    }
    getDefendantResponseReceiptPDF(claimExternalId, bearerToken) {
        return this.getPDF(claimExternalId, 'defendantResponseReceipt', bearerToken);
    }
    getClaimantHearingRequirementPDF(claimExternalId, bearerToken) {
        return this.getPDF(claimExternalId, 'claimantHearingRequirement', bearerToken);
    }
    getSettlementAgreementPDF(claimExternalId, bearerToken) {
        return this.getPDF(claimExternalId, 'settlementAgreement', bearerToken);
    }
    getDirectionsOrder(claimExternalId, bearerToken) {
        return this.getPDF(claimExternalId, 'ORDER_DIRECTIONS', bearerToken);
    }
    getReviewOrderPdf(claimExternalId, bearerToken) {
        return this.getPDF(claimExternalId, 'REVIEW_ORDER', bearerToken);
    }
    getMediationAgreementPdf(claimExternalId, bearerToken) {
        return this.getPDF(claimExternalId, 'MEDIATION_AGREEMENT', bearerToken);
    }
    getPDF(claimExternalId, documentTemplate, bearerToken) {
        if (stringUtils_1.StringUtils.isBlank(claimExternalId)) {
            throw new Error('Claim external ID cannot be blank');
        }
        if (stringUtils_1.StringUtils.isBlank(documentTemplate)) {
            throw new Error('Document template cannot be blank');
        }
        if (stringUtils_1.StringUtils.isBlank(bearerToken)) {
            throw new Error('User authorisation cannot be blank');
        }
        const options = {
            uri: `${this.documentsUrl}/${documentTemplate}/${claimExternalId}`,
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                Accept: 'application/pdf'
            },
            encoding: null
        };
        return request_1.request(options).then(function (response) {
            return response;
        });
    }
}
exports.DocumentsClient = DocumentsClient;
