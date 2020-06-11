"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paid_amount_1 = require("shared/components/ccj/paid-amount");
const model_accessor_1 = require("shared/components/model-accessor");
const paths_1 = require("features/claimant-response/paths");
const paidAmount_1 = require("ccj/form/models/paidAmount");
const amountHelper_1 = require("claimant-response/helpers/amountHelper");
class PaidAmountPage extends paid_amount_1.AbstractPaidAmountPage {
    paidAmount() {
        return new model_accessor_1.DefaultModelAccessor('paidAmount', () => new paidAmount_1.PaidAmount());
    }
    totalAmount(claim, draft) {
        return amountHelper_1.AmountHelper.calculateTotalAmount(claim, draft);
    }
}
/* tslint:disable:no-default-export */
exports.default = new PaidAmountPage()
    .buildRouter(paths_1.claimantResponseCCJPath);
