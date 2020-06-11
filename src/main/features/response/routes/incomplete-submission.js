"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const taskListBuilder_1 = require("response/helpers/taskListBuilder");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.incompleteSubmissionPage.uri, (req, res) => {
    const claim = res.locals.claim;
    const draft = res.locals.responseDraft;
    const mediationDraft = res.locals.mediationDraft;
    const directionQuestionnaireDraft = res.locals.directionsQuestionnaireDraft;
    res.render(paths_1.Paths.incompleteSubmissionPage.associatedView, {
        taskListUri: paths_1.Paths.taskListPage.evaluateUri({ externalId: claim.externalId }),
        tasks: taskListBuilder_1.TaskListBuilder.buildRemainingTasks(draft.document, claim, mediationDraft.document, directionQuestionnaireDraft.document)
    });
});
