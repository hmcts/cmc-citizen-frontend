"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const fullRejectionGuard_1 = require("response/guards/fullRejectionGuard");
const optInFeatureToggleGuard_1 = require("guards/optInFeatureToggleGuard");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.FullRejectionPaths.youHavePaidLessPage.uri, optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'), fullRejectionGuard_1.FullRejectionGuard.requestHandler(), (req, res) => {
    res.render(paths_1.FullRejectionPaths.youHavePaidLessPage.associatedView);
})
    .post(paths_1.FullRejectionPaths.youHavePaidLessPage.uri, optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'), fullRejectionGuard_1.FullRejectionGuard.requestHandler(), function (req, res) {
    const { externalId } = req.params;
    res.redirect(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
});
