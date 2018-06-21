import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import { DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { HowMuchPaidClaimantOption } from 'response/form/models/howMuchPaidClaimant'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { ResponseType } from 'response/form/models/responseType'
import { BankAccountType } from 'response/form/models/statement-of-means/bankAccountType'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'
import { UnemploymentType } from 'response/form/models/statement-of-means/unemploymentType'
import { individualDetails } from 'test/data/draft/partyDetails'

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

export const fullAdmissionWithImmediatePaymentDraft = {
  ...baseResponseDraft,
  ...baseFullAdmissionDraft,
  fullAdmission: {
    paymentOption: {
      option: DefendantPaymentType.IMMEDIATELY
    }
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
  explanation: 'Some reason'
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
