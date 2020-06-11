"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("eligibility/paths");
const errorHandling_1 = require("shared/errorHandling");
const formValidator_1 = require("forms/validation/formValidator");
const form_1 = require("forms/form");
const eligibility_1 = require("eligibility/model/eligibility");
const store_1 = require("eligibility/store");
const eligibilityStore = new store_1.CookieEligibilityStore();
class EligibilityPage {
    constructor(path, nextPagePath, property) {
        this.path = path;
        this.nextPagePath = nextPagePath;
        this.property = property;
    }
    buildRouter() {
        return express.Router()
            .get(this.path.uri, (req, res) => {
            this.renderView(new form_1.Form(eligibilityStore.read(req, res)), res);
        })
            .post(this.path.uri, formValidator_1.FormValidator.requestHandler(undefined, eligibility_1.Eligibility.fromObject, this.property), errorHandling_1.ErrorHandling.apply(async (req, res) => {
            const form = req.body;
            if (form.hasErrors()) {
                this.renderView(form, res);
            }
            else {
                let eligibility = eligibilityStore.read(req, res);
                if (eligibility === undefined) {
                    eligibility = new eligibility_1.Eligibility();
                }
                eligibility[this.property] = form.model[this.property];
                eligibilityStore.write(eligibility, req, res);
                this.handleAnswer(eligibility[this.property], res);
            }
        }));
    }
    renderView(form, res) {
        res.render(this.path.associatedView, {
            form: form
        });
    }
    handleAnswer(value, res) {
        const result = this.checkEligibility(value);
        if (result.eligible) {
            res.redirect(this.nextPagePath.uri);
        }
        else {
            res.redirect(`${paths_1.Paths.notEligiblePage.uri}?reason=${result.notEligibleReason}`);
        }
    }
}
exports.EligibilityPage = EligibilityPage;
