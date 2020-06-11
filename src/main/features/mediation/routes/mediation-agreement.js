"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("mediation/paths");
const errorHandling_1 = require("main/common/errorHandling");
const freeMediation_1 = require("main/app/forms/models/freeMediation");
const draftService_1 = require("services/draftService");
function renderView(res) {
    const user = res.locals.user;
    const claim = res.locals.claim;
    res.render(paths_1.Paths.mediationAgreementPage.associatedView, {
        otherParty: claim.otherPartyName(user)
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.mediationAgreementPage.uri, (req, res) => {
    renderView(res);
})
    .post(paths_1.Paths.mediationAgreementPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const claim = res.locals.claim;
    const draft = res.locals.mediationDraft;
    const user = res.locals.user;
    if (req.body.accept) {
        draft.document.youCanOnlyUseMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.YES);
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        if ((user.id === claim.defendantId && claim.claimData.defendant.isBusiness()) ||
            (user.id === claim.claimantId && claim.claimData.claimant.isBusiness())) {
            res.redirect(paths_1.Paths.canWeUseCompanyPage.evaluateUri({ externalId: claim.externalId }));
        }
        else {
            res.redirect(paths_1.Paths.canWeUsePage.evaluateUri({ externalId: claim.externalId }));
        }
    }
    else {
        draft.document.youCanOnlyUseMediation = new freeMediation_1.FreeMediation(freeMediation_1.FreeMediationOption.NO);
        draft.document.canWeUse = undefined;
        draft.document.canWeUseCompany = undefined;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.Paths.continueWithoutMediationPage.evaluateUri({ externalId: claim.externalId }));
    }
}));
