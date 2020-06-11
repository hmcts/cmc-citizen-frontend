"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const momentFactory_1 = require("shared/momentFactory");
exports.claim = claimStoreServiceMock.sampleClaimIssueObj;
function responses() {
    return {
        fullRejection: {
            response: claimStoreServiceMock.sampleFullDefenceRejectEntirely.response,
            respondedAt: momentFactory_1.MomentFactory.currentDateTime().subtract(10, 'days'),
            directionsQuestionnaireDeadline: momentFactory_1.MomentFactory.currentDate().add(19, 'days')
        },
        partialAdmission: {
            response: claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj.response,
            respondedAt: momentFactory_1.MomentFactory.currentDateTime().subtract(10, 'days')
        },
        fullAdmission: {
            response: claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj.response,
            respondedAt: momentFactory_1.MomentFactory.currentDateTime().subtract(10, 'days')
        }
    };
}
exports.responses = responses;
function dateIn3Months() {
    return momentFactory_1.MomentFactory.currentDate().add(3, 'months');
}
function dateIn6Months() {
    return momentFactory_1.MomentFactory.currentDate().add(6, 'months');
}
function claimantResponses() {
    return {
        acceptBySettlement: {
            claimantResponse: {
                type: 'ACCEPTATION',
                formaliseOption: 'SETTLEMENT'
            },
            claimantRespondedAt: momentFactory_1.MomentFactory.currentDateTime().toISOString()
        },
        acceptWithNewPlan: {
            claimantResponse: {
                type: 'ACCEPTATION',
                formaliseOption: 'SETTLEMENT',
                courtDetermination: {
                    decisionType: 'CLAIMANT',
                    courtDecision: {
                        paymentDate: dateIn6Months().toISOString(),
                        paymentOption: 'BY_SPECIFIED_DATE'
                    },
                    disposableIncome: 1749.1,
                    courtPaymentIntention: {
                        paymentDate: dateIn3Months().toISOString(),
                        paymentOption: 'BY_SPECIFIED_DATE'
                    }
                },
                claimantPaymentIntention: {
                    paymentDate: dateIn6Months().toISOString(),
                    paymentOption: 'BY_SPECIFIED_DATE'
                }
            },
            claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().toISOString()
        },
        acceptsWithCourtPlan: {
            claimantResponse: {
                type: 'ACCEPTATION',
                formaliseOption: 'SETTLEMENT',
                courtDetermination: {
                    decisionType: 'COURT',
                    courtDecision: {
                        paymentOption: 'INSTALMENTS',
                        repaymentPlan: {
                            paymentLength: '3 months',
                            completionDate: dateIn6Months().toISOString(),
                            paymentSchedule: 'EVERY_MONTH',
                            firstPaymentDate: dateIn3Months().toISOString(),
                            instalmentAmount: 49.1
                        }
                    },
                    disposableIncome: 49.1,
                    courtPaymentIntention: {
                        paymentDate: dateIn6Months().toISOString(),
                        paymentOption: 'BY_SPECIFIED_DATE'
                    }
                },
                claimantPaymentIntention: {
                    paymentDate: dateIn3Months().toISOString(),
                    paymentOption: 'IMMEDIATELY'
                }
            },
            claimantRespondedAt: momentFactory_1.MomentFactory.currentDate().toISOString()
        }
    };
}
exports.claimantResponses = claimantResponses;
function partyStatement() {
    return {
        byDefendant: {
            offeringPaymentBySetDate: {
                type: 'OFFER',
                offer: {
                    completionDate: dateIn3Months().toISOString(),
                    paymentIntention: {
                        paymentDate: dateIn3Months().toISOString(),
                        paymentOption: 'BY_SPECIFIED_DATE'
                    }
                },
                madeBy: 'DEFENDANT'
            },
            offeringNonMonetarySettlement: {
                type: 'OFFER',
                offer: {
                    content: 'I will send pigeons',
                    completionDate: dateIn3Months().toISOString()
                },
                madeBy: 'DEFENDANT'
            },
            countersigning: {
                type: 'COUNTERSIGNATURE',
                madeBy: 'DEFENDANT'
            },
            rejecting: {
                type: 'REJECTION',
                madeBy: 'DEFENDANT'
            }
        },
        byClaimant: {
            accepting: {
                type: 'ACCEPTATION',
                madeBy: 'CLAIMANT'
            },
            offeringPaymentBySetDate: {
                type: 'OFFER',
                offer: {
                    completionDate: dateIn3Months().toISOString(),
                    paymentIntention: {
                        paymentDate: dateIn3Months().toISOString(),
                        paymentOption: 'BY_SPECIFIED_DATE'
                    }
                },
                madeBy: 'CLAIMANT'
            }
        },
        byCourt: {
            offeringPaymentByInstalments: {
                type: 'OFFER',
                offer: {
                    completionDate: dateIn6Months().toISOString(),
                    paymentIntention: {
                        paymentOption: 'INSTALMENTS',
                        repaymentPlan: {
                            paymentLength: '3 months',
                            completionDate: dateIn6Months().toISOString(),
                            paymentSchedule: 'EVERY_MONTH',
                            firstPaymentDate: dateIn3Months().toISOString(),
                            instalmentAmount: 49.1
                        }
                    }
                },
                madeBy: 'COURT'
            }
        }
    };
}
function payBySetDateSettlementReachedPartyStatements() {
    return {
        settlement: {
            partyStatements: [
                partyStatement().byDefendant.offeringPaymentBySetDate,
                partyStatement().byClaimant.accepting,
                partyStatement().byDefendant.countersigning
            ]
        },
        settlementReachedAt: momentFactory_1.MomentFactory.currentDateTime(),
        countyCourtJudgment: undefined
    };
}
exports.payBySetDateSettlementReachedPartyStatements = payBySetDateSettlementReachedPartyStatements;
function nonMonetaryOfferAwaitingClaimantResponsePartyStatements() {
    return {
        settlement: {
            partyStatements: [
                partyStatement().byDefendant.offeringNonMonetarySettlement
            ]
        },
        countyCourtJudgment: undefined
    };
}
exports.nonMonetaryOfferAwaitingClaimantResponsePartyStatements = nonMonetaryOfferAwaitingClaimantResponsePartyStatements;
function nonMonetaryOfferSettlementReachedPartyStatements() {
    return {
        settlement: {
            partyStatements: [
                partyStatement().byDefendant.offeringNonMonetarySettlement,
                partyStatement().byClaimant.accepting,
                partyStatement().byDefendant.countersigning
            ]
        },
        settlementReachedAt: momentFactory_1.MomentFactory.currentDateTime(),
        countyCourtJudgment: undefined
    };
}
exports.nonMonetaryOfferSettlementReachedPartyStatements = nonMonetaryOfferSettlementReachedPartyStatements;
function defendantRejectsSettlementPartyStatements() {
    return {
        settlement: {
            partyStatements: [
                partyStatement().byClaimant.offeringPaymentBySetDate,
                partyStatement().byClaimant.accepting,
                partyStatement().byDefendant.rejecting
            ]
        },
        settlementReachedAt: momentFactory_1.MomentFactory.currentDateTime(),
        countyCourtJudgment: undefined
    };
}
exports.defendantRejectsSettlementPartyStatements = defendantRejectsSettlementPartyStatements;
function claimantAcceptsCourtOfferPartyStatements() {
    return {
        settlement: {
            partyStatements: [
                partyStatement().byCourt.offeringPaymentByInstalments,
                partyStatement().byClaimant.accepting
            ]
        },
        settlementReachedAt: undefined,
        countyCourtJudgment: undefined
    };
}
exports.claimantAcceptsCourtOfferPartyStatements = claimantAcceptsCourtOfferPartyStatements;
