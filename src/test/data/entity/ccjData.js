"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const momentFactory_1 = require("shared/momentFactory");
exports.ccjDeterminationByInstalment = {
    ccjType: 'DETERMINATION',
    paidAmount: 10,
    paymentOption: 'INSTALMENTS',
    repaymentPlan: {
        paymentLength: '100 months',
        completionDate: '2028-04-01',
        paymentSchedule: 'EVERY_MONTH',
        firstPaymentDate: '2020-01-01',
        instalmentAmount: 1
    },
    defendantDateOfBirth: '2000-01-01'
};
function ccjDeterminationBySpecifiedDate() {
    return {
        ccjType: 'DETERMINATION',
        payBySetDate: momentFactory_1.MomentFactory.currentDate().add(2, 'year'),
        paymentOption: 'BY_SPECIFIED_DATE',
        defendantDateOfBirth: '1999-01-01'
    };
}
exports.ccjDeterminationBySpecifiedDate = ccjDeterminationBySpecifiedDate;
function ccjAdmissionBySpecifiedDate() {
    return {
        ccjType: 'ADMISSIONS',
        payBySetDate: momentFactory_1.MomentFactory.currentDate().add(2, 'year'),
        paymentOption: 'BY_SPECIFIED_DATE',
        defendantDateOfBirth: '1999-01-01'
    };
}
exports.ccjAdmissionBySpecifiedDate = ccjAdmissionBySpecifiedDate;
