"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("mediation/paths");
const paths_2 = require("response/paths");
const paths_3 = require("claimant-response/paths");
const errorHandling_1 = require("main/common/errorHandling");
const formValidator_1 = require("main/app/forms/validation/formValidator");
const form_1 = require("main/app/forms/form");
const draftService_1 = require("services/draftService");
const freeMediation_1 = require("main/app/forms/models/freeMediation");
function renderView(form, res) {
    const user = res.locals.user;
    const claim = res.locals.claim;
    const hint = user.id === claim.defendantId ? 'We’ll ask the claimant if they’ll try free mediation. If they say no, the claim will go to a hearing.' : '';
    res.render(paths_1.Paths.mediationDisagreementPage.associatedView, {
        form: form,
        defendant: user.id === claim.defendantId,
        hint: hint
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.mediationDisagreementPage.uri, async (req, res, next) => {
    const draft = res.locals.mediationDraft;
    renderView(new form_1.Form(draft.document.mediationDisagreement), res);
})
    .post(paths_1.Paths.mediationDisagreementPage.uri, formValidator_1.FormValidator.requestHandler(freeMediation_1.FreeMediation), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.mediationDraft;
        const user = res.locals.user;
        draft.document.mediationDisagreement = form.model;
        if (form.model.option === freeMediation_1.FreeMediationOption.NO) {
            draft.document.youCanOnlyUseMediation = undefined;
            draft.document.canWeUse = undefined;
            draft.document.canWeUseCompany = undefined;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        const externalId = req.params.externalId;
        if (form.model.option === freeMediation_1.FreeMediationOption.YES) {
            res.redirect(paths_1.Paths.mediationAgreementPage.evaluateUri({ externalId: externalId }));
        }
        else {
            const claim = res.locals.claim;
            if (!claim.isResponseSubmitted()) {
                res.redirect(paths_2.Paths.taskListPage.evaluateUri({ externalId: externalId }));
            }
            else {
                res.redirect(paths_3.Paths.taskListPage.evaluateUri({ externalId: externalId }));
            }
        }
    }
}));
