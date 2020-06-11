"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const taskListBuilder_1 = require("response/helpers/taskListBuilder");
const momentFactory_1 = require("shared/momentFactory");
const featureToggles_1 = require("utils/featureToggles");
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.taskListPage.uri, async (req, res, next) => {
    try {
        const draft = res.locals.responseDraft;
        const draftMediation = res.locals.mediationDraft;
        const claim = res.locals.claim;
        const directionQuestionnaireDraft = res.locals.directionsQuestionnaireDraft;
        const beforeYouStartSection = await taskListBuilder_1.TaskListBuilder
            .buildBeforeYouStartSection(draft.document, claim, momentFactory_1.MomentFactory.currentDateTime());
        const respondToClaimSection = taskListBuilder_1.TaskListBuilder
            .buildRespondToClaimSection(draft.document, claim);
        const resolvingClaimSection = taskListBuilder_1.TaskListBuilder
            .buildResolvingClaimSection(draft.document, claim, draftMediation.document);
        let directionsQuestionnaireSection;
        if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire') && claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')) {
            directionsQuestionnaireSection = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(draft.document, claim, directionQuestionnaireDraft.document);
        }
        const submitSection = taskListBuilder_1.TaskListBuilder.buildSubmitSection(claim, draft.document, claim.externalId);
        res.render(paths_1.Paths.taskListPage.associatedView, {
            beforeYouStartSection: beforeYouStartSection,
            submitSection: submitSection,
            respondToClaimSection: respondToClaimSection,
            resolvingClaimSection: resolvingClaimSection,
            directionsQuestionnaireSection: directionsQuestionnaireSection,
            claim: claim
        });
    }
    catch (err) {
        next(err);
    }
});
