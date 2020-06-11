"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const HttpStatus = require("http-status-codes");
const paths_1 = require("main/app/paths");
const calculateMonthlyIncomeExpense_1 = require("common/calculate-monthly-income-expense/calculateMonthlyIncomeExpense");
const class_validator_1 = require("@hmcts/class-validator");
const incomeExpenseSources_1 = require("common/calculate-monthly-income-expense/incomeExpenseSources");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .post(paths_1.Paths.totalIncomeOrExpensesCalculation.uri, async (req, res) => {
    try {
        const incomeExpenseSources = incomeExpenseSources_1.IncomeExpenseSources.fromObject(req.body);
        const validator = new class_validator_1.Validator();
        const error = await validator.validate(incomeExpenseSources);
        if (error.length > 0) {
            return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(error);
        }
        const totalMonthlyIncomeExpense = calculateMonthlyIncomeExpense_1.CalculateMonthlyIncomeExpense
            .calculateTotalAmount(incomeExpenseSources.incomeExpenseSources);
        return res.status(HttpStatus.OK).json({
            totalMonthlyIncomeExpense: totalMonthlyIncomeExpense
        });
    }
    catch (err) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(err);
    }
});
