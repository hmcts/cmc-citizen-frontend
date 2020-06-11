"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const paths_1 = require("shared/components/payment-intention/paths");
const errorHandling_1 = require("main/common/errorHandling");
const routablePath_1 = require("shared/router/routablePath");
const form_1 = require("main/app/forms/form");
const formValidator_1 = require("main/app/forms/validation/formValidator");
const draftService_1 = require("services/draftService");
class AbstractPaymentOptionPage {
    getView() {
        return 'components/payment-intention/payment-option';
    }
    async saveDraft(locals) {
        const user = locals.user;
        await new draftService_1.DraftService().save(locals.draft, user.bearerToken);
    }
    buildPostSubmissionUri(path, req, res) {
        const model = req.body.model;
        const { externalId } = req.params;
        switch (model.option) {
            case paymentOption_1.PaymentType.IMMEDIATELY:
                return this.buildTaskListUri(req, res);
            case paymentOption_1.PaymentType.BY_SET_DATE:
                return new routablePath_1.RoutablePath(path + paths_1.Paths.paymentDatePage.uri).evaluateUri({ externalId: externalId });
            case paymentOption_1.PaymentType.INSTALMENTS:
                return new routablePath_1.RoutablePath(path + paths_1.Paths.paymentPlanPage.uri).evaluateUri({ externalId: externalId });
        }
    }
    buildRouter(path, ...guards) {
        return express.Router()
            .get(path + paths_1.Paths.paymentOptionPage.uri, ...guards, (req, res) => {
            this.renderView(new form_1.Form(this.createModelAccessor().get(res.locals.draft.document).paymentOption), res);
        })
            .post(path + paths_1.Paths.paymentOptionPage.uri, ...guards, formValidator_1.FormValidator.requestHandler(paymentOption_1.PaymentOption, paymentOption_1.PaymentOption.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
            const form = req.body;
            if (form.hasErrors()) {
                this.renderView(form, res);
            }
            else {
                this.createModelAccessor().patch(res.locals.draft.document, model => model.paymentOption = form.model);
                this.deleteRedundantData(res, req);
                await this.saveDraft(res.locals);
                res.redirect(this.buildPostSubmissionUri(path, req, res));
            }
        }));
    }
    deleteRedundantData(res, req) {
        if (res.locals.draft.alternatePaymentMethod) {
            switch (req.body.model.option) {
                case paymentOption_1.PaymentType.IMMEDIATELY:
                    res.locals.draft.alternatePaymentMethod.paymentPlan = res.locals.draft.alternatePaymentMethod.paymentDate = undefined;
                    break;
                case paymentOption_1.PaymentType.BY_SET_DATE:
                    res.locals.draft.alternatePaymentMethod.paymentPlan = undefined;
                    break;
                case paymentOption_1.PaymentType.INSTALMENTS:
                    res.locals.draft.alternatePaymentMethod.paymentDate = undefined;
                    break;
            }
        }
    }
    renderView(form, res) {
        res.render(this.getView(), {
            form: form
        });
    }
}
exports.AbstractPaymentOptionPage = AbstractPaymentOptionPage;
