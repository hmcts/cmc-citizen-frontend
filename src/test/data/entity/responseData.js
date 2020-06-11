"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paymentOption_1 = require("claims/models/paymentOption");
const paymentSchedule_1 = require("claims/models/response/core/paymentSchedule");
const dependant_1 = require("claims/models/response/statement-of-means/dependant");
const residence_1 = require("claims/models/response/statement-of-means/residence");
const bankAccount_1 = require("claims/models/response/statement-of-means/bankAccount");
const momentFactory_1 = require("shared/momentFactory");
const party_1 = require("test/data/entity/party");
const income_1 = require("claims/models/response/statement-of-means/income");
const expense_1 = require("claims/models/response/statement-of-means/expense");
const paymentFrequency_1 = require("claims/models/response/core/paymentFrequency");
const disabilityStatus_1 = require("claims/models/response/statement-of-means/disabilityStatus");
const responseMethod_1 = require("claims/models/response/responseMethod");
exports.baseResponseData = {
    defendant: party_1.individual,
    moreTimeNeeded: 'no',
    freeMediation: 'no',
    mediationPhoneNumber: undefined,
    mediationContactPerson: undefined,
    responseMethod: responseMethod_1.ResponseMethod.DIGITAL
};
const baseCompanyResponseData = {
    defendant: party_1.company,
    moreTimeNeeded: 'no'
};
exports.baseDefenceData = {
    responseType: 'FULL_DEFENCE',
    defence: 'My defence',
    freeMediation: 'no',
    mediationPhoneNumber: undefined,
    mediationContactPerson: undefined
};
exports.defenceWithDisputeData = Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.baseDefenceData), { defenceType: 'DISPUTE' });
exports.defenceWithAmountClaimedAlreadyPaidData = Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.baseDefenceData), { defenceType: 'ALREADY_PAID', paymentDeclaration: {
        paidDate: '2017-12-31',
        paidAmount: 100,
        explanation: 'I paid in cash'
    } });
exports.baseFullAdmissionData = {
    responseType: 'FULL_ADMISSION',
    freeMediation: 'no',
    mediationPhoneNumber: undefined,
    mediationContactPerson: undefined
};
function basePayImmediatelyData() {
    return {
        paymentIntention: {
            paymentOption: paymentOption_1.PaymentOption.IMMEDIATELY,
            paymentDate: momentFactory_1.MomentFactory.currentDate().add(5, 'days')
        }
    };
}
exports.basePayImmediatelyData = basePayImmediatelyData;
function basePayImmediatelyDatePastData() {
    return {
        paymentIntention: {
            paymentOption: paymentOption_1.PaymentOption.IMMEDIATELY,
            paymentDate: momentFactory_1.MomentFactory.currentDate().subtract(5, 'days')
        }
    };
}
exports.basePayImmediatelyDatePastData = basePayImmediatelyDatePastData;
exports.basePayByInstalmentsData = {
    paymentIntention: {
        paymentOption: paymentOption_1.PaymentOption.INSTALMENTS,
        repaymentPlan: {
            instalmentAmount: 100,
            firstPaymentDate: '2050-12-31',
            paymentSchedule: paymentSchedule_1.PaymentSchedule.EACH_WEEK,
            completionDate: '2051-12-31',
            paymentLength: '1'
        }
    }
};
exports.basePayBySetDateData = {
    paymentIntention: {
        paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
        paymentDate: '2050-12-31'
    }
};
exports.basePartialAdmissionData = {
    responseType: 'PART_ADMISSION'
};
exports.basePartialEvidencesAndTimeLines = {
    evidence: {
        rows: [
            {
                type: 'CONTRACTS_AND_AGREEMENTS',
                description: ' you might have signed a contract'
            }
        ],
        comment: ' you might have signed a contract'
    },
    timeline: {
        rows: [
            {
                date: '1 May 2017',
                description: ' you might have signed a contract'
            }
        ],
        comment: ' you might have signed a contract'
    }
};
function fullAdmissionWithImmediatePaymentData() {
    return Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.baseFullAdmissionData), basePayImmediatelyData());
}
exports.fullAdmissionWithImmediatePaymentData = fullAdmissionWithImmediatePaymentData;
function partialAdmissionWithImmediatePaymentData() {
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.basePartialAdmissionData), exports.basePartialEvidencesAndTimeLines), { defence: 'i have paid more than enough' }), basePayImmediatelyData()), { amount: 3000 });
}
exports.partialAdmissionWithImmediatePaymentData = partialAdmissionWithImmediatePaymentData;
function partialAdmissionWithImmediatePaymentDataV2() {
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.basePartialAdmissionData), exports.basePartialEvidencesAndTimeLines), { defence: 'i have paid more than enough' }), basePayImmediatelyData()), { amount: 3000 });
}
exports.partialAdmissionWithImmediatePaymentDataV2 = partialAdmissionWithImmediatePaymentDataV2;
exports.partialAdmissionFromStatesPaidDefence = Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.basePartialAdmissionData), { amount: 100, paymentDeclaration: {
        paidDate: '2017-12-31',
        explanation: 'I paid in cash'
    }, defence: 'bla bla bla', timeline: {
        rows: [],
        comment: 'I do not agree'
    }, evidence: {
        rows: []
    }, freeMediation: 'no', mediationPhoneNumber: undefined, mediationContactPerson: undefined });
