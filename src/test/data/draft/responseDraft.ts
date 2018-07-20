import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import { DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { HowMuchPaidClaimantOption } from 'response/form/models/howMuchPaidClaimant'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { ResponseType } from 'response/form/models/responseType'
import { BankAccountType } from 'response/form/models/statement-of-means/bankAccountType'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'
import { UnemploymentType } from 'response/form/models/statement-of-means/unemploymentType'
import { individualDetails } from 'test/data/draft/partyDetails'
import { AlreadyPaid } from 'response/form/models/alreadyPaid'
import { YesNoOption } from 'models/yesNoOption'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'
import { DefendantEvidence } from 'response/form/models/defendantEvidence'
import { WhyDoYouDisagree } from 'response/form/models/whyDoYouDisagree'

const baseResponseDraft = {
  defendantDetails: {
    partyDetails: individualDetails,
    mobilePhone: {
      number: '0700000000'
    },
    email: {
      address: 'user@example.com'
    }
  },
  moreTimeNeeded: {
    option: 'no'
  }
}

const baseDefenceDraft = {
  response: {
    type: {
      value: ResponseType.DEFENCE.value
    }
  },
  defence: {
    text: 'My defence'
  },
  freeMediation: {
    option: 'no'
  }
}

export const partiallyAdmittedDefenceWithWhyDoYouDisagreeCompleted = {
  ...baseResponseDraft,
  ...baseDefenceDraft,
  partialAdmission: { whyDoYouDisagree: new WhyDoYouDisagree('I am not sure') },
  timeline: new DefendantTimeline(),
  Evidence: new DefendantEvidence()
}

export const defenceWithDisputeDraft = {
  ...baseResponseDraft,
  ...baseDefenceDraft,
  rejectAllOfClaim: {
    option: RejectAllOfClaimOption.DISPUTE
  }
}

export const defenceWithAmountClaimedAlreadyPaidDraft = {
  ...baseResponseDraft,
  ...baseDefenceDraft,
  rejectAllOfClaim: {
    option: RejectAllOfClaimOption.ALREADY_PAID
  },
  howMuchPaidClaimant: {
    option: HowMuchPaidClaimantOption.AMOUNT_CLAIMED
  },
  whenDidYouPay: {
    date: {
      year: 2017,
      month: 12,
      day: 31
    },
    text: 'I paid in cash'
  }
}

const baseFullAdmissionDraft = {
  response: {
    type: {
      value: ResponseType.FULL_ADMISSION.value
    }
  }
}

const basePartialAdmissionDraft = {
  response: {
    type: {
      value: ResponseType.PART_ADMISSION.value
    }
  }
}

export const fullAdmissionWithImmediatePaymentDraft = {
  ...baseResponseDraft,
  ...baseFullAdmissionDraft,
  fullAdmission: {
    paymentOption: {
      option: DefendantPaymentType.IMMEDIATELY
    }
  }
}

export const basePartialFuturePaymentDetails = {
  alreadyPaid: {
    option: YesNoOption.YES
  } as AlreadyPaid,
  howMuchHaveYouPaid: {
    amount: 3000
  },
  whyDoYouDisagree: {
    text: 'i have paid more than enough'
  }
}

export const basePartialAlreadyPaidDetails = {
  alreadyPaid: {
    option: YesNoOption.YES
  } as AlreadyPaid,
  howMuchHaveYouPaid: {
    amount: 3000,
    date: {
      year: 2050,
      month: 12,
      day: 31
    },
    text: 'i have already paid enough'
  },
  whyDoYouDisagree: {
    text: 'i have paid more than enough'
  }
}

export const partialTimelineAndEvidences = {
  timeline: {
    rows: [
      {
        date: '1 May 2017',
        description: ' you might have signed a contract'
      }
    ],
    comment: ' you might have signed a contract'
  },
  evidence: {
    rows: [
      {
        type: {
          value: 'CONTRACTS_AND_AGREEMENTS',
          displayValue: 'Contracts and agreements'
        },
        description: ' you might have signed a contract'
      }
    ],
    comment: ' you might have signed a contract'
  }

}

export const partialAdmissionWithImmediatePaymentDraft = {
  ...baseResponseDraft,
  ...basePartialAdmissionDraft,
  partialAdmission: {
    ...basePartialFuturePaymentDetails,
    paymentOption: {
      option: DefendantPaymentType.IMMEDIATELY
    },
    ...partialTimelineAndEvidences
  }
}

export const partialAdmissionAlreadyPaidDraft = {
  ...baseResponseDraft,
  ...basePartialAdmissionDraft,
  partialAdmission: {
    ...basePartialAlreadyPaidDetails,
    ...partialTimelineAndEvidences
  }
}

export const fullAdmissionWithPaymentBySetDateDraft = {
  ...baseResponseDraft,
  ...baseFullAdmissionDraft,
  fullAdmission: {
    paymentOption: {
      option: DefendantPaymentType.BY_SET_DATE
    },
    paymentDate: {
      date: {
        year: 2050,
        month: 12,
        day: 31
      }
    }
  }
}

export const partialAdmissionWithPaymentBySetDateDraft = {
  ...baseResponseDraft,
  ...basePartialAdmissionDraft,
  partialAdmission: {
    ...basePartialFuturePaymentDetails,
    paymentOption: {
      option: DefendantPaymentType.BY_SET_DATE
    },
    paymentDate: {
      date: {
        year: 2050,
        month: 12,
        day: 31
      }
    },
    ...partialTimelineAndEvidences
  }
}

export const fullAdmissionWithPaymentByInstalmentsDraft = {
  ...baseResponseDraft,
  ...baseFullAdmissionDraft,
  fullAdmission: {
    paymentOption: {
      option: DefendantPaymentType.INSTALMENTS
    },
    paymentPlan: {
      instalmentAmount: 100,
      firstPaymentDate: {
        year: 2050,
        month: 12,
        day: 31
      },
      paymentSchedule: {
        value: PaymentSchedule.EACH_WEEK
      }
    }
  }
}

export const partialAdmissionWithPaymentByInstalmentsDraft = {
  ...baseResponseDraft,
  ...basePartialAdmissionDraft,
  partialAdmission: {
    ...basePartialFuturePaymentDetails,
    paymentOption: {
      option: DefendantPaymentType.INSTALMENTS
    },
    paymentPlan: {
      instalmentAmount: 100,
      firstPaymentDate: {
        year: 2050,
        month: 12,
        day: 31
      },
      paymentSchedule: {
        value: PaymentSchedule.EACH_WEEK
      }
    },
    ...partialTimelineAndEvidences
  }
}

export const statementOfMeansWithMandatoryFieldsDraft = {
  bankAccounts: {
    rows: [{
      typeOfAccount: BankAccountType.CURRENT_ACCOUNT,
      joint: false,
      balance: 1000
    }]
  },
  residence: {
    type: ResidenceType.OWN_HOME
  },
  dependants: {
    declared: false
  },
  maintenance: {
    declared: false
  },
  otherDependants: {
    declared: false
  },
  employment: {
    declared: false
  },
  unemployment: {
    option: UnemploymentType.RETIRED
  },
  debts: {
    declared: false
  },
  courtOrders: {
    declared: false
  },
  explanation: 'Some reason',
  monthlyIncome: {
    childBenefitSource: {
      name: 'Child Benefit',
      amount: 200,
      schedule: {
        value: 'WEEK',
        displayValue: 'Week'
      }
    }
  },
  monthlyExpenses: {
    mortgage: {
      name: 'mortgage',
      amount: 100,
      schedule: {
        value: 'MONTH',
        displayValue: 'Month'
      }
    }
  }
}

export const statementOfMeansWithAllFieldsDraft = {
  ...statementOfMeansWithMandatoryFieldsDraft,
  dependants: {
    declared: true,
    numberOfChildren: {
      under11: 1,
      between11and15: 2,
      between16and19: 3
    }
  },
  education: {
    value: 3
  },
  maintenance: {
    declared: true,
    value: 4
  },
  otherDependants: {
    declared: true,
    numberOfPeople: {
      value: 5,
      details: 'Colleagues'
    }
  },
  employment: {
    declared: true,
    employed: true,
    selfEmployed: true
  },
  employers: {
    rows: [{
      employerName: 'HMCTS',
      jobTitle: 'Service manager'
    }]
  },
  selfEmployment: {
    jobTitle: 'Director',
    annualTurnover: 10000
  },
  onTaxPayments: {
    declared: true,
    amountYouOwe: 100,
    reason: 'Various taxes'
  },
  unemployment: undefined,
  debts: {
    declared: true,
    rows: [{
      debt: 'Hard to tell',
      totalOwed: 1000,
      monthlyPayments: 100
    }]
  },
  courtOrders: {
    declared: true,
    rows: [{
      claimNumber: '000MC001',
      amount: 100,
      instalmentAmount: 10
    }]
  }
}
