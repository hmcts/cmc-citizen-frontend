"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("eligibility/paths");
const config = require("config");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.mcolEligibilityPage.uri, (req, res) => {
    res.render(paths_1.Paths.mcolEligibilityPage.associatedView, {
        mcolUrl: config.get('mcol.url')
    });
});
