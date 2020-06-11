"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Paths_1 = require("shared/components/ccj/Paths");
const errorHandling_1 = require("main/common/errorHandling");
const interestUtils_1 = require("shared/interestUtils");
const momentFactory_1 = require("shared/momentFactory");
/* tslint:disable:no-default-export */
class AbstractPaidAmountSummaryPage {
    getView() {
        return 'components/ccj/paid-amount-summary';
    }
    buildRouter(path, ...guards) {
        return express.Router()
            .get(path + Paths_1.Paths.paidAmountSummaryPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
            const claim = res.locals.claim;
            const model = this.paidAmount().get(res.locals.draft.document);
            res.render(this.getView(), {
                claim: claim,
                alreadyPaid: model.amount || 0,
                interestDetails: await interestUtils_1.getInterestDetails(claim),
                nextPageUrl: this.buildRedirectUri(req, res),
                defaultJudgmentDate: momentFactory_1.MomentFactory.currentDate(),
                amountSettledFor: this.amountSettledFor(claim, res.locals.draft.document),
                claimFee: this.claimFeeInPennies(claim)
            });
        }));
    }
}
exports.AbstractPaidAmountSummaryPage = AbstractPaidAmountSummaryPage;
