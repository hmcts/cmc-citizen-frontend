"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const _ = require("lodash");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const paymentPlan_1 = require("shared/components/payment-intention/model/paymentPlan");
const paths_1 = require("shared/components/payment-intention/paths");
const guardFactory_1 = require("response/guards/guardFactory");
const errorHandling_1 = require("shared/errorHandling");
const errors_1 = require("errors");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const draftService_1 = require("services/draftService");
const paymentPlanHelper_1 = require("shared/helpers/paymentPlanHelper");
class AbstractPaymentPlanPage {
    postValidation(req, res) { return undefined; }
    getView() {
        return 'components/payment-intention/payment-plan';
    }
    async saveDraft(locals) {
        const user = locals.user;
        await new draftService_1.DraftService().save(locals.draft, user.bearerToken);
    }
    buildRouter(path, ...guards) {
        const stateGuardRequestHandler = guardFactory_1.GuardFactory.create((res) => {
            const model = this.createModelAccessor().get(res.locals.draft.document);
            return model
                && model.paymentOption
                && model.paymentOption.isOfType(paymentOption_1.PaymentType.INSTALMENTS);
        }, (req, res) => {
            throw new errors_1.NotFoundError(req.path);
        });
        return express.Router()
            .get(path + paths_1.Paths.paymentPlanPage.uri, ...guards, stateGuardRequestHandler, errorHandling_1.ErrorHandling.apply(async (req, res) => {
            this.renderView(new form_1.Form(this.createModelAccessor().get(res.locals.draft.document).paymentPlan), res);
        }))
            .post(path + paths_1.Paths.paymentPlanPage.uri, ...guards, stateGuardRequestHandler, formValidator_1.FormValidator.requestHandler(paymentPlan_1.PaymentPlan, paymentPlan_1.PaymentPlan.fromObject, undefined, ['calculatePaymentPlan']), errorHandling_1.ErrorHandling.apply(async (req, res) => {
            let form = req.body;
            const error = this.postValidation(req, res);
            if (error) {
                form = new form_1.Form(form.model, [error, ...form.errors]);
            }
            if (form.hasErrors() || _.get(req, 'body.action.calculatePaymentPlan')) {
                this.renderView(form, res);
            }
            else {
                this.createModelAccessor().patch(res.locals.draft.document, model => model.paymentPlan = form.model);
                await this.saveDraft(res.locals);
                res.redirect(this.buildPostSubmissionUri(req, res));
            }
        }));
    }
    renderView(form, res) {
        const claim = res.locals.claim;
        const draft = res.locals.responseDraft;
        const paymentPlan = paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromForm(form.model);
        const paymentLength = paymentPlan ? paymentPlan.calculatePaymentLength() : undefined;
        let amount = claim.totalAmountTillToday;
        let partAdmit = false;
        if (draft && draft.document && draft.document.partialAdmission) {
            amount = draft.document.partialAdmission.howMuchDoYouOwe.amount;
            partAdmit = true;
        }
        res.render(this.getView(), {
            heading: this.getHeading(),
            form,
            partAdmit: partAdmit,
            totalAmount: amount,
            paymentLength,
            disposableIncome: res.locals.draft.document.courtDetermination ? res.locals.draft.document.courtDetermination.disposableIncome : undefined
        });
    }
}
exports.AbstractPaymentPlanPage = AbstractPaymentPlanPage;
