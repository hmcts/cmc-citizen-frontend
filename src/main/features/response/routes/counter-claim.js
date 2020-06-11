"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const feesTableViewHelper_1 = require("claim/helpers/feesTableViewHelper");
async function renderView(res, next) {
    try {
        const claim = res.locals.claim;
        const draft = res.locals.responseDraft;
        const rows = await feesTableViewHelper_1.FeesTableViewHelper.feesTableContent();
        res.render(paths_1.Paths.counterClaimPage.associatedView, {
            claim: claim,
            response: draft.document,
            rows: rows
        });
    }
    catch (err) {
        next(err);
    }
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.counterClaimPage.uri, async (req, res, next) => {
    await renderView(res, next);
});
