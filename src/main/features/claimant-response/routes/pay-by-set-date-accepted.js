"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claimant-response/paths");
const draftService_1 = require("services/draftService");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.payBySetDateAcceptedPage.uri, async (req, res) => {
    res.render(paths_1.Paths.payBySetDateAcceptedPage.associatedView);
})
    .post(paths_1.Paths.payBySetDateAcceptedPage.uri, async (req, res) => {
    const { externalId } = req.params;
    const draft = res.locals.claimantResponseDraft;
    const user = res.locals.user;
    if (draft.document.formaliseRepaymentPlan) {
        delete draft.document.formaliseRepaymentPlan;
    }
    await new draftService_1.DraftService().save(draft, user.bearerToken);
    res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
});
