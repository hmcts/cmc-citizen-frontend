"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claimant-response/paths");
const taskListBuilder_1 = require("claimant-response/helpers/taskListBuilder");
const errorHandling_1 = require("shared/errorHandling");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.incompleteSubmissionPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const draft = res.locals.claimantResponseDraft;
    const claim = res.locals.claim;
    const mediationDraft = res.locals.mediationDraft;
    const directionQuestionnaireDraft = res.locals.directionsQuestionnaireDraft;
    res.render(paths_1.Paths.incompleteSubmissionPage.associatedView, {
        taskListUri: paths_1.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }),
        tasks: taskListBuilder_1.TaskListBuilder.buildRemainingTasks(draft.document, claim, mediationDraft, directionQuestionnaireDraft.document)
    });
}));
