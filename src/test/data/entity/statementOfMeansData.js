"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const disabilityStatus_1 = require("claims/models/response/statement-of-means/disabilityStatus");
const income_1 = require("claims/models/response/statement-of-means/income");
const paymentFrequency_1 = require("claims/models/response/core/paymentFrequency");
const dependant_1 = require("claims/models/response/statement-of-means/dependant");
const priorityDebts_1 = require("claims/models/response/statement-of-means/priorityDebts");
const residence_1 = require("claims/models/response/statement-of-means/residence");
const bankAccount_1 = require("claims/models/response/statement-of-means/bankAccount");
const expense_1 = require("claims/models/response/statement-of-means/expense");
exports.sampleDefendantOnPension = {
    type: income_1.IncomeType.PENSION,
    frequency: paymentFrequency_1.PaymentFrequency.MONTH,
    amount: 200
};
exports.samplePartnerDetails = {
    partner: {
        over18: true,
        disability: disabilityStatus_1.DisabilityStatus.SEVERE,
        pensioner: false
    }
};
exports.sampleUnder18PartnerDetails = {
    partner: {
        over18: false,
        disability: disabilityStatus_1.DisabilityStatus.NO,
        pensioner: false
    }
};
exports.samplePartnerPensioner = {
    partner: {
        over18: true,
        disability: disabilityStatus_1.DisabilityStatus.SEVERE,
        pensioner: true
    }
};
exports.sampleOneDependantDetails = {
    dependant: {
        children: [{ ageGroupType: dependant_1.AgeGroupType.UNDER_11, numberOfChildren: 1 }],
        numberOfMaintainedChildren: 0,
        anyDisabledChildren: false,
        otherDependants: { numberOfPeople: 0, details: 'some string', anyDisabled: false }
    }
};
exports.sampleOneDisabledDependantDetails = {
    dependant: {
        children: [{ ageGroupType: dependant_1.AgeGroupType.UNDER_11, numberOfChildren: 1 }],
        numberOfMaintainedChildren: 0,
        anyDisabledChildren: true,
        otherDependants: { numberOfPeople: 0, details: 'some string', anyDisabled: true }
    }
};
exports.sampleElevenDependantDetails = {
    dependant: {
        children: [
            { ageGroupType: dependant_1.AgeGroupType.UNDER_11, numberOfChildren: 3 },
            { ageGroupType: dependant_1.AgeGroupType.BETWEEN_11_AND_15, numberOfChildren: 3 },
            { ageGroupType: dependant_1.AgeGroupType.BETWEEN_16_AND_19, numberOfChildren: 2, numberOfChildrenLivingWithYou: 2 }
        ],
        anyDisabledChildren: true,
        numberOfMaintainedChildren: 1,
        otherDependants: { numberOfPeople: 3, details: 'some string', anyDisabled: true }
    }
};
exports.samplePriorityDebts = {
    priorityDebts: [
        { type: priorityDebts_1.PriorityDebtType.MAINTENANCE_PAYMENTS, frequency: paymentFrequency_1.PaymentFrequency.MONTH, amount: 200 },
        { type: priorityDebts_1.PriorityDebtType.WATER, frequency: paymentFrequency_1.PaymentFrequency.MONTH, amount: 155.55 },
        { type: priorityDebts_1.PriorityDebtType.COUNCIL_TAX, frequency: paymentFrequency_1.PaymentFrequency.WEEK, amount: 10 }
    ]
};
exports.samplePriorityDebtsNoFrequency = {
    priorityDebts: [{ type: priorityDebts_1.PriorityDebtType.MAINTENANCE_PAYMENTS, frequency: undefined, amount: 200 }]
};
exports.samplePriorityDebtsNoAmount = {
    priorityDebts: [{ type: priorityDebts_1.PriorityDebtType.MAINTENANCE_PAYMENTS, frequency: paymentFrequency_1.PaymentFrequency.WEEK, amount: undefined }]
};
exports.sampleStatementOfMeansBase = {
    residence: {
        type: residence_1.ResidenceType.OWN_HOME,
        otherDetail: ''
    },
    employment: {
        selfEmployment: {
            jobTitle: 'IT',
            annualTurnover: 3000,
            onTaxPayments: {
                amountYouOwe: 0,
                reason: ''
            }
        }
    },
    bankAccounts: [{
            type: bankAccount_1.BankAccountType.CURRENT_ACCOUNT,
            joint: false,
            balance: 1000
        }, {
            type: bankAccount_1.BankAccountType.ISA,
            joint: true,
            balance: 2000
        }, {
            type: bankAccount_1.BankAccountType.OTHER,
            joint: false,
            balance: 4000
        }],
    debts: [{
            description: 'Something',
            totalOwed: 3000,
            monthlyPayments: 30
        }, {
            description: 'Something else',
            totalOwed: 4000,
            monthlyPayments: 40
        }],
    courtOrders: [
        {
            claimNumber: '123',
            amountOwed: 2000,
            monthlyInstalmentAmount: 20
        },
        {
            claimNumber: '456',
            amountOwed: 5000,
            monthlyInstalmentAmount: 50
        }
    ],
    reason: 'Because'
};
exports.sampleIncomesData = {
    incomes: [
        {
            type: income_1.IncomeType.JOB,
            frequency: paymentFrequency_1.PaymentFrequency.MONTH,
            amount: 1500
        },
        {
            type: income_1.IncomeType.INCOME_SUPPORT,
            frequency: paymentFrequency_1.PaymentFrequency.WEEK,
            amount: 50
        }
    ]
};
exports.sampleIncomesWithPensionData = {
    incomes: [
        {
            type: income_1.IncomeType.JOB,
            frequency: paymentFrequency_1.PaymentFrequency.MONTH,
            amount: 1500
        },
        {
            type: income_1.IncomeType.INCOME_SUPPORT,
            frequency: paymentFrequency_1.PaymentFrequency.WEEK,
            amount: 50
        },
        exports.sampleDefendantOnPension
    ]
};
exports.sampleExpensesData = {
    expenses: [
        {
            type: expense_1.ExpenseType.ELECTRICITY,
            frequency: paymentFrequency_1.PaymentFrequency.MONTH,
            amount: 100
        },
        {
            type: expense_1.ExpenseType.GAS,
            frequency: paymentFrequency_1.PaymentFrequency.WEEK,
            amount: 10
        }
    ]
};
exports.sampleExpensesDataWithMortgageAndRent = {
    expenses: [
        {
            type: expense_1.ExpenseType.MORTGAGE,
            frequency: paymentFrequency_1.PaymentFrequency.MONTH,
            amount: 300
        },
        {
            type: expense_1.ExpenseType.RENT,
            frequency: paymentFrequency_1.PaymentFrequency.MONTH,
            amount: 200
        },
        {
            type: expense_1.ExpenseType.ELECTRICITY,
            frequency: paymentFrequency_1.PaymentFrequency.MONTH,
            amount: 100
        },
        {
            type: expense_1.ExpenseType.GAS,
            frequency: paymentFrequency_1.PaymentFrequency.WEEK,
            amount: 10
        }
    ]
};
exports.sampleStatementOfMeans = Object.assign(Object.assign(Object.assign({}, exports.sampleStatementOfMeansBase), exports.sampleExpensesData), exports.sampleIncomesData);
exports.sampleStatementOfMeansWithMortgageAndRent = Object.assign(Object.assign(Object.assign({}, exports.sampleStatementOfMeansBase), exports.sampleExpensesDataWithMortgageAndRent), exports.sampleIncomesData);
exports.sampleStatementOfMeansWithPriorityDebts = Object.assign(Object.assign({}, exports.sampleStatementOfMeans), exports.samplePriorityDebts);
exports.sampleStatementOfMeansWithDefendantPension = Object.assign(Object.assign(Object.assign({}, exports.sampleStatementOfMeans), exports.sampleExpensesData), exports.sampleIncomesWithPensionData);
exports.sampleStatementOfMeansAllAllowances = Object.assign(Object.assign(Object.assign({}, exports.sampleStatementOfMeansWithDefendantPension), exports.sampleOneDependantDetails), { disability: disabilityStatus_1.DisabilityStatus.YES });
exports.sampleStatementOfMeansWithPriorityDebtsAndAllowances = Object.assign(Object.assign(Object.assign(Object.assign({}, exports.sampleStatementOfMeansWithDefendantPension), exports.sampleOneDependantDetails), { disability: disabilityStatus_1.DisabilityStatus.YES }), exports.samplePriorityDebts);
exports.sampleStatementOfMeansWithAllDebtsExpensesAndAllowances = Object.assign(Object.assign({}, exports.sampleStatementOfMeansWithPriorityDebtsAndAllowances), exports.sampleExpensesDataWithMortgageAndRent);
