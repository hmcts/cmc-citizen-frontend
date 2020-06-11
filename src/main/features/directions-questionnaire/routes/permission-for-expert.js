"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("features/directions-questionnaire/paths");
const errorHandling_1 = require("shared/errorHandling");
const form_1 = require("forms/form");
const draftService_1 = require("services/draftService");
const permissionForExpert_1 = require("directions-questionnaire/forms/models/permissionForExpert");
const yesNoOption_1 = require("models/yesNoOption");
const formValidator_1 = require("forms/validation/formValidator");
const expertEvidence_1 = require("directions-questionnaire/forms/models/expertEvidence");
const whyExpertIsNeeded_1 = require("directions-questionnaire/forms/models/whyExpertIsNeeded");
function renderPage(res, form) {
    res.render(paths_1.Paths.permissionForExpertPage.associatedView, { form: form });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.permissionForExpertPage.uri, (req, res) => {
    const draft = res.locals.draft;
    renderPage(res, new form_1.Form(draft.document.permissionForExpert));
})
    .post(paths_1.Paths.permissionForExpertPage.uri, formValidator_1.FormValidator.requestHandler(permissionForExpert_1.PermissionForExpert, permissionForExpert_1.PermissionForExpert.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        res.render(paths_1.Paths.permissionForExpertPage.associatedView, {
            form: form
        });
    }
    else {
        const claim = res.locals.claim;
        const draft = res.locals.draft;
        const user = res.locals.user;
        if (form.model.option.option === yesNoOption_1.YesNoOption.NO.option && draft.document.permissionForExpert && draft.document.permissionForExpert.option && draft.document.permissionForExpert.option.option === yesNoOption_1.YesNoOption.YES.option) {
            draft.document.expertEvidence = new expertEvidence_1.ExpertEvidence();
            draft.document.whyExpertIsNeeded = new whyExpertIsNeeded_1.WhyExpertIsNeeded();
        }
        draft.document.permissionForExpert = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (draft.document.permissionForExpert.option.option === yesNoOption_1.YesNoOption.YES.option) {
            res.redirect(paths_1.Paths.expertEvidencePage.evaluateUri({ externalId: claim.externalId }));
        }
        else {
            res.redirect(paths_1.Paths.selfWitnessPage.evaluateUri({ externalId: claim.externalId }));
        }
    }
}));