exports.partialAdmissionFromStatesPaidWithMediationDefence = Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.basePartialAdmissionData), { amount: 100, paymentDeclaration: {
        paidDate: '2017-12-31',
        explanation: 'I paid in cash'
    }, defence: 'bla bla bla', timeline: {
        rows: [],
        comment: 'I do not agree'
    }, evidence: {
        rows: []
    }, freeMediation: 'yes' });
exports.partialAdmissionAlreadyPaidData = Object.assign(Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.basePartialAdmissionData), exports.basePartialEvidencesAndTimeLines), { amount: 3000, defence: 'i have paid more than enough', paymentDeclaration: {
        paidDate: '2050-12-31',
        explanation: 'i have already paid enough'
    } });
exports.fullAdmissionWithPaymentBySetDateData = Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.baseFullAdmissionData), exports.basePayBySetDateData);
exports.fullAdmissionWithPaymentBySetDateDataInNext2days = Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.baseFullAdmissionData), { paymentIntention: {
        paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
        paymentDate: momentFactory_1.MomentFactory.currentDate().add(2, 'days').toISOString()
    } });
exports.fullAdmissionWithReasonablePaymentBySetDateData = Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.baseFullAdmissionData), { paymentIntention: {
        paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
        paymentDate: momentFactory_1.MomentFactory.currentDate().add(65, 'days').toISOString()
    } });
exports.partialAdmissionWithPaymentBySetDateData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.basePartialAdmissionData), exports.basePartialEvidencesAndTimeLines), { defence: 'i have paid more than enough' }), exports.basePayBySetDateData), { amount: 3000 });
exports.partialAdmissionWithPaymentByInstalmentsData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.basePartialAdmissionData), exports.basePartialEvidencesAndTimeLines), { defence: 'i have paid more than enough' }), exports.basePayByInstalmentsData), { amount: 3000 });
exports.fullAdmissionWithPaymentByInstalmentsData = Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.baseFullAdmissionData), exports.basePayByInstalmentsData);
exports.fullAdmissionWithPaymentByInstalmentsDataCompany = Object.assign(Object.assign(Object.assign({}, baseCompanyResponseData), exports.baseFullAdmissionData), exports.basePayByInstalmentsData);
exports.fullAdmissionWithPaymentByInstalmentsDataWithReasonablePaymentSchedule = Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.baseFullAdmissionData), { paymentIntention: {
        paymentOption: paymentOption_1.PaymentOption.INSTALMENTS,
        repaymentPlan: {
            instalmentAmount: 100,
            firstPaymentDate: momentFactory_1.MomentFactory.currentDate().add(80, 'days').toISOString(),
            paymentSchedule: paymentSchedule_1.PaymentSchedule.EACH_WEEK,
            completionDate: momentFactory_1.MomentFactory.currentDate().add(100, 'days').toISOString(),
            paymentLength: '1'
        }
    } });
exports.fullAdmissionWithPaymentByInstalmentsDataWithUnReasonablePaymentSchedule = Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.baseFullAdmissionData), { paymentIntention: {
        paymentOption: paymentOption_1.PaymentOption.INSTALMENTS,
        repaymentPlan: {
            instalmentAmount: 100,
            firstPaymentDate: momentFactory_1.MomentFactory.maxDate().toISOString(),
            paymentSchedule: paymentSchedule_1.PaymentSchedule.EACH_WEEK,
            completionDate: momentFactory_1.MomentFactory.maxDate().toISOString(),
            paymentLength: '1'
        }
    } });
