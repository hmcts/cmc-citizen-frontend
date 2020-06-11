"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("response/paths");
const statementOfMeansStateGuard_1 = require("response/guards/statementOfMeansStateGuard");
const form_1 = require("forms/form");
const formValidator_1 = require("forms/validation/formValidator");
const errorHandling_1 = require("shared/errorHandling");
const draftService_1 = require("services/draftService");
const calculateMonthlyIncomeExpense_1 = require("common/calculate-monthly-income-expense/calculateMonthlyIncomeExpense");
const incomeExpenseSources_1 = require("common/calculate-monthly-income-expense/incomeExpenseSources");
const class_validator_1 = require("@hmcts/class-validator");
const optInFeatureToggleGuard_1 = require("guards/optInFeatureToggleGuard");
const priorityDebt_1 = require("response/form/models/statement-of-means/priorityDebt");
const page = paths_1.StatementOfMeansPaths.priorityDebtsPage;
function renderView(form, res) {
    res.render(page.associatedView, {
        form: form,
        totalMonthlyIncomeExpense: calculateTotalMonthlyIncomeExpense(form.model)
    });
}
function calculateTotalMonthlyIncomeExpense(model) {
    if (!model) {
        return undefined;
    }
    const incomeExpenseSources = incomeExpenseSources_1.IncomeExpenseSources.fromPriorityDebtModel(model);
    if (!isValid(incomeExpenseSources)) {
        return undefined;
    }
    return calculateMonthlyIncomeExpense_1.CalculateMonthlyIncomeExpense.calculateTotalAmount(incomeExpenseSources.incomeExpenseSources);
}
function isValid(incomeExpenseSources) {
    const validator = new class_validator_1.Validator();
    return validator.validateSync(incomeExpenseSources).length === 0;
}
function actionHandler(req, res, next) {
    function extractPropertyName(action) {
        return Object.keys(action)[0];
    }
    if (req.body.action) {
        const actionName = extractPropertyName(req.body.action);
        const form = req.body;
        switch (actionName) {
            case 'resetDebt':
                const propertyName = extractPropertyName(req.body.action[actionName]);
                const selectedForReset = form.valueFor(propertyName);
                form.model.resetIncome(propertyName, selectedForReset);
                break;
        }
        return renderView(form, res);
    }
    next();
}
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(page.uri, optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'), statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const draft = res.locals.responseDraft;
    renderView(new form_1.Form(draft.document.statementOfMeans.priorityDebt), res);
}))
    .post(page.uri, optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'), statementOfMeansStateGuard_1.StatementOfMeansStateGuard.requestHandler(), formValidator_1.FormValidator.requestHandler(priorityDebt_1.PriorityDebt, priorityDebt_1.PriorityDebt.fromObject, undefined, ['resetDebt']), actionHandler, errorHandling_1.ErrorHandling.apply(async (req, res) => {
    const form = req.body;
    const { externalId } = req.params;
    if (form.hasErrors()) {
        renderView(form, res);
    }
    else {
        const draft = res.locals.responseDraft;
        const user = res.locals.user;
        draft.document.statementOfMeans.priorityDebt = form.model;
        await new draftService_1.DraftService().save(draft, user.bearerToken);
        res.redirect(paths_1.StatementOfMeansPaths.debtsPage.evaluateUri({ externalId: externalId }));
    }
}));
