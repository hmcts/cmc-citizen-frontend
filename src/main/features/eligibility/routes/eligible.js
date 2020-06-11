"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("eligibility/paths");
const paths_2 = require("claim/paths");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.eligiblePage.uri, (req, res) => {
    res.render(paths_1.Paths.eligiblePage.associatedView, {
        nextPage: paths_2.Paths.taskListPage.uri
    });
});