exports.statementOfMeansWithMandatoryFieldsOnlyData = {
    bankAccounts: [
        {
            balance: 1000,
            joint: false,
            type: bankAccount_1.BankAccountType.CURRENT_ACCOUNT
        }
    ],
    disability: disabilityStatus_1.DisabilityStatus.NO,
    priorityDebts: [],
    residence: {
        type: residence_1.ResidenceType.OWN_HOME
    },
    employment: {
        unemployment: {
            retired: true
        }
    },
    incomes: [{
            amount: 200,
            frequency: paymentFrequency_1.PaymentFrequency.WEEK,
            type: income_1.IncomeType.CHILD_BENEFIT
        }],
    expenses: [{
            amount: 100,
            frequency: paymentFrequency_1.PaymentFrequency.MONTH,
            type: expense_1.ExpenseType.MORTGAGE
        }],
    carer: false
};
exports.statementOfMeansWithMandatoryFieldsAndNoDisposableIncome = {
    bankAccounts: [
        {
            balance: 0,
            joint: false,
            type: bankAccount_1.BankAccountType.CURRENT_ACCOUNT
        }
    ],
    disability: disabilityStatus_1.DisabilityStatus.NO,
    priorityDebts: [],
    residence: {
        type: residence_1.ResidenceType.OWN_HOME
    },
    employment: {
        unemployment: {
            retired: true
        }
    },
    incomes: [{
            amount: 10,
            frequency: paymentFrequency_1.PaymentFrequency.WEEK,
            type: income_1.IncomeType.CHILD_BENEFIT
        }],
    expenses: [{
            amount: 1000,
            frequency: paymentFrequency_1.PaymentFrequency.MONTH,
            type: expense_1.ExpenseType.MORTGAGE
        }],
    carer: false
};
exports.statementOfMeansWithAllFieldsData = Object.assign(Object.assign({}, exports.statementOfMeansWithMandatoryFieldsOnlyData), { dependant: {
        children: [{
                ageGroupType: dependant_1.AgeGroupType.UNDER_11,
                numberOfChildren: 1
            }, {
                ageGroupType: dependant_1.AgeGroupType.BETWEEN_11_AND_15,
                numberOfChildren: 2
            }, {
                ageGroupType: dependant_1.AgeGroupType.BETWEEN_16_AND_19,
                numberOfChildren: 3,
                numberOfChildrenLivingWithYou: 3
            }],
        otherDependants: {
            numberOfPeople: 5,
            details: 'Colleagues',
            anyDisabled: false
        },
        anyDisabledChildren: false
    }, employment: {
        employers: [{
                jobTitle: 'Service manager',
                name: 'HMCTS'
            }],
        selfEmployment: {
            jobTitle: 'Director',
            annualTurnover: 100000,
            onTaxPayments: {
                amountYouOwe: 100,
                reason: 'Various taxes'
            }
        }
    }, debts: [{
            description: 'Hard to tell',
            totalOwed: 1000,
            monthlyPayments: 100
        }], courtOrders: [{
            claimNumber: '000MC001',
            amountOwed: 100,
            monthlyInstalmentAmount: 10
        }], carer: true });
