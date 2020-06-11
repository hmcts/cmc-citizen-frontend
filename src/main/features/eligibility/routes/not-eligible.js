"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config = require("config");
const paths_1 = require("eligibility/paths");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.notEligiblePage.uri, (req, res) => {
    res.render(paths_1.Paths.notEligiblePage.associatedView, {
        reason: req.query.reason,
        legacyServiceUrl: config.get('mcol.url')
    });
});
