"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const taskListBuilder_1 = require("claim/helpers/taskListBuilder");
const newFeaturesConsentGuard_1 = require("claim/guards/newFeaturesConsentGuard");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.taskListPage.uri, newFeaturesConsentGuard_1.NewFeaturesConsentGuard.requestHandler(), (req, res) => {
    const draft = res.locals.claimDraft;
    const beforeYouStartSection = taskListBuilder_1.TaskListBuilder.buildBeforeYouStartSection(draft.document);
    const prepareYourClaimSection = taskListBuilder_1.TaskListBuilder.buildPrepareYourClaimSection(draft.document);
    const submitSection = taskListBuilder_1.TaskListBuilder.buildSubmitSection();
    res.render(paths_1.Paths.taskListPage.associatedView, {
        beforeYouStart: beforeYouStartSection,
        prepareYourClaim: prepareYourClaimSection,
        submit: submitSection
    });
});
