"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const taskListBuilder_1 = require("claim/helpers/taskListBuilder");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.incompleteSubmissionPage.uri, (req, res) => {
    const draft = res.locals.claimDraft;
    res.render(paths_1.Paths.incompleteSubmissionPage.associatedView, {
        taskListUri: paths_1.Paths.taskListPage.uri,
        tasks: taskListBuilder_1.TaskListBuilder.buildRemainingTasks(draft.document)
    });
});
