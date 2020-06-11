"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claimant-response/paths");
const taskListBuilder_1 = require("claimant-response/helpers/taskListBuilder");
const errorHandling_1 = require("shared/errorHandling");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.taskListPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const draft = res.locals.claimantResponseDraft;
    const mediationDraft = res.locals.mediationDraft;
    const directionsQuestionnaireDraft = res.locals.directionsQuestionnaireDraft;
    const claim = res.locals.claim;
    const beforeYouStartSection = taskListBuilder_1.TaskListBuilder
        .buildDefendantResponseSection(draft.document, claim);
    const howYouWantToRespondSection = taskListBuilder_1.TaskListBuilder
        .buildHowYouWantToRespondSection(draft.document, claim, mediationDraft.document);
    const submitSection = taskListBuilder_1.TaskListBuilder
        .buildSubmitSection(draft.document, claim.externalId);
    const directionsQuestionnaireSection = taskListBuilder_1.TaskListBuilder
        .buildDirectionsQuestionnaireSection(draft.document, claim, directionsQuestionnaireDraft.document);
    res.render(paths_1.Paths.taskListPage.associatedView, {
        beforeYouStartSection: beforeYouStartSection,
        howYouWantToRespondSection: howYouWantToRespondSection,
        submitSection: submitSection,
        directionsQuestionnaireSection: directionsQuestionnaireSection,
        claim: claim
    });
}));
