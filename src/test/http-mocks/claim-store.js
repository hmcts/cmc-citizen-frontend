"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const mock = require("nock");
const HttpStatus = require("http-status-codes");
const statementType_1 = require("features/offer/form/models/statementType");
const madeBy_1 = require("claims/models/madeBy");
const interestEndDate_1 = require("claim/form/models/interestEndDate");
const interestDateType_1 = require("common/interestDateType");
const interestType_1 = require("claims/models/interestType");
const momentFactory_1 = require("shared/momentFactory");
const responseData_1 = require("test/data/entity/responseData");
const paymentOption_1 = require("claims/models/paymentOption");
const paymentSchedule_1 = require("claims/models/response/core/paymentSchedule");
const party_1 = require("test/data/entity/party");
const serviceBaseURL = config.get('claim-store.url');
const externalIdPattern = '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}';
exports.sampleClaimIssueCommonObj = {
    id: 1,
    submitterId: '1',
    submitterEmail: 'claimant@example.com',
    externalId: '400f4c57-9684-49c0-adb4-4cf46579d6dc',
    defendantId: '123',
    referenceNumber: '000MC050',
    createdAt: momentFactory_1.MomentFactory.currentDateTime(),
    issuedOn: '2017-07-25',
    totalAmountTillToday: 200,
    totalAmountTillDateOfIssue: 200,
    moreTimeRequested: false,
    responseDeadline: '2017-08-08',
    features: ['admissions']
};
exports.sampleClaimIssueOrgVOrgObj = Object.assign(Object.assign({}, exports.sampleClaimIssueCommonObj), { claim: {
        claimants: [
            Object.assign({}, party_1.organisation)
        ],
        defendants: [
            Object.assign({}, party_1.organisation)
        ],
        payment: {
            id: '12',
            amount: 2500,
            state: { status: 'failed' }
        },
        amount: {
            type: 'breakdown',
            rows: [{ reason: 'Reason', amount: 200 }]
        },
        interest: {
            type: interestType_1.InterestType.STANDARD,
            rate: 10,
            reason: 'Special case',
            interestDate: {
                type: interestDateType_1.InterestDateType.SUBMISSION,
                endDateType: interestEndDate_1.InterestEndDateOption.SETTLED_OR_JUDGMENT
            }
        },
        reason: 'Because I can',
        feeAmountInPennies: 2500,
        timeline: { rows: [{ date: 'a', description: 'b' }] }
    } });
exports.sampleClaimIssueOrgVOrgPhone = Object.assign(Object.assign({}, exports.sampleClaimIssueCommonObj), { claim: {
        claimants: [
            Object.assign({}, party_1.organisation)
        ],
        defendants: [
            Object.assign({}, party_1.organisationWithPhone)
        ]
    } });
