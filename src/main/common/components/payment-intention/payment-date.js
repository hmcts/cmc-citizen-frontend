"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const paymentDate_1 = require("shared/components/payment-intention/model/paymentDate");
const paths_1 = require("shared/components/payment-intention/paths");
const guardFactory_1 = require("response/guards/guardFactory");
const errorHandling_1 = require("shared/errorHandling");
const errors_1 = require("errors");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const draftService_1 = require("services/draftService");
class AbstractPaymentDatePage {
    getNotice() {
        return undefined;
    }
    getView() {
        return 'components/payment-intention/payment-date';
    }
    async saveDraft(locals) {
        const user = locals.user;
        await new draftService_1.DraftService().save(locals.draft, user.bearerToken);
    }
    buildRouter(path, ...guards) {
        const stateGuardRequestHandler = guardFactory_1.GuardFactory.create((res) => {
            const model = this.createModelAccessor().get(res.locals.draft.document);
            return model && model.paymentOption && model.paymentOption.isOfType(paymentOption_1.PaymentType.BY_SET_DATE);
        }, (req) => {
            throw new errors_1.NotFoundError(req.path);
        });
        return express.Router()
            .get(path + paths_1.Paths.paymentDatePage.uri, ...guards, stateGuardRequestHandler, (req, res) => {
            this.renderView(new form_1.Form(this.createModelAccessor().get(res.locals.draft.document).paymentDate), res);
        })
            .post(path + paths_1.Paths.paymentDatePage.uri, ...guards, stateGuardRequestHandler, formValidator_1.FormValidator.requestHandler(paymentDate_1.PaymentDate, paymentDate_1.PaymentDate.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
            const form = req.body;
            if (form.hasErrors()) {
                this.renderView(form, res);
            }
            else {
                this.createModelAccessor().patch(res.locals.draft.document, model => model.paymentDate = form.model);
                await this.saveDraft(res.locals);
                res.redirect(this.buildPostSubmissionUri(req, res));
            }
        }));
    }
    renderView(form, res) {
        const notice = this.getNotice();
        res.render(this.getView(), {
            heading: this.getHeading(),
            form: form,
            notice: notice ? notice : undefined,
            disposableIncome: res.locals.draft.document.courtDetermination ? res.locals.draft.document.courtDetermination.disposableIncome : undefined
        });
    }
}
exports.AbstractPaymentDatePage = AbstractPaymentDatePage;
