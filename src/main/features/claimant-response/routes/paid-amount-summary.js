"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paid_amount_summary_1 = require("shared/components/ccj/paid-amount-summary");
const model_accessor_1 = require("shared/components/model-accessor");
const paths_1 = require("features/claimant-response/paths");
const paidAmount_1 = require("ccj/form/models/paidAmount");
const amountHelper_1 = require("claimant-response/helpers/amountHelper");
class PaidAmountSummaryPage extends paid_amount_summary_1.AbstractPaidAmountSummaryPage {
    paidAmount() {
        return new model_accessor_1.DefaultModelAccessor('paidAmount', () => new paidAmount_1.PaidAmount());
    }
    buildRedirectUri(req, res) {
        const { externalId } = req.params;
        return paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId });
    }
    amountSettledFor(claim, draft) {
        return amountHelper_1.AmountHelper.calculateAmountSettledFor(claim, draft);
    }
    claimFeeInPennies(claim) {
        return claim.claimData.feeAmountInPennies;
    }
}
/* tslint:disable:no-default-export */
exports.default = new PaidAmountSummaryPage()
    .buildRouter(paths_1.claimantResponseCCJPath);
