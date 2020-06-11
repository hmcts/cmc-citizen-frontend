"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("features/directions-questionnaire/paths");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const multiRowFormUtils_1 = require("forms/utils/multiRowFormUtils");
const expertReports_1 = require("directions-questionnaire/forms/models/expertReports");
const yesNoOption_1 = require("models/yesNoOption");
const permissionForExpert_1 = require("directions-questionnaire/forms/models/permissionForExpert");
const expertEvidence_1 = require("directions-questionnaire/forms/models/expertEvidence");
const whyExpertIsNeeded_1 = require("directions-questionnaire/forms/models/whyExpertIsNeeded");
const page = paths_1.Paths.expertReportsPage;
function renderView(form, res) {
    multiRowFormUtils_1.makeSureThereIsAtLeastOneRow(form.model);
    res.render(page.associatedView, {
        form: form,
        reportNumber: form.model.rows.length
    });
}
function actionHandler(req, res, next) {
    if (req.body.action) {
        const form = req.body;
        if (req.body.action.addRow) {
            form.model.appendRow();
        }
        return renderView(form, res);
    }
    next();
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, async (req, res) => {
    const draft = res.locals.draft;
    renderView(new form_1.Form(draft.document.expertReports), res);
})
    .post(page.uri, formValidator_1.FormValidator.requestHandler(expertReports_1.ExpertReports, expertReports_1.ExpertReports.fromObject, undefined, ['addRow']), actionHandler, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const claim = res.locals.claim;
        const draft = res.locals.draft;
        const user = res.locals.user;
        form.model.removeExcessRows();
        if (form.model.declared.option === yesNoOption_1.YesNoOption.YES.option && draft.document.expertReports && draft.document.expertReports.declared && draft.document.expertReports.declared.option === yesNoOption_1.YesNoOption.NO.option) {
            draft.document.permissionForExpert = new permissionForExpert_1.PermissionForExpert();
            draft.document.expertEvidence = new expertEvidence_1.ExpertEvidence();
            draft.document.whyExpertIsNeeded = new whyExpertIsNeeded_1.WhyExpertIsNeeded();
        }
        draft.document.expertReports = form.model;
        if (draft.document.expertReports.declared === yesNoOption_1.YesNoOption.NO) {
            draft.document.expertReports.rows = [];
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if (form.model.declared.option === yesNoOption_1.YesNoOption.YES.option) {
            res.redirect(paths_1.Paths.selfWitnessPage.evaluateUri({ externalId: claim.externalId }));
        }
        else {
            res.redirect(paths_1.Paths.expertGuidancePage.evaluateUri({ externalId: claim.externalId }));
        }
    }
}));
