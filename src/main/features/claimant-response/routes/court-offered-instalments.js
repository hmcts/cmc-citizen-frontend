"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claimant-response/paths");
const acceptCourtOffer_1 = require("claimant-response/form/models/acceptCourtOffer");
const form_1 = require("forms/form");
const errorHandling_1 = require("shared/errorHandling");
const formValidator_1 = require("forms/validation/formValidator");
const yesNoOption_1 = require("models/yesNoOption");
const draftService_1 = require("services/draftService");
function renderView(form, res) {
    const claim = res.locals.claim;
    const draft = res.locals.draft;
    res.render(paths_1.Paths.courtOfferedInstalmentsPage.associatedView, {
        form: form,
        claim: claim,
        courtOrderPaymentPlan: draft.document.courtDetermination.courtDecision.repaymentPlan
    });
}
async function saveAndRedirect(res, draft, url) {
    const user = res.locals.user;
    await new draftService_1.DraftService().save(draft, user.bearerToken);
    res.redirect(url);
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.courtOfferedInstalmentsPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const draft = res.locals.claimantResponseDraft;
    renderView(new form_1.Form(draft.document.acceptCourtOffer), res);
}))
    .post(paths_1.Paths.courtOfferedInstalmentsPage.uri, formValidator_1.FormValidator.requestHandler(acceptCourtOffer_1.AcceptCourtOffer, acceptCourtOffer_1.AcceptCourtOffer.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.claimantResponseDraft;
        draft.document.acceptCourtOffer = form.model;
        const { externalId } = req.params;
        if (form.model.accept.option === yesNoOption_1.YesNoOption.YES.option) {
            draft.document.settlementAgreement = undefined;
            draft.document.formaliseRepaymentPlan = undefined;
            draft.document.courtDetermination.rejectionReason = undefined;
            await saveAndRedirect(res, draft, paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
        }
        else {
            await saveAndRedirect(res, draft, paths_1.Paths.rejectionReasonPage.evaluateUri({ externalId: externalId }));
        }
    }
}));
