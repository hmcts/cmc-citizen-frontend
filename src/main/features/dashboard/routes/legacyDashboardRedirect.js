"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const paths_2 = require("dashboard/paths");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.legacyDashboardRedirect.uri, async (req, res) => {
    res.redirect(paths_2.Paths.dashboardPage.uri);
});