exports.sampleClaimIssueObj = {
    id: 1,
    submitterId: '1',
    submitterEmail: 'claimant@example.com',
    externalId: '400f4c57-9684-49c0-adb4-4cf46579d6dc',
    defendantId: '123',
    referenceNumber: '000MC050',
    createdAt: momentFactory_1.MomentFactory.currentDateTime(),
    issuedOn: '2017-07-25',
    totalAmountTillToday: 200,
    totalAmountTillDateOfIssue: 200,
    moreTimeRequested: false,
    claim: {
        claimants: [
            {
                type: 'individual',
                name: 'John Smith',
                address: {
                    line1: 'line1',
                    line2: 'line2',
                    city: 'city',
                    postcode: 'bb127nq'
                },
                dateOfBirth: '1990-02-17'
            }
        ],
        defendants: [
            {
                type: 'individual',
                name: 'John Doe',
                address: {
                    line1: 'line1',
                    line2: 'line2',
                    city: 'city',
                    postcode: 'bb127nq'
                }
            }
        ],
        payment: {
            id: '12',
            amount: 2500,
            state: { status: 'failed' }
        },
        amount: {
            type: 'breakdown',
            rows: [{ reason: 'Reason', amount: 200 }]
        },
        interest: {
            type: interestType_1.InterestType.STANDARD,
            rate: 10,
            reason: 'Special case',
            interestDate: {
                type: interestDateType_1.InterestDateType.SUBMISSION,
                endDateType: interestEndDate_1.InterestEndDateOption.SETTLED_OR_JUDGMENT
            }
        },
        reason: 'Because I can',
        feeAmountInPennies: 2500,
        timeline: { rows: [{ date: 'a', description: 'b' }] }
    },
    responseDeadline: momentFactory_1.MomentFactory.currentDate().add(19, 'days'),
    intentionToProceedDeadline: momentFactory_1.MomentFactory.currentDateTime().add(33, 'days'),
    features: ['admissions']
};
exports.paymentResponse = {
    nextUrl: 'http://localhost/payment-page'
};
exports.sampleClaimObj = {
    id: 1,
    ccdCaseId: 1,
    submitterId: '1',
    submitterEmail: 'claimant@example.com',
    externalId: '400f4c57-9684-49c0-adb4-4cf46579d6dc',
    defendantId: '123',
    referenceNumber: '000MC000',
    createdAt: momentFactory_1.MomentFactory.currentDateTime(),
    issuedOn: '2019-09-25',
    totalAmountTillToday: 200,
    totalAmountTillDateOfIssue: 200,
    moreTimeRequested: false,
    claim: {
        claimants: [
            {
                type: 'individual',
                name: 'John Smith',
                address: {
                    line1: 'line1',
                    line2: 'line2',
                    city: 'city',
                    postcode: 'bb127nq'
                },
                dateOfBirth: '1990-02-17'
            }
        ],
        defendants: [
            {
                type: 'individual',
                name: 'John Doe',
                email: 'johndoe@example.com',
                address: {
                    line1: 'line1',
                    line2: 'line2',
                    city: 'city',
                    postcode: 'bb127nq'
                }
            }
        ],
        payment: {
            id: '12',
            amount: 2500,
            state: { status: 'failed' }
        },
        amount: {
            type: 'breakdown',
            rows: [{ reason: 'Reason', amount: 200 }]
        },
        interest: {
            type: interestType_1.InterestType.STANDARD,
            rate: 10,
            reason: 'Special case',
            interestDate: {
                type: interestDateType_1.InterestDateType.SUBMISSION,
                endDateType: interestEndDate_1.InterestEndDateOption.SETTLED_OR_JUDGMENT
            }
        },
        reason: 'Because I can',
        feeAmountInPennies: 2500,
        timeline: { rows: [{ date: 'a', description: 'b' }] }
    },
    responseDeadline: '2017-08-08',
    countyCourtJudgment: {
        defendantDateOfBirth: '1990-11-01',
        paidAmount: 2,
        paymentOption: 'IMMEDIATELY'
    },
    settlement: {
        partyStatements: [
            {
                type: statementType_1.StatementType.OFFER.value,
                madeBy: madeBy_1.MadeBy.DEFENDANT.value,
                offer: { content: 'offer text', completionDate: '2017-08-08' }
            }
        ]
    },
    intentionToProceedDeadline: momentFactory_1.MomentFactory.currentDateTime().add(33, 'days'),
    features: ['admissions']
};
exports.settlementWithInstalmentsAndAcceptation = {
    settlement: {
        partyStatements: [
            {
                type: statementType_1.StatementType.OFFER.value,
                madeBy: madeBy_1.MadeBy.DEFENDANT.value,
                offer: {
                    content: 'offer text',
                    completionDate: '2017-08-08',
                    paymentIntention: {
                        paymentOption: paymentOption_1.PaymentOption.INSTALMENTS,
                        repaymentPlan: {
                            instalmentAmount: 100,
                            firstPaymentDate: '2018-10-01',
                            paymentSchedule: paymentSchedule_1.PaymentSchedule.EACH_WEEK,
                            completionDate: '2019-02-01',
                            paymentLength: '1'
                        }
                    }
                }
            },
            {
                madeBy: madeBy_1.MadeBy.DEFENDANT.value,
                type: 'COUNTERSIGNATURE'
            }
        ]
    }
};
exports.settlementWithSetDateAndAcceptation = {
    settlement: {
        partyStatements: [
            {
                type: statementType_1.StatementType.OFFER.value,
                madeBy: madeBy_1.MadeBy.DEFENDANT.value,
                offer: {
                    content: 'offer text',
                    completionDate: '2017-08-08',
                    paymentIntention: {
                        paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
                        paymentDate: '2010-12-31'
                    }
                }
            },
            {
                type: 'ACCEPTATION',
                madeBy: madeBy_1.MadeBy.CLAIMANT.value
            },
            {
                madeBy: madeBy_1.MadeBy.DEFENDANT.value,
                type: 'COUNTERSIGNATURE'
            }
        ]
    }
};
exports.partySettlementWithInstalmentsAndRejection = {
    partyStatements: [{
            type: 'OFFER',
            offer: {
                completionDate: momentFactory_1.MomentFactory.currentDate().add(2, 'years'),
                paymentIntention: {
                    'paymentDate': momentFactory_1.MomentFactory.currentDate().add(2, 'years'),
                    'paymentOption': 'BY_SPECIFIED_DATE'
                }
            },
            madeBy: 'DEFENDANT'
        }, {
            type: 'ACCEPTATION',
            madeBy: 'CLAIMANT'
        }, { type: 'REJECTION', 'madeBy': 'DEFENDANT' }]
};
exports.partySettlementWithSetDateAndRejection = {
    partyStatements: [{
            type: 'OFFER',
            offer: {
                completionDate: momentFactory_1.MomentFactory.currentDate().add(2, 'years'),
                paymentIntention: { 'paymentDate': '2023-01-01', 'paymentOption': 'BY_SPECIFIED_DATE' }
            },
            madeBy: 'DEFENDANT'
        }, {
            type: 'ACCEPTATION',
            madeBy: 'CLAIMANT'
        }, { type: 'REJECTION', 'madeBy': 'DEFENDANT' }]
};
exports.partySettlementWithSetDateAndAcceptation = {
    partyStatements: [{
            type: 'OFFER',
            offer: {
                completionDate: momentFactory_1.MomentFactory.currentDate().add(2, 'years'),
                paymentIntention: {
                    paymentDate: momentFactory_1.MomentFactory.currentDate().add(2, 'years'),
                    paymentOption: 'BY_SPECIFIED_DATE'
                }
            },
            madeBy: 'DEFENDANT'
        }, {
            type: 'ACCEPTATION',
            madeBy: 'CLAIMANT'
        }]
};
exports.settlementAndSettlementReachedAt = Object.assign({ settlementReachedAt: '2017-07-25T22:45:51.785' }, this.settlementWithInstalmentsAndAcceptation);
exports.sampleDefendantResponseObj = {
    respondedAt: '2017-07-25T22:45:51.785',
    response: {
        responseType: 'FULL_DEFENCE',
        defenceType: 'DISPUTE',
        defence: 'I reject this money claim',
        freeMediation: 'yes',
        defendant: {
            type: 'individual',
            name: 'full name',
            address: {
                line1: 'line1',
                line2: 'line2',
                city: 'city',
                postcode: 'bb127nq'
            }
        }
    }
};
exports.sampleDefendantResponseWithDQAndMediationObj = {
    respondedAt: '2017-07-25T22:45:51.785',
    response: {
        responseType: 'FULL_DEFENCE',
        defenceType: 'DISPUTE',
        defence: 'I reject this money claim',
        freeMediation: 'yes',
        defendant: {
            type: 'individual',
            name: 'full name',
            address: {
                line1: 'line1',
                line2: 'line2',
                city: 'city',
                postcode: 'bb127nq'
            }
        },
        directionsQuestionnaire: {
            hearingLoop: 'NO',
            selfWitness: 'NO',
            disabledAccess: 'NO',
            hearingLocation: 'Central London County Court',
            hearingLocationOption: 'SUGGESTED_COURT'
        }
    }
};
exports.sampleDefendantResponseWithoutDQAndWithMediationObj = {
    respondedAt: '2017-07-25T22:45:51.785',
    response: {
        responseType: 'FULL_DEFENCE',
        defenceType: 'DISPUTE',
        defence: 'I reject this money claim',
        freeMediation: 'yes',
        defendant: {
            type: 'individual',
            name: 'full name',
            address: {
                line1: 'line1',
                line2: 'line2',
                city: 'city',
                postcode: 'bb127nq'
            }
        }
    }
};
exports.sampleDefendantResponseWithoutDQAndWithoutMediationObj = {
    respondedAt: '2017-07-25T22:45:51.785',
    response: {
        responseType: 'FULL_DEFENCE',
        defenceType: 'DISPUTE',
        defence: 'I reject this money claim',
        freeMediation: 'no',
        defendant: {
            type: 'individual',
            name: 'full name',
            address: {
                line1: 'line1',
                line2: 'line2',
                city: 'city',
                postcode: 'bb127nq'
            }
        }
    },
    directionsQuestionnaireDeadline: momentFactory_1.MomentFactory.currentDate().add(12, 'days')
};
exports.sampleDefendantResponseWithDQAndNoMediationObj = {
    respondedAt: '2017-07-25T22:45:51.785',
    response: {
        responseType: 'FULL_DEFENCE',
        defenceType: 'DISPUTE',
        defence: 'I reject this money claim',
        freeMediation: 'no',
        defendant: {
            type: 'individual',
            name: 'full name',
            address: {
                line1: 'line1',
                line2: 'line2',
                city: 'city',
                postcode: 'bb127nq'
            }
        },
        directionsQuestionnaire: {
            hearingLoop: 'NO',
            selfWitness: 'NO',
            disabledAccess: 'NO',
            hearingLocation: 'Central London County Court',
            hearingLocationOption: 'SUGGESTED_COURT'
        }
    }
};
exports.sampleDefendantResponseAlreadyPaidWithMediationObj = Object.assign(Object.assign({}, this.sampleClaimIssueObj), { respondedAt: '2017-07-25T22:45:51.785', response: {
        responseType: 'FULL_DEFENCE',
        defenceType: 'ALREADY_PAID',
        paymentDeclaration: {
            paidDate: '1999-01-01',
            paidAmount: 100,
            explanation: 'I paid you'
        },
        defence: 'I reject this money claim',
        freeMediation: 'yes',
        defendant: {
            type: 'individual',
            name: 'full name',
            address: {
                line1: 'line1',
                line2: 'line2',
                city: 'city',
                postcode: 'bb127nq'
            }
        }
    } });
