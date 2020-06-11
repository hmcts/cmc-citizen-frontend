"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.summaryPage.uri, (req, res) => {
    const claim = res.locals.claim;
    res.render(paths_1.Paths.summaryPage.associatedView, {
        response: claim.response
    });
});