exports.fullAdmissionWithSoMPaymentBySetDate = Object.assign(Object.assign({}, exports.fullAdmissionWithPaymentBySetDateData), { statementOfMeans: Object.assign({}, exports.statementOfMeansWithAllFieldsData) });
exports.fullAdmissionWithSoMPaymentBySetDateInNext2Days = Object.assign(Object.assign({}, exports.fullAdmissionWithPaymentBySetDateDataInNext2days), { statementOfMeans: Object.assign({}, exports.statementOfMeansWithAllFieldsData) });
exports.fullAdmissionWithSoMReasonablePaymentBySetDateAndNoDisposableIncome = Object.assign(Object.assign({}, exports.fullAdmissionWithReasonablePaymentBySetDateData), { statementOfMeans: Object.assign({}, exports.statementOfMeansWithMandatoryFieldsAndNoDisposableIncome) });
exports.fullAdmissionWithSoMPaymentByInstalmentsData = Object.assign(Object.assign({}, exports.fullAdmissionWithPaymentByInstalmentsData), { statementOfMeans: Object.assign({}, exports.statementOfMeansWithAllFieldsData) });
exports.fullAdmissionWithSoMPaymentByInstalmentsDataCompany = Object.assign(Object.assign({}, exports.fullAdmissionWithPaymentByInstalmentsDataCompany), { statementOfMeans: Object.assign({}, exports.statementOfMeansWithAllFieldsData) });
exports.fullAdmissionWithSoMPaymentByInstalmentsDataWithReasonablePaymentSchedule = Object.assign(Object.assign({}, exports.fullAdmissionWithPaymentByInstalmentsDataWithReasonablePaymentSchedule), { statementOfMeans: Object.assign({}, exports.statementOfMeansWithMandatoryFieldsOnlyData) });
exports.fullAdmissionWithSoMPaymentByInstalmentsDataWithUnreasonablePaymentSchedule = Object.assign(Object.assign({}, exports.fullAdmissionWithPaymentByInstalmentsDataWithUnReasonablePaymentSchedule), { statementOfMeans: Object.assign({}, exports.statementOfMeansWithMandatoryFieldsOnlyData) });
exports.fullAdmissionWithSoMPaymentByInstalmentsDataWithNoDisposableIncome = Object.assign(Object.assign({}, exports.fullAdmissionWithPaymentByInstalmentsDataWithReasonablePaymentSchedule), { statementOfMeans: Object.assign({}, exports.statementOfMeansWithMandatoryFieldsAndNoDisposableIncome) });
exports.partialAdmissionWithSoMPaymentBySetDateData = Object.assign(Object.assign({}, exports.partialAdmissionWithPaymentBySetDateData), { statementOfMeans: Object.assign({}, exports.statementOfMeansWithAllFieldsData) });
exports.partialAdmissionWithPaymentBySetDateCompanyData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, baseCompanyResponseData), exports.basePartialAdmissionData), exports.basePartialEvidencesAndTimeLines), { defence: 'i have paid more than enough' }), exports.basePayBySetDateData), { amount: 3000 });
function fullAdmissionWithPaymentByInstalmentsDataPaymentDateBeforeMonth() {
    return Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.baseFullAdmissionData), { paymentIntention: {
            paymentOption: paymentOption_1.PaymentOption.INSTALMENTS,
            repaymentPlan: {
                instalmentAmount: 100,
                firstPaymentDate: momentFactory_1.MomentFactory.currentDate().add(10, 'days'),
                paymentSchedule: paymentSchedule_1.PaymentSchedule.EACH_WEEK
            }
        } });
}
exports.fullAdmissionWithPaymentByInstalmentsDataPaymentDateBeforeMonth = fullAdmissionWithPaymentByInstalmentsDataPaymentDateBeforeMonth;
function partialAdmissionWithPaymentByInstalmentsDataPaymentDateAfterMonth() {
    return Object.assign(Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.basePartialAdmissionData), exports.basePartialEvidencesAndTimeLines), { defence: 'i have paid more than enough', paymentIntention: {
            paymentOption: paymentOption_1.PaymentOption.INSTALMENTS,
            repaymentPlan: {
                instalmentAmount: 100,
                firstPaymentDate: momentFactory_1.MomentFactory.currentDate().add(50, 'days'),
                paymentSchedule: paymentSchedule_1.PaymentSchedule.EACH_WEEK
            }
        }, amount: 3000 });
}
exports.partialAdmissionWithPaymentByInstalmentsDataPaymentDateAfterMonth = partialAdmissionWithPaymentByInstalmentsDataPaymentDateAfterMonth;
function fullAdmissionWithPaymentBySetDateDataPaymentDateAfterMonth() {
    return Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.baseFullAdmissionData), { paymentIntention: {
            paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
            paymentDate: momentFactory_1.MomentFactory.currentDate().add(50, 'days')
        } });
}
exports.fullAdmissionWithPaymentBySetDateDataPaymentDateAfterMonth = fullAdmissionWithPaymentBySetDateDataPaymentDateAfterMonth;
function partialAdmissionWithPaymentBySetDateDataPaymentDateBeforeMonth() {
    return Object.assign(Object.assign(Object.assign(Object.assign({}, exports.baseResponseData), exports.basePartialAdmissionData), exports.basePartialEvidencesAndTimeLines), { defence: 'i have paid more than enough', paymentIntention: {
            paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
            paymentDate: momentFactory_1.MomentFactory.currentDate().add(10, 'days')
        }, amount: 3000 });
}
exports.partialAdmissionWithPaymentBySetDateDataPaymentDateBeforeMonth = partialAdmissionWithPaymentBySetDateDataPaymentDateBeforeMonth;
exports.fullDefenceWithStatesPaidGreaterThanClaimAmount = Object.assign(Object.assign({}, exports.defenceWithAmountClaimedAlreadyPaidData), { paymentDeclaration: {
        paidDate: '2017-12-31',
        paidAmount: '20000',
        explanation: 'I paid in cash'
    } });
exports.fullDefenceData = Object.assign({}, exports.baseDefenceData);
exports.fullDefenceWithStatesLessThanClaimAmount = Object.assign(Object.assign({}, exports.defenceWithAmountClaimedAlreadyPaidData), { paymentDeclaration: {
        paidDate: '2017-12-31',
        paidAmount: '80',
        explanation: 'I paid in cash'
    }, responseType: 'PART_ADMISSION' });
exports.fullDefenceWithStatesLessThanClaimAmountWithMediation = Object.assign(Object.assign({}, exports.defenceWithAmountClaimedAlreadyPaidData), { paymentDeclaration: {
        paidDate: '2017-12-31',
        paidAmount: '80',
        explanation: 'I paid in cash'
    }, responseType: 'PART_ADMISSION', freeMediation: 'yes' });
