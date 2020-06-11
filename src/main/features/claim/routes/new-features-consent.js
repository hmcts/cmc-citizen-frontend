"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claim/paths");
const form_1 = require("forms/form");
const featureConsentResponse_1 = require("forms/models/featureConsentResponse");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const claimStoreClient_1 = require("claims/claimStoreClient");
const yesNoOption_1 = require("models/yesNoOption");
const guardFactory_1 = require("response/guards/guardFactory");
const customEventTracker_1 = require("logging/customEventTracker");
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient();
function renderView(form, res) {
    res.render(paths_1.Paths.newFeaturesConsentPage.associatedView, { form: form });
}
function checkConsentedAlready() {
    return guardFactory_1.GuardFactory.createAsync(async (req, res) => {
        const user = res.locals.user;
        const roles = await claimStoreClient.retrieveUserRoles(user);
        return roles && !roles.some(role => role.includes('cmc-new-features-consent'));
    }, (req, res) => {
        res.redirect(paths_1.Paths.taskListPage.uri);
    });
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.newFeaturesConsentPage.uri, checkConsentedAlready(), (req, res) => {
    renderView(form_1.Form.empty(), res);
})
    .post(paths_1.Paths.newFeaturesConsentPage.uri, checkConsentedAlready(), formValidator_1.FormValidator.requestHandler(featureConsentResponse_1.FeatureConsentResponse, featureConsentResponse_1.FeatureConsentResponse.fromObject), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    const user = res.locals.user;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        let roleName;
        if (form.model.consentResponse.option === yesNoOption_1.YesNoOption.YES.option) {
            roleName = 'cmc-new-features-consent-given';
        }
        else {
            roleName = 'cmc-new-features-consent-not-given';
        }
        await claimStoreClient.addRoleToUser(user, roleName);
        customEventTracker_1.trackCustomEvent('New features consent - ' + roleName, {});
        res.redirect(paths_1.Paths.taskListPage.uri);
    }
}));
