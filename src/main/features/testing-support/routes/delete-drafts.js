"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("testing-support/paths");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const draftService = new draftService_1.DraftService();
function getDraftType(req) {
    return Object.keys(req.body.action)[0];
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.deleteDraftsPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    res.render(paths_1.Paths.deleteDraftsPage.associatedView);
}))
    .post(paths_1.Paths.deleteDraftsPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const user = res.locals.user;
    const drafts = await draftService.find(getDraftType(req), '100', user.bearerToken, (value) => value);
    drafts.forEach(async (draft) => {
        await new draftService_1.DraftService().delete(draft.id, user.bearerToken);
    });
    res.redirect(paths_1.Paths.indexPage.uri);
}));
