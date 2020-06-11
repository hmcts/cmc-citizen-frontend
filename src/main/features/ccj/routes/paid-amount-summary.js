"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paid_amount_summary_1 = require("shared/components/ccj/paid-amount-summary");
const CCJHelper = require("main/common/helpers/ccjHelper");
const paths_1 = require("features/ccj/paths");
const model_accessor_1 = require("shared/components/model-accessor");
const paidAmount_1 = require("ccj/form/models/paidAmount");
const paymentOption_1 = require("claims/models/paymentOption");
const draftService_1 = require("services/draftService");
const ccjModelConverter_1 = require("claims/ccjModelConverter");
class PaidAmountSummaryPage extends paid_amount_summary_1.AbstractPaidAmountSummaryPage {
    paidAmount() {
        return new model_accessor_1.DefaultModelAccessor('paidAmount', () => new paidAmount_1.PaidAmount());
    }
    buildRedirectUri(req, res) {
        const { externalId } = req.params;
        const claim = res.locals.claim;
        const response = claim.response;
        if (response) {
            const paymentOption = ccjModelConverter_1.retrievePaymentOptionsFromClaim(claim);
            if ((paymentOption && paymentOption.option.value === paymentOption_1.PaymentOption.INSTALMENTS) ||
                (claim.isSettlementAgreementRejected && claim.isSettlementPaymentDateValid())) {
                return paths_1.Paths.checkAndSendPage.evaluateUri({ externalId: externalId });
            }
            else {
                return paths_1.Paths.paymentOptionsPage.evaluateUri({ externalId: externalId });
            }
        }
        else {
            return paths_1.Paths.paymentOptionsPage.evaluateUri({ externalId: externalId });
        }
    }
    claimFeeInPennies(claim) {
        return CCJHelper.claimFeeInPennies(claim);
    }
    amountSettledFor(claim) {
        return CCJHelper.amountSettledFor(claim);
    }
    async saveDraft(locals) {
        const user = locals.user;
        await new draftService_1.DraftService().save(locals.draft, user.bearerToken);
    }
}
/* tslint:disable:no-default-export */
exports.default = new PaidAmountSummaryPage()
    .buildRouter(paths_1.ccjPath);
