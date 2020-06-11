"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const formValidator_1 = require("forms/validation/formValidator");
const form_1 = require("forms/form");
const response_1 = require("response/form/models/response");
const responseType_1 = require("response/form/models/responseType");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const responseDraft_1 = require("response/draft/responseDraft");
const featureToggles_1 = require("utils/featureToggles");
function renderView(form, res) {
    const claim = res.locals.claim;
    res.render(paths_1.Paths.responseTypePage.associatedView, {
        form: form,
        responseDeadline: claim.responseDeadline
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.responseTypePage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.response), res);
}))
    .post(paths_1.Paths.responseTypePage.uri, formValidator_1.FormValidator.requestHandler(response_1.Response, response_1.Response.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const { externalId } = req.params;
    const form = req.body;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const claim = res.locals.claim;
        const draft = res.locals.responseDraft;
        const mediationDraft = res.locals.mediationDraft;
        const user = res.locals.user;
        draft.document.response = form.model;
        if (draft.document.response.type === responseType_1.ResponseType.FULL_ADMISSION) {
            if (!draft.document.fullAdmission) {
                draft.document.fullAdmission = new responseDraft_1.FullAdmission();
            }
            delete draft.document.partialAdmission;
            delete draft.document.freeMediation;
            if (mediationDraft && mediationDraft.id) {
                await new draftService_1.DraftService().delete(mediationDraft.id, user.bearerToken);
            }
        }
        else if (draft.document.response.type === responseType_1.ResponseType.PART_ADMISSION) {
            if (!draft.document.partialAdmission) {
                draft.document.partialAdmission = new responseDraft_1.PartialAdmission();
            }
            delete draft.document.fullAdmission;
            delete draft.document.rejectAllOfClaim;
            delete draft.document.freeMediation;
        }
        else {
            delete draft.document.fullAdmission;
            delete draft.document.partialAdmission;
            delete draft.document.statementOfMeans;
        }
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        switch (draft.document.response.type) {
            case responseType_1.ResponseType.DEFENCE:
                res.redirect(paths_1.Paths.defenceRejectAllOfClaimPage.evaluateUri({ externalId: externalId }));
                break;
            case responseType_1.ResponseType.PART_ADMISSION:
                if (featureToggles_1.FeatureToggles.hasAnyAuthorisedFeature(claim.features, 'admissions')) {
                    res.redirect(paths_1.PartAdmissionPaths.alreadyPaidPage.evaluateUri({ externalId: externalId }));
                }
                else {
                    res.redirect(paths_1.Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }));
                }
                break;
            case responseType_1.ResponseType.FULL_ADMISSION:
                if (featureToggles_1.FeatureToggles.hasAnyAuthorisedFeature(claim.features, 'admissions')) {
                    res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }));
                }
                else {
                    res.redirect(paths_1.Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }));
                }
                break;
            default:
                next(new Error(`Unknown response type: ${draft.document.response.type}`));
        }
    }
}));