exports.sampleDefendantResponseAlreadyPaidWithNoMediationObj = Object.assign(Object.assign({}, this.sampleClaimIssueObj), { respondedAt: '2017-07-25T22:45:51.785', response: {
        responseType: 'FULL_DEFENCE',
        defenceType: 'ALREADY_PAID',
        paymentDeclaration: {
            paidDate: '1999-01-01',
            paidAmount: 100,
            explanation: 'I paid you'
        },
        defence: 'I reject this money claim',
        freeMediation: 'no',
        defendant: {
            type: 'individual',
            name: 'full name',
            address: {
                line1: 'line1',
                line2: 'line2',
                city: 'city',
                postcode: 'bb127nq'
            }
        }
    } });
exports.samplePartialAdmissionWithPaymentBySetDateResponseObj = Object.assign(Object.assign({}, this.sampleClaimIssueObj), { respondedAt: '2017-07-25T22:45:51.785', claimantRespondedAt: '2017-07-25T22:45:51.785', response: responseData_1.partialAdmissionWithSoMPaymentBySetDateData });
exports.samplePartialAdmissionWithPaymentBySetDateCompanyData = {
    respondedAt: '2017-07-25T22:45:51.785',
    claimantRespondedAt: '2017-07-25T22:45:51.785',
    response: responseData_1.partialAdmissionWithPaymentBySetDateCompanyData
};
function samplePartialAdmissionWithPayImmediatelyData() {
    return Object.assign(Object.assign({}, this.sampleClaimIssueObj), { respondedAt: '2017-07-25T22:45:51.785', claimantRespondedAt: '2017-07-25T22:45:51.785', response: responseData_1.partialAdmissionWithImmediatePaymentData() });
}
exports.samplePartialAdmissionWithPayImmediatelyData = samplePartialAdmissionWithPayImmediatelyData;
function samplePartialAdmissionWithPayImmediatelyDataV2() {
    return Object.assign(Object.assign({}, this.sampleClaimIssueObj), { respondedAt: '2017-07-25T22:45:51.785', claimantRespondedAt: '2017-07-25T22:45:51.785', response: responseData_1.partialAdmissionWithImmediatePaymentDataV2() });
}
exports.samplePartialAdmissionWithPayImmediatelyDataV2 = samplePartialAdmissionWithPayImmediatelyDataV2;
exports.sampleFullAdmissionWithPaymentBySetDateResponseObj = {
    respondedAt: '2017-07-25T22:45:51.785',
    response: responseData_1.fullAdmissionWithSoMPaymentBySetDate
};
exports.sampleFullAdmissionWithPaymentBySetDateInNext2daysResponseObj = {
    respondedAt: '2017-07-25T22:45:51.785',
    response: responseData_1.fullAdmissionWithSoMPaymentBySetDateInNext2Days
};
exports.sampleFullAdmissionWithReasonablePaymentBySetDateResponseObjAndNoDisposableIncome = {
    respondedAt: '2017-07-25T22:45:51.785',
    response: responseData_1.fullAdmissionWithSoMReasonablePaymentBySetDateAndNoDisposableIncome
};
exports.sampleFullAdmissionWithPaymentByInstalmentsResponseObj = {
    respondedAt: '2017-07-25T22:45:51.785',
    response: responseData_1.fullAdmissionWithSoMPaymentByInstalmentsData
};
exports.sampleFullAdmissionWithPaymentByInstalmentsResponseObjCompanyData = {
    respondedAt: '2017-07-25T22:45:51.785',
    response: responseData_1.fullAdmissionWithSoMPaymentByInstalmentsDataCompany
};
exports.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithNoDisposableIncome = {
    respondedAt: '2017-07-25T22:45:51.785',
    response: responseData_1.fullAdmissionWithSoMPaymentByInstalmentsDataWithNoDisposableIncome
};
exports.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithReasonablePaymentSchedule = {
    respondedAt: '2017-07-25T22:45:51.785',
    response: responseData_1.fullAdmissionWithSoMPaymentByInstalmentsDataWithReasonablePaymentSchedule
};
exports.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithUnReasonablePaymentSchedule = {
    respondedAt: '2017-07-25T22:45:51.785',
    response: responseData_1.fullAdmissionWithSoMPaymentByInstalmentsDataWithUnreasonablePaymentSchedule
};
exports.sampleFullDefenceRejectEntirely = Object.assign(Object.assign({}, this.sampleClaimIssueObj), { respondedAt: '2017-07-25T22:45:51.785', response: responseData_1.defenceWithDisputeData });
exports.sampleFullDefenceWithStatesPaidGreaterThanClaimAmount = {
    respondedAt: '2017-07-25T22:45:51.785',
    response: responseData_1.fullDefenceWithStatesPaidGreaterThanClaimAmount
};
exports.sampleFullDefenceWithStatesPaidLessThanClaimAmount = {
    respondedAt: '2017-07-25T22:45:51.785',
    response: responseData_1.fullDefenceWithStatesLessThanClaimAmount
};
exports.sampleFullDefenceWithStatesPaidLessThanClaimAmountWithMediation = {
    respondedAt: '2017-07-25T22:45:51.785',
    response: responseData_1.fullDefenceWithStatesLessThanClaimAmountWithMediation
};
function mockCalculateInterestRate(expected) {
    return mock(serviceBaseURL)
        .get('/interest/calculate')
        .query(true)
        .reply(HttpStatus.OK, { amount: expected });
}
exports.mockCalculateInterestRate = mockCalculateInterestRate;
function mockNextWorkingDay(expected) {
    return mock(serviceBaseURL)
        .get('/calendar/next-working-day')
        .query(true)
        .reply(HttpStatus.OK, { nextWorkingDay: expected });
}
exports.mockNextWorkingDay = mockNextWorkingDay;
function rejectNextWorkingDay(expected) {
    return mock(serviceBaseURL)
        .get('/calendar/next-working-day')
        .query({ date: expected.format() })
        .reply(400);
}
exports.rejectNextWorkingDay = rejectNextWorkingDay;
function resolveRetrieveClaimIssueByExternalId(claimOverride) {
    return mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/' + externalIdPattern))
        .reply(HttpStatus.OK, Object.assign(Object.assign({}, exports.sampleClaimIssueObj), claimOverride));
}
exports.resolveRetrieveClaimIssueByExternalId = resolveRetrieveClaimIssueByExternalId;
function resolveRetrieveClaimByExternalId(claimOverride) {
    return mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/' + externalIdPattern))
        .reply(HttpStatus.OK, Object.assign(Object.assign({}, exports.sampleClaimObj), claimOverride));
}
exports.resolveRetrieveClaimByExternalId = resolveRetrieveClaimByExternalId;
function resolveRetrieveByExternalId(claim = exports.sampleClaimObj, claimOverride) {
    return mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/' + externalIdPattern))
        .reply(HttpStatus.OK, Object.assign(Object.assign({}, claim), claimOverride));
}
exports.resolveRetrieveByExternalId = resolveRetrieveByExternalId;
function resolveRetrieveClaimBySampleExternalId(sampleData) {
    return mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/' + externalIdPattern))
        .reply(HttpStatus.OK, Object.assign({}, sampleData));
}
exports.resolveRetrieveClaimBySampleExternalId = resolveRetrieveClaimBySampleExternalId;
function resolveRetrieveClaimByExternalIdWithResponse(override) {
    return mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/' + externalIdPattern))
        .reply(HttpStatus.OK, Object.assign(Object.assign(Object.assign({}, exports.sampleClaimObj), exports.sampleDefendantResponseObj), override));
}
exports.resolveRetrieveClaimByExternalIdWithResponse = resolveRetrieveClaimByExternalIdWithResponse;
function resolveRetrieveClaimByExternalIdWithFullAdmissionAndSettlement(override) {
    return mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/' + externalIdPattern))
        .reply(HttpStatus.OK, Object.assign(Object.assign(Object.assign({}, exports.sampleClaimObj), exports.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithReasonablePaymentSchedule), override));
}
exports.resolveRetrieveClaimByExternalIdWithFullAdmissionAndSettlement = resolveRetrieveClaimByExternalIdWithFullAdmissionAndSettlement;
function rejectRetrieveClaimByExternalId(reason = 'Error') {
    mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/' + externalIdPattern))
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectRetrieveClaimByExternalId = rejectRetrieveClaimByExternalId;
function resolveRetrieveClaimByExternalIdTo404HttpCode(reason = 'Claim not found') {
    mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/' + externalIdPattern))
        .reply(HttpStatus.NOT_FOUND, reason);
}
exports.resolveRetrieveClaimByExternalIdTo404HttpCode = resolveRetrieveClaimByExternalIdTo404HttpCode;
function resolveRetrieveByClaimantId(claim = exports.sampleClaimObj, claimOverride) {
    mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/claimant/[0-9]+'))
        .reply(HttpStatus.OK, [Object.assign(Object.assign({}, claim), claimOverride)]);
}
exports.resolveRetrieveByClaimantId = resolveRetrieveByClaimantId;
function resolveRetrieveByClaimantIdToEmptyList() {
    mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/claimant/[0-9]+'))
        .reply(HttpStatus.OK, []);
}
exports.resolveRetrieveByClaimantIdToEmptyList = resolveRetrieveByClaimantIdToEmptyList;
function resolveRetrieveByDefendantIdToEmptyList() {
    mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/defendant/[0-9]+'))
        .reply(HttpStatus.OK, []);
}
exports.resolveRetrieveByDefendantIdToEmptyList = resolveRetrieveByDefendantIdToEmptyList;
function rejectRetrieveByClaimantId(reason) {
    mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/claimant/[0-9]+'))
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectRetrieveByClaimantId = rejectRetrieveByClaimantId;
function resolveIsClaimLinked(status) {
    mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/.+/defendant-link-status'))
        .reply(HttpStatus.OK, { linked: status });
}
exports.resolveIsClaimLinked = resolveIsClaimLinked;
function rejectIsClaimLinked() {
    mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/.+/defendant-link-status'))
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
}
exports.rejectIsClaimLinked = rejectIsClaimLinked;
function resolveRetrieveByLetterHolderId(referenceNumber, claimOverride) {
    return mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/letter/[0-9]+'))
        .reply(HttpStatus.OK, Object.assign(Object.assign(Object.assign({}, exports.sampleClaimObj), { referenceNumber: referenceNumber }), claimOverride));
}
exports.resolveRetrieveByLetterHolderId = resolveRetrieveByLetterHolderId;
function rejectRetrieveByLetterHolderId(reason) {
    mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/letter/[0-9]+'))
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectRetrieveByLetterHolderId = rejectRetrieveByLetterHolderId;
function resolveRetrieveByDefendantId(referenceNumber, defendantId, claim = exports.sampleClaimObj, claimOverride) {
    mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/defendant/[0-9]+'))
        .reply(HttpStatus.OK, [Object.assign(Object.assign(Object.assign({}, claim), { referenceNumber: referenceNumber, defendantId: defendantId }), claimOverride)]);
}
exports.resolveRetrieveByDefendantId = resolveRetrieveByDefendantId;
function rejectRetrieveByDefendantId(reason) {
    mock(`${serviceBaseURL}/claims`)
        .get(new RegExp('/defendant/[0-9]+'))
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectRetrieveByDefendantId = rejectRetrieveByDefendantId;
function resolveSaveResponse() {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp('/.+/defendant/[0-9]+'))
        .reply(HttpStatus.OK, Object.assign(Object.assign({}, exports.sampleClaimObj), { defendantId: '1' }));
}
exports.resolveSaveResponse = resolveSaveResponse;
function rejectSaveResponse(reason) {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp('/.+/defendant/[0-9]+'))
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectSaveResponse = rejectSaveResponse;
function resolveLinkDefendant() {
    mock(`${serviceBaseURL}/claims`)
        .put('/defendant/link')
        .reply(HttpStatus.OK);
}
exports.resolveLinkDefendant = resolveLinkDefendant;
function resolveRequestForMoreTime() {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp('/.+/request-more-time'))
        .reply(HttpStatus.OK);
}
exports.resolveRequestForMoreTime = resolveRequestForMoreTime;
function rejectRequestForMoreTime(reason) {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp('/.+/request-more-time'))
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectRequestForMoreTime = rejectRequestForMoreTime;
function resolveSaveClaimForUser() {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp('/[0-9]+'))
        .reply(HttpStatus.OK, Object.assign({}, exports.sampleClaimObj));
}
exports.resolveSaveClaimForUser = resolveSaveClaimForUser;
function rejectSaveClaimForUser(reason = 'HTTP error', status = HttpStatus.INTERNAL_SERVER_ERROR) {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp('/[0-9]+'))
        .reply(status, reason);
}
exports.rejectSaveClaimForUser = rejectSaveClaimForUser;
function resolveSaveCcjForExternalId() {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp('/' + externalIdPattern +
        '/county-court-judgment'))
        .reply(HttpStatus.OK, Object.assign({}, exports.sampleClaimObj));
}
exports.resolveSaveCcjForExternalId = resolveSaveCcjForExternalId;
function resolveSaveReDeterminationForExternalId(explanation) {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp('/' + externalIdPattern +
        '/re-determination'))
        .reply(HttpStatus.OK, { explanation: explanation, partyType: madeBy_1.MadeBy.CLAIMANT });
}
exports.resolveSaveReDeterminationForExternalId = resolveSaveReDeterminationForExternalId;
function rejectSaveReDeterminationForExternalId(reason = 'HTTP error') {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp('/.+/re-determination'))
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectSaveReDeterminationForExternalId = rejectSaveReDeterminationForExternalId;
function rejectSaveOfferForDefendant(reason = 'HTTP error') {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp('/.+/offers/defendant'))
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectSaveOfferForDefendant = rejectSaveOfferForDefendant;
function resolveSaveOffer() {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp('/.+/offers/defendant'))
        .reply(HttpStatus.CREATED);
}
exports.resolveSaveOffer = resolveSaveOffer;
function resolveCreateClaimCitizen(claimOverride) {
    return mock(`${serviceBaseURL}/claims`)
        .put('/create-citizen-claim')
        .reply(HttpStatus.OK, Object.assign(Object.assign({}, exports.sampleClaimObj), claimOverride));
}
exports.resolveCreateClaimCitizen = resolveCreateClaimCitizen;
function resolveSaveOrder() {
    const expectedData = Object.assign(Object.assign({}, this.sampleClaimIssueObj), { reviewOrder: {
            reason: 'some reason',
            requestedBy: madeBy_1.MadeBy.CLAIMANT,
            requestedAt: '2017-07-25T22:45:51.785'
        } });
    mock(`${serviceBaseURL}/claims`)
        .put(new RegExp('/' + externalIdPattern + '/review-order'))
        .reply(HttpStatus.OK, expectedData);
}
exports.resolveSaveOrder = resolveSaveOrder;
function resolveAcceptOffer(by = 'claimant') {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp(`/.+/offers/${by}/accept`))
        .reply(HttpStatus.CREATED);
}
exports.resolveAcceptOffer = resolveAcceptOffer;
function resolveRejectOffer(by = 'claimant') {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp(`/.+/offers/${by}/reject`))
        .reply(HttpStatus.CREATED);
}
exports.resolveRejectOffer = resolveRejectOffer;
function rejectSaveClaimantResponse(reason = 'HTTP error') {
    mock(`${serviceBaseURL}/responses`)
        .post(new RegExp('/.+/claimant/[0-9]+'))
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectSaveClaimantResponse = rejectSaveClaimantResponse;
function resolveCountersignOffer(by = 'defendant') {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp(`/.+/offers/${by}/countersign`))
        .reply(HttpStatus.CREATED);
}
exports.resolveCountersignOffer = resolveCountersignOffer;
function rejectSaveCcjForExternalId(reason = 'HTTP error') {
    mock(`${serviceBaseURL}/claims`)
        .post(new RegExp('/' + externalIdPattern +
        '/county-court-judgment'))
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectSaveCcjForExternalId = rejectSaveCcjForExternalId;
function rejectRetrieveDocument(reason) {
    mock(`${serviceBaseURL}/documents`)
        .get(new RegExp('/' + externalIdPattern))
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectRetrieveDocument = rejectRetrieveDocument;
function resolveRetrieveDocument() {
    mock(`${serviceBaseURL}/documents`)
        .get(new RegExp('/' + externalIdPattern))
        .reply(HttpStatus.OK);
}
exports.resolveRetrieveDocument = resolveRetrieveDocument;
function resolvePostponedDeadline(deadline) {
    return mock(`${serviceBaseURL}/deadline`)
        .get(new RegExp('/\\d{4}-\\d{2}-\\d{2}'))
        .reply(HttpStatus.OK, deadline);
}
exports.resolvePostponedDeadline = resolvePostponedDeadline;
function rejectPostponedDeadline(reason = 'HTTP error') {
    return mock(`${serviceBaseURL}/deadline`)
        .get(new RegExp('/\\d{4}-\\d{2}-\\d{2}'))
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectPostponedDeadline = rejectPostponedDeadline;
function resolveAddRolesToUser(role) {
    mock(`${serviceBaseURL}/user`)
        .post('/roles')
        .reply(HttpStatus.CREATED, { role: role });
}
exports.resolveAddRolesToUser = resolveAddRolesToUser;
function rejectAddRolesToUser(reason = 'HTTP error') {
    mock(`${serviceBaseURL}/user`)
        .post('/roles')
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectAddRolesToUser = rejectAddRolesToUser;
function resolveRetrieveUserRoles(...userRoles) {
    return mock(`${serviceBaseURL}/user`)
        .get('/roles')
        .reply(HttpStatus.OK, userRoles);
}
exports.resolveRetrieveUserRoles = resolveRetrieveUserRoles;
function rejectRetrieveUserRoles() {
    mock(`${serviceBaseURL}/user`)
        .get('/roles')
        .reply(HttpStatus.INTERNAL_SERVER_ERROR);
}
exports.rejectRetrieveUserRoles = rejectRetrieveUserRoles;
function resolveClaimantResponse() {
    mock(`${serviceBaseURL}/responses`)
        .post(new RegExp('/.+/claimant/[0-9]+'))
        .reply(HttpStatus.OK);
}
exports.resolveClaimantResponse = resolveClaimantResponse;
function resolveSavePaidInFull() {
    mock(`${serviceBaseURL}/claims`)
        .put(new RegExp('/' + externalIdPattern + '/paid-in-full'))
        .reply(HttpStatus.OK);
}
exports.resolveSavePaidInFull = resolveSavePaidInFull;
function resolveInitiatePayment(nextUrl) {
    return mock(`${serviceBaseURL}/claims`)
        .post('/initiate-citizen-payment')
        .reply(HttpStatus.OK, Object.assign(Object.assign({}, exports.paymentResponse), nextUrl));
}
exports.resolveInitiatePayment = resolveInitiatePayment;
function resolveResumePayment(nextUrl) {
    return mock(`${serviceBaseURL}/claims`)
        .put('/resume-citizen-payment')
        .reply(HttpStatus.OK, Object.assign(Object.assign({}, exports.paymentResponse), nextUrl));
}
exports.resolveResumePayment = resolveResumePayment;
