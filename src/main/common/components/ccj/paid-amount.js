"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const form_1 = require("main/app/forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const paidAmount_1 = require("main/features/ccj/form/models/paidAmount");
const Paths_1 = require("shared/components/ccj/Paths");
const draftService_1 = require("services/draftService");
const errorHandling_1 = require("main/common/errorHandling");
const routablePath_1 = require("shared/router/routablePath");
/* tslint:disable:no-default-export */
class AbstractPaidAmountPage {
    getView() {
        return 'components/ccj/paid-amount';
    }
    buildRouter(path, ...guards) {
        return express.Router()
            .get(path + Paths_1.Paths.paidAmountPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
            this.renderView(new form_1.Form(this.paidAmount().get(res.locals.draft.document)), res);
        }))
            .post(path + Paths_1.Paths.paidAmountPage.uri, formValidator_1.FormValidator.requestHandler(paidAmount_1.PaidAmount, paidAmount_1.PaidAmount.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
            const form = req.body;
            if (form.hasErrors()) {
                this.renderView(form, res);
            }
            else {
                this.paidAmount().set(res.locals.draft.document, form.model);
                const user = res.locals.user;
                await new draftService_1.DraftService().save(res.locals.draft, user.bearerToken);
                const { externalId } = req.params;
                res.redirect(new routablePath_1.RoutablePath(path + Paths_1.Paths.paidAmountSummaryPage.uri).evaluateUri({ externalId: externalId }));
            }
        }));
    }
    renderView(form, res) {
        const claim = res.locals.claim;
        res.render(this.getView(), {
            form: form,
            totalAmount: this.totalAmount(claim, res.locals.draft.document)
        });
    }
}
exports.AbstractPaidAmountPage = AbstractPaidAmountPage;
