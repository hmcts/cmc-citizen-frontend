"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("dashboard/paths");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
const acceptationClaimantResponse_1 = require("claims/models/claimant-response/acceptationClaimantResponse");
const formaliseOption_1 = require("claims/models/claimant-response/formaliseOption");
const logger = nodejs_logging_1.Logger.getLogger('settlement-agreement/guards/settlementAgreementGuard');
class SettlementAgreementGuard {
    static async requestHandler(req, res, next) {
        const claim = res.locals.claim;
        const settlement = claim.settlement;
        const claimantResponse = claim.claimantResponse;
        if (!claimantResponse || claimantResponse.type !== claimantResponseType_1.ClaimantResponseType.ACCEPTATION
            || acceptationClaimantResponse_1.AcceptationClaimantResponse.deserialize(claimantResponse).formaliseOption !== formaliseOption_1.FormaliseOption.SETTLEMENT) {
            logger.warn(`Claim ${claim.claimNumber} no acceptance claimant response for claim`);
            res.redirect(paths_1.Paths.dashboardPage.uri);
        }
        else if (!settlement || settlement.isSettled() || settlement.isOfferRejected()) {
            logger.warn(`Claim ${claim.claimNumber} no suitable settlement agreement for claim`);
            res.redirect(paths_1.Paths.dashboardPage.uri);
        }
        else {
            next();
        }
    }
}
exports.SettlementAgreementGuard = SettlementAgreementGuard;
