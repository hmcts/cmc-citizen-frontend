"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const HttpStatus = require("http-status-codes");
const _ = require("lodash");
const paths_1 = require("paths");
const paymentPlan_1 = require("common/payment-plan/paymentPlan");
const frequency_1 = require("common/frequency/frequency");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.paymentPlanCalculation.uri, (req, res) => {
    const totalAmount = req.query['total-amount'];
    const instalmentAmount = req.query['instalment-amount'];
    const frequencyInWeeks = req.query['frequency-in-weeks'];
    const error = validate(totalAmount, instalmentAmount, frequencyInWeeks);
    if (error) {
        return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
            error: {
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                message: error
            }
        });
    }
    const frequency = frequency_1.Frequency.ofWeekly(Number(frequencyInWeeks));
    const paymentPlan = paymentPlan_1.PaymentPlan.create(Number(totalAmount), Number(instalmentAmount), frequency);
    return res.status(HttpStatus.OK).json({
        paymentPlan: {
            paymentLength: paymentPlan.calculatePaymentLength(),
            lastPaymentDate: paymentPlan.calculateLastPaymentDate().toJSON()
        }
    });
});
function validate(totalAmount, instalmentAmount, frequencyInWeeks) {
    return validateThatIsPositiveNumber(totalAmount, 'total-amount')
        || validateThatIsPositiveNumber(instalmentAmount, 'instalment-amount')
        || validateThatIsPositiveNumber(frequencyInWeeks, 'frequency-in-weeks');
}
function validateThatIsPositiveNumber(value, name) {
    if (_.isEmpty(value)) {
        return `'${name}' not provided`;
    }
    const convertedValue = Number(value);
    if (isNaN(convertedValue)) {
        return `'${name}' must be a number`;
    }
    if (convertedValue < 1) {
        return `'${name}' must be a positive number`;
    }
}
