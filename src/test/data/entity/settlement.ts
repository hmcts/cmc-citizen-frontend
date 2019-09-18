import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { MomentFactory } from 'shared/momentFactory'

export const claim = claimStoreServiceMock.sampleClaimIssueObj

export const responses = {
  fullRejection: {
    response: claimStoreServiceMock.sampleFullDefenceRejectEntirely.response,
    respondedAt: MomentFactory.currentDateTime().subtract(10, 'days'),
    directionsQuestionnaireDeadline: MomentFactory.currentDate().add(19, 'days')
  },
  partialAdmission: {
    response: claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj.response,
    respondedAt: MomentFactory.currentDateTime().subtract(10, 'days')
  },
  fullAdmission: {
    response: claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj.response,
    respondedAt: MomentFactory.currentDateTime().subtract(10, 'days')
  }
}

export const dateIn3Months = MomentFactory.currentDate().add(3, 'months')
export const dateIn6Months = MomentFactory.currentDate().add(6, 'months')

export const claimantResponses = {
  acceptBySettlement: {
    claimantResponse: {
      type: 'ACCEPTATION',
      formaliseOption: 'SETTLEMENT'
    },
    claimantRespondedAt: MomentFactory.currentDateTime().toISOString()
  },
  acceptWithNewPlan: {
    claimantResponse: {
      type: 'ACCEPTATION',
      formaliseOption: 'SETTLEMENT',
      courtDetermination: {
        decisionType: 'CLAIMANT',
        courtDecision: {
          paymentDate: dateIn6Months.toISOString(),
          paymentOption: 'BY_SPECIFIED_DATE'
        },
        disposableIncome: 1749.1,
        courtPaymentIntention: {
          paymentDate: dateIn3Months.toISOString(),
          paymentOption: 'BY_SPECIFIED_DATE'
        }
      },
      claimantPaymentIntention: {
        paymentDate: dateIn6Months.toISOString(),
        paymentOption: 'BY_SPECIFIED_DATE'
      }
    },
    claimantRespondedAt: MomentFactory.currentDate().toISOString()
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
            completionDate: dateIn6Months.toISOString(),
            paymentSchedule: 'EVERY_MONTH',
            firstPaymentDate: dateIn3Months.toISOString(),
            instalmentAmount: 49.1
          }
        },
        disposableIncome: 49.1,
        courtPaymentIntention: {
          paymentDate: dateIn6Months.toISOString(),
          paymentOption: 'BY_SPECIFIED_DATE'
        }
      },
      claimantPaymentIntention: {
        paymentDate: dateIn3Months.toISOString(),
        paymentOption: 'IMMEDIATELY'
      }
    },
    claimantRespondedAt: MomentFactory.currentDate().toISOString()
  }
}

export const partyStatement = {
  byDefendant: {
    offeringPaymentBySetDate: {
      type: 'OFFER',
      offer: {
        completionDate: dateIn3Months.toISOString(),
        paymentIntention: {
          paymentDate: dateIn3Months.toISOString(),
          paymentOption: 'BY_SPECIFIED_DATE'
        }
      },
      madeBy: 'DEFENDANT'
    },
    offeringNonMonetarySettlement: {
      type: 'OFFER',
      offer: {
        content: 'I will send pigeons',
        completionDate: dateIn3Months.toISOString()
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
        completionDate: dateIn3Months.toISOString(),
        paymentIntention: {
          paymentDate: dateIn3Months.toISOString(),
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
        completionDate: dateIn6Months.toISOString(),
        paymentIntention: {
          paymentOption: 'INSTALMENTS',
          repaymentPlan: {
            paymentLength: '3 months',
            completionDate: dateIn6Months.toISOString(),
            paymentSchedule: 'EVERY_MONTH',
            firstPaymentDate: dateIn3Months.toISOString(),
            instalmentAmount: 49.1
          }
        }
      },
      madeBy: 'COURT'
    }
  }
}

export const payBySetDateSettlementReachedPartyStatements = {
  settlement: {
    partyStatements: [
      partyStatement.byDefendant.offeringPaymentBySetDate,
      partyStatement.byClaimant.accepting,
      partyStatement.byDefendant.countersigning
    ]
  },
  settlementReachedAt: MomentFactory.currentDateTime(),
  countyCourtJudgment: undefined
}

export const nonMonetaryOfferAwaitingClaimantResponsePartyStatements = {
  settlement: {
    partyStatements: [
      partyStatement.byDefendant.offeringNonMonetarySettlement
    ]
  },
  countyCourtJudgment: undefined
}

export const nonMonetaryOfferSettlementReachedPartyStatements = {
  settlement: {
    partyStatements: [
      partyStatement.byDefendant.offeringNonMonetarySettlement,
      partyStatement.byClaimant.accepting,
      partyStatement.byDefendant.countersigning
    ]
  },
  settlementReachedAt: MomentFactory.currentDateTime(),
  countyCourtJudgment: undefined
}

export const defendantRejectsSettlementPartyStatements = {
  settlement: {
    partyStatements: [
      partyStatement.byClaimant.offeringPaymentBySetDate,
      partyStatement.byClaimant.accepting,
      partyStatement.byDefendant.rejecting
    ]
  },
  settlementReachedAt: MomentFactory.currentDateTime(),
  countyCourtJudgment: undefined
}

export const claimantAcceptsCourtOfferPartyStatements = {
  settlement: {
    partyStatements: [
      partyStatement.byCourt.offeringPaymentByInstalments,
      partyStatement.byClaimant.accepting
    ]
  },
  settlementReachedAt: undefined,
  countyCourtJudgment: undefined
}
