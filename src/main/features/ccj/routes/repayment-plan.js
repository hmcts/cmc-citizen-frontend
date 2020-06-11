"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("ccj/paths");
const errorHandling_1 = require("shared/errorHandling");
const form_1 = require("forms/form");
const draftService_1 = require("services/draftService");
const repaymentPlan_1 = require("ccj/form/models/repaymentPlan");
const formValidator_1 = require("forms/validation/formValidator");
const paydateHelper_1 = require("claimant-response/helpers/paydateHelper");
class RepaymentPlanPage {
    getHeading() {
        return 'Your repayment plan';
    }
    buildPostSubmissionUri(req, res) {
        const { externalId } = req.params;
        return paths_1.Paths.checkAndSendPage.evaluateUri({ externalId: externalId });
    }
    postValidation(req, res) {
        const model = req.body.model;
        if (model.firstPaymentDate) {
            const validDate = paydateHelper_1.getEarliestPaymentDateForPaymentPlan(res.locals.claim, model.firstPaymentDate.toMoment());
            if (validDate && validDate > model.firstPaymentDate.toMoment()) {
                const error = {
                    target: model,
                    property: 'firstPaymentDate',
                    value: model.firstPaymentDate.toMoment(),
                    constraints: { 'Failed': 'Enter a date of  ' + validDate.format('DD MM YYYY') + ' or later for the first instalment' },
                    children: undefined
                };
                return new form_1.FormValidationError(error);
            }
        }
        return undefined;
    }
    getView() {
        return paths_1.Paths.repaymentPlanPage.associatedView;
    }
    async saveDraft(locals) {
        const user = locals.user;
        await new draftService_1.DraftService().save(locals.draft, user.bearerToken);
    }
    buildRouter() {
        return express.Router()
            .get(paths_1.Paths.repaymentPlanPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
            const draft = res.locals.ccjDraft;
            this.renderView(new form_1.Form(draft.document.repaymentPlan), res);
        }))
            .post(paths_1.Paths.repaymentPlanPage.uri, formValidator_1.FormValidator.requestHandler(repaymentPlan_1.RepaymentPlan, repaymentPlan_1.RepaymentPlan.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
            let form = req.body;
            const error = this.postValidation(req, res);
            if (error) {
                form = new form_1.Form(form.model, [error, ...form.errors]);
            }
            if (form.hasErrors()) {
                this.renderView(form, res);
            }
            else {
                res.locals.draft.document.repaymentPlan = form.model;
                res.locals.draft.document.payBySetDate = undefined;
                await this.saveDraft(res.locals);
                res.redirect(this.buildPostSubmissionUri(req, res));
            }
        }));
    }
    renderView(form, res) {
        const claim = res.locals.claim;
        const draft = res.locals.ccjDraft;
        const alreadyPaid = draft.document.paidAmount.amount || 0;
        res.render(this.getView(), {
            heading: this.getHeading(),
            form: form,
            remainingAmount: claim.totalAmountTillToday - alreadyPaid
        });
    }
}
/* tslint:disable:no-default-export */
exports.default = new RepaymentPlanPage()
    .buildRouter();
