"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paymentIntentionData_1 = require("test/data/entity/paymentIntentionData");
const decisionType_1 = require("common/court-calculations/decisionType");
const momentFactory_1 = require("shared/momentFactory");
exports.courtDeterminationData = {
    courtDecision: paymentIntentionData_1.monthlyInstalmentPaymentIntentionData,
    courtPaymentIntention: paymentIntentionData_1.monthlyInstalmentPaymentIntentionData,
    rejectionReason: 'rejection reason',
    disposableIncome: 750,
    decisionType: decisionType_1.DecisionType.CLAIMANT
};
exports.courtDeterminationChoseDefendantData = {
    decisionType: 'DEFENDANT',
    courtDecision: {
        paymentOption: 'INSTALMENTS',
        repaymentPlan: {
            paymentLength: '100 months',
            completionDate: '2028-04-01',
            paymentSchedule: 'EVERY_MONTH',
            firstPaymentDate: '2020-01-01',
            instalmentAmount: 1
        }
    },
    disposableIncome: -250.9,
    courtPaymentIntention: {
        paymentDate: '9999-12-31',
        paymentOption: 'BY_SPECIFIED_DATE'
    }
};
exports.courtDeterminationChoseClaimantData = {
    decisionType: 'CLAIMANT',
    courtDecision: {
        paymentDate: '2020-01-01',
        paymentOption: 'BY_SPECIFIED_DATE'
    },
    disposableIncome: 2332.43,
    courtPaymentIntention: {
        paymentDate: '2019-06-28',
        paymentOption: 'BY_SPECIFIED_DATE'
    }
};
exports.courtDeterminationChoseCourtData = {
    decisionType: 'COURT',
    courtDecision: {
        paymentOption: 'BY_SPECIFIED_DATE',
        paymentDate: momentFactory_1.MomentFactory.parse('2018-11-01'),
        repaymentPlan: undefined
    }
};
