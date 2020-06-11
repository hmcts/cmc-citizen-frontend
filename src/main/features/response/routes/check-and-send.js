"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const formValidator_1 = require("forms/validation/formValidator");
const form_1 = require("forms/form");
const statementOfTruth_1 = require("response/form/models/statementOfTruth");
const rejectAllOfClaim_1 = require("response/form/models/rejectAllOfClaim");
const claimStoreClient_1 = require("claims/claimStoreClient");
const responseType_1 = require("response/form/models/responseType");
const allResponseTasksCompletedGuard_1 = require("response/guards/allResponseTasksCompletedGuard");
const errorHandling_1 = require("shared/errorHandling");
const signatureType_1 = require("common/signatureType");
const qualifiedStatementOfTruth_1 = require("response/form/models/qualifiedStatementOfTruth");
const draftService_1 = require("services/draftService");
const statementOfMeansFeature_1 = require("response/helpers/statementOfMeansFeature");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
const freeMediationUtil_1 = require("shared/utils/freeMediationUtil");
const featureToggles_1 = require("utils/featureToggles");
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient();
function renderView(form, res) {
    const claim = res.locals.claim;
    const draft = res.locals.responseDraft;
    const mediationDraft = res.locals.mediationDraft;
    const directionsQuestionnaireDraft = res.locals.directionsQuestionnaireDraft;
    const dqsEnabled = (claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')) && (draft.document.response.type === responseType_1.ResponseType.DEFENCE || draft.document.response.type === responseType_1.ResponseType.PART_ADMISSION);
    let datesUnavailable;
    if (dqsEnabled) {
        datesUnavailable = directionsQuestionnaireDraft.document.availability.unavailableDates.map(date => date.toMoment().format('LL'));
    }
    const statementOfTruthType = signatureType_1.SignatureType.RESPONSE;
    if (dqsEnabled) {
        if (form.model.type === signatureType_1.SignatureType.QUALIFIED) {
            form.model.type = signatureType_1.SignatureType.DIRECTION_QUESTIONNAIRE_QUALIFIED;
        }
        else {
            form.model.type = signatureType_1.SignatureType.DIRECTION_QUESTIONNAIRE;
        }
    }
    const mediationPilot = claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'mediationPilot');
    res.render(paths_1.Paths.checkAndSendPage.associatedView, {
        claim: claim,
        form: form,
        draft: draft.document,
        signatureType: signatureTypeFor(claim, draft),
        statementOfMeansIsApplicable: statementOfMeansFeature_1.StatementOfMeansFeature.isApplicableFor(claim, draft.document),
        admissionsApplicable: claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim),
        dqsEnabled: dqsEnabled,
        mediationDraft: mediationDraft,
        contactPerson: freeMediationUtil_1.FreeMediationUtil.getMediationContactPerson(claim, mediationDraft.document, draft.document),
        contactNumber: freeMediationUtil_1.FreeMediationUtil.getMediationPhoneNumber(claim, mediationDraft.document, draft.document),
        directionsQuestionnaireDraft: directionsQuestionnaireDraft.document,
        datesUnavailable: datesUnavailable,
        statementOfTruthType: statementOfTruthType,
        mediationPilot: mediationPilot,
        mediationEnabled: featureToggles_1.FeatureToggles.isEnabled('mediation'),
        timeline: getTimeline(draft),
        evidence: getEvidence(draft)
    });
}
function rejectingFullAmount(draft) {
    return draft.document.response.type === responseType_1.ResponseType.DEFENCE
        || draft.document.response.type === responseType_1.ResponseType.PART_ADMISSION;
}
function getDisagreementRoot(draft) {
    if (draft.document.isResponseRejected()) {
        return draft.document;
    }
    else {
        return draft.document.partialAdmission;
    }
}
function getTimeline(draft) {
    if (rejectingFullAmount(draft)) {
        const timeline = getDisagreementRoot(draft).timeline;
        timeline.removeExcessRows();
        if (timeline.rows.length > 0 || timeline.comment) {
            return timeline;
        }
    }
    return undefined;
}
function getEvidence(draft) {
    if (rejectingFullAmount(draft)) {
        const evidence = getDisagreementRoot(draft).evidence;
        evidence.removeExcessRows();
        if (evidence.rows.length > 0 || evidence.comment) {
            return evidence;
        }
    }
    return undefined;
}
function defendantIsCounterClaiming(draft) {
    return draft.document.rejectAllOfClaim &&
        draft.document.rejectAllOfClaim.option === rejectAllOfClaim_1.RejectAllOfClaimOption.COUNTER_CLAIM;
}
function isStatementOfTruthRequired(draft) {
    return !defendantIsCounterClaiming(draft);
}
function signatureTypeFor(claim, draft) {
    if (isStatementOfTruthRequired(draft)) {
        if (claim.claimData.defendant.isBusiness()) {
            return signatureType_1.SignatureType.QUALIFIED;
        }
        else {
            return signatureType_1.SignatureType.BASIC;
        }
    }
    else {
        return signatureType_1.SignatureType.NONE;
    }
}
function deserializerFunction(value) {
    switch (value.type) {
        case signatureType_1.SignatureType.BASIC:
        case signatureType_1.SignatureType.DIRECTION_QUESTIONNAIRE:
            return statementOfTruth_1.StatementOfTruth.fromObject(value);
        case signatureType_1.SignatureType.QUALIFIED:
        case signatureType_1.SignatureType.DIRECTION_QUESTIONNAIRE_QUALIFIED:
            return qualifiedStatementOfTruth_1.QualifiedStatementOfTruth.fromObject(value);
        default:
            throw new Error(`Unknown statement of truth type: ${value.type}`);
    }
}
function getStatementOfTruthClassFor(claim, draft) {
    if (signatureTypeFor(claim, draft) === signatureType_1.SignatureType.QUALIFIED) {
        return qualifiedStatementOfTruth_1.QualifiedStatementOfTruth;
    }
    else {
        return statementOfTruth_1.StatementOfTruth;
    }
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.checkAndSendPage.uri, allResponseTasksCompletedGuard_1.AllResponseTasksCompletedGuard.requestHandler, (req, res) => {
    const claim = res.locals.claim;
    const draft = res.locals.responseDraft;
    const StatementOfTruthClass = getStatementOfTruthClassFor(claim, draft);
    renderView(new form_1.Form(new StatementOfTruthClass()), res);
})
    .post(paths_1.Paths.checkAndSendPage.uri, allResponseTasksCompletedGuard_1.AllResponseTasksCompletedGuard.requestHandler, formValidator_1.FormValidator.requestHandler(undefined, deserializerFunction), errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const claim = res.locals.claim;
    const draft = res.locals.responseDraft;
    const mediationDraft = res.locals.mediationDraft;
    const directionsQuestionnaireDraft = res.locals.directionsQuestionnaireDraft;
    const user = res.locals.user;
    const form = req.body;
    if (isStatementOfTruthRequired(draft) && form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const responseType = draft.document.response.type;
        switch (responseType) {
            case responseType_1.ResponseType.DEFENCE:
                if (defendantIsCounterClaiming(draft)) {
                    res.redirect(paths_1.Paths.counterClaimPage.evaluateUri({ externalId: claim.externalId }));
                    return;
                }
                break;
            case responseType_1.ResponseType.FULL_ADMISSION:
            case responseType_1.ResponseType.PART_ADMISSION:
                break;
            default:
                next(new Error('Unknown response type: ' + responseType));
        }
        const draftService = new draftService_1.DraftService();
        if (form.model.type === signatureType_1.SignatureType.QUALIFIED || form.model.type === signatureType_1.SignatureType.DIRECTION_QUESTIONNAIRE_QUALIFIED) {
            draft.document.qualifiedStatementOfTruth = form.model;
            await draftService.save(draft, user.bearerToken);
        }
        await claimStoreClient.saveResponseForUser(claim, draft, mediationDraft, directionsQuestionnaireDraft, user);
        await draftService.delete(draft.id, user.bearerToken);
        if (draft.document.response.type !== responseType_1.ResponseType.FULL_ADMISSION && mediationDraft.id) {
            await draftService.delete(mediationDraft.id, user.bearerToken);
        }
        if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire') && directionsQuestionnaireDraft.id && (draft.document.response.type === responseType_1.ResponseType.DEFENCE || draft.document.response.type === responseType_1.ResponseType.PART_ADMISSION)) {
            await draftService.delete(directionsQuestionnaireDraft.id, user.bearerToken);
        }
        res.redirect(paths_1.Paths.confirmationPage.evaluateUri({ externalId: claim.externalId }));
    }
}));
