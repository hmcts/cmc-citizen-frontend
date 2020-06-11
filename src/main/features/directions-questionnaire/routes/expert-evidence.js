"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-default-export */
const express = require("express");
const paths_1 = require("directions-questionnaire/paths");
const expertEvidence_1 = require("directions-questionnaire/forms/models/expertEvidence");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const yesNoOption_1 = require("models/yesNoOption");
const whyExpertIsNeeded_1 = require("directions-questionnaire/forms/models/whyExpertIsNeeded");
function renderPage(res, form) {
    res.render(paths_1.Paths.expertEvidencePage.associatedView, { form: form });
}
exports.default = express.Router()
    .get(paths_1.Paths.expertEvidencePage.uri, (req, res) => {
    const draft = res.locals.draft;
    renderPage(res, new form_1.Form(draft.document.expertEvidence));
})
    .post(paths_1.Paths.expertEvidencePage.uri, formValidator_1.FormValidator.requestHandler(expertEvidence_1.ExpertEvidence, expertEvidence_1.ExpertEvidence.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderPage(res, form);
    }
    else {
        const draft = res.locals.draft;
        const user = res.locals.user;
        if (form.model.expertEvidence.option === yesNoOption_1.YesNoOption.NO.option && draft.document.expertEvidence && draft.document.expertEvidence.expertEvidence && draft.document.expertEvidence.expertEvidence.option === yesNoOption_1.YesNoOption.YES.option) {
            draft.document.whyExpertIsNeeded = new whyExpertIsNeeded_1.WhyExpertIsNeeded();
        }
        draft.document.expertEvidence = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (form.model.expertEvidence.option === yesNoOption_1.YesNoOption.YES.option) {
            res.redirect(paths_1.Paths.whyExpertIsNeededPage.evaluateUri({ externalId: res.locals.claim.externalId }));
        }
        else {
            res.redirect(paths_1.Paths.selfWitnessPage.evaluateUri({ externalId: res.locals.claim.externalId }));
        }
    }
}));
