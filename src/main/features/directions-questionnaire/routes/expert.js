"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("directions-questionnaire/paths");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const expertRequired_1 = require("directions-questionnaire/forms/models/expertRequired");
const yesNoOption_1 = require("models/yesNoOption");
const expertReports_1 = require("directions-questionnaire/forms/models/expertReports");
const permissionForExpert_1 = require("directions-questionnaire/forms/models/permissionForExpert");
const expertEvidence_1 = require("directions-questionnaire/forms/models/expertEvidence");
const whyExpertIsNeeded_1 = require("directions-questionnaire/forms/models/whyExpertIsNeeded");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.expertPage.uri, (req, res) => res.render(paths_1.Paths.expertPage.associatedView))
    .post(paths_1.Paths.expertPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const draft = res.locals.draft;
    const user = res.locals.user;
    const expertRequired = !!req.body.expertYes;
    if (!expertRequired && draft.document.expertRequired && draft.document.expertRequired.option && draft.document.expertRequired.option.option === yesNoOption_1.YesNoOption.YES.option) {
        draft.document.expertReports = new expertReports_1.ExpertReports();
        draft.document.permissionForExpert = new permissionForExpert_1.PermissionForExpert();
        draft.document.expertEvidence = new expertEvidence_1.ExpertEvidence();
        draft.document.whyExpertIsNeeded = new whyExpertIsNeeded_1.WhyExpertIsNeeded();
    }
    draft.document.expertRequired = new expertRequired_1.ExpertRequired(expertRequired ? yesNoOption_1.YesNoOption.YES : yesNoOption_1.YesNoOption.NO);
    await new draftService_1.DraftService().save(draft, user.bearerToken);
    const externalId = res.locals.claim.externalId;
    if (expertRequired) {
        if (draft.document.expertReports.declared !== undefined) {
            draft.document.expertReports = new expertReports_1.ExpertReports();
        }
        res.redirect(paths_1.Paths.expertReportsPage.evaluateUri({ externalId }));
    }
    else {
        res.redirect(paths_1.Paths.selfWitnessPage.evaluateUri({ externalId }));
    }
}));
