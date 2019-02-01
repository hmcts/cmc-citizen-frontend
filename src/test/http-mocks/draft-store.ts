import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

import { ResponseType } from 'response/form/models/responseType'
import { FreeMediationOption } from 'forms/models/freeMediation'
import { MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { InterestRateOption } from 'features/claim/form/models/interestRateOption'
import { Defendant } from 'drafts/models/defendant'
import { Claimant } from 'drafts/models/claimant'
import { DraftClaim } from 'drafts/models/draftClaim'
import { IndividualDetails } from 'forms/models/individualDetails'
import { MobilePhone } from 'forms/models/mobilePhone'
import { Payment } from 'payment-hub-client/payment'
import { Address } from 'forms/models/address'
import { DateOfBirth } from 'forms/models/dateOfBirth'
import { LocalDate } from 'forms/models/localDate'
import { ClaimAmountBreakdown } from 'claim/form/models/claimAmountBreakdown'
import { ClaimAmountRow } from 'claim/form/models/claimAmountRow'
import { InterestRate } from 'claim/form/models/interestRate'
import { InterestDate } from 'claim/form/models/interestDate'
import { Reason } from 'claim/form/models/reason'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Email } from 'forms/models/email'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { ResidenceType } from 'response/form/models/statement-of-means/residenceType'
import { UnemploymentType } from 'response/form/models/statement-of-means/unemploymentType'
import { ClaimantTimeline } from 'claim/form/models/claimantTimeline'
import { Interest } from 'claim/form/models/interest'
import { InterestDateType } from 'common/interestDateType'
import { InterestType, InterestTypeOption } from 'claim/form/models/interestType'
import { InterestStartDate } from 'claim/form/models/interestStartDate'
import { InterestEndDate, InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { ClaimValue } from 'eligibility/model/claimValue'
import { YesNoOption } from 'models/yesNoOption'
import { Evidence } from 'forms/models/evidence'
import { EvidenceType } from 'forms/models/evidenceType'
import { Eligibility } from 'eligibility/model/eligibility'
import { ClaimType } from 'eligibility/model/claimType'
import { DefendantAgeOption } from 'eligibility/model/defendantAgeOption'
import { AlreadyPaid } from 'response/form/models/alreadyPaid'
import { HowMuchHaveYouPaid } from 'response/form/models/howMuchHaveYouPaid'
import { MomentFactory } from 'shared/momentFactory'
import * as moment from 'moment'

const serviceBaseURL: string = `${config.get('draft-store.url')}`

export const samplePaidInFullDraftObj = {
  datePaid: moment()
}

export const sampleClaimDraftObj = {
  externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
  claimant: {
    partyDetails: {
      type: 'individual',
      name: 'John Smith',
      address: {
        line1: 'Apt 99',
        line2: '',
        line3: '',
        city: 'London',
        postcode: 'bb127nq'
      } as Address,
      hasCorrespondenceAddress: false,
      dateOfBirth: {
        known: true,
        date: {
          day: 31,
          month: 12,
          year: 1980
        } as LocalDate
      } as DateOfBirth
    } as IndividualDetails,
    mobilePhone: {
      number: '07000000000'
    } as MobilePhone,
    payment: {
      reference: '123',
      date_created: 12345,
      amount: 2500,
      status: 'Success',
      _links: {
        next_url: {
          href: 'any href',
          method: 'POST'
        }
      }
    } as Payment
  } as Claimant,
  defendant: {
    partyDetails: {
      type: 'individual',
      name: 'Rose Smith',
      address: {
        line1: 'Apt 99',
        line2: '',
        line3: '',
        city: 'London',
        postcode: 'bb127nq'
      },
      hasCorrespondenceAddress: false
    } as IndividualDetails,
    email: { address: 'example@example.com' }
  } as Defendant,
  amount: {
    rows: [
      {
        reason: 'Valid reason',
        amount: 1
      } as ClaimAmountRow
    ]
  } as ClaimAmountBreakdown,
  interest: {
    option: YesNoOption.YES
  } as Interest,
  interestType: {
    option: InterestTypeOption.SAME_RATE
  } as InterestType,
  interestRate: {
    type: InterestRateOption.DIFFERENT,
    rate: 10,
    reason: 'Special case'
  } as InterestRate,
  interestDate: {
    type: InterestDateType.SUBMISSION
  } as InterestDate,
  interestStartDate: {
    date: {
      day: 10,
      month: 12,
      year: 2016
    },
    reason: 'reason'
  } as InterestStartDate,
  interestEndDate: {
    option: InterestEndDateOption.SETTLED_OR_JUDGMENT
  } as InterestEndDate,
  reason: {
    reason: 'Valid reason'
  } as Reason,
  readResolveDispute: true,
  readCompletingClaim: true,
  eligibility: {
    claimValue: ClaimValue.UNDER_10000,
    helpWithFees: YesNoOption.NO,
    claimantAddress: YesNoOption.YES,
    defendantAddress: YesNoOption.YES,
    eighteenOrOver: YesNoOption.YES,
    defendantAge: DefendantAgeOption.YES,
    claimType: ClaimType.PERSONAL_CLAIM,
    singleDefendant: YesNoOption.NO,
    governmentDepartment: YesNoOption.NO,
    claimIsForTenancyDeposit: YesNoOption.NO
  } as Eligibility,
  timeline: {
    rows: [{ date: 'aaa', description: 'bb' }]
  } as ClaimantTimeline,
  evidence: {
    rows: [{ type: EvidenceType.OTHER, description: 'bb' }]
  } as Evidence
} as DraftClaim

const commonResponsePartial = {
  defendantDetails: {
    email: { address: 'example@example.com' } as Email,
    mobilePhone: { number: '01223344444' } as MobilePhone,
    partyDetails: {
      type: 'individual',
      name: 'John Smith',
      address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'SE28 0JE' } as Address,
      hasCorrespondenceAddress: false,
      dateOfBirth: {
        known: true,
        date: {
          day: 31,
          month: 12,
          year: 1980
        } as LocalDate
      } as DateOfBirth
    } as IndividualDetails
  } as Defendant,
  moreTimeNeeded: {
    option: MoreTimeNeededOption.YES
  }
}

export const sampleResponseDraftObj = {
  ...commonResponsePartial,
  response: {
    type: ResponseType.DEFENCE
  },
  rejectAllOfClaim: {
    option: RejectAllOfClaimOption.DISPUTE
  },
  defence: {
    text: 'Some valid defence'
  },
  timeline: {
    rows: [],
    comment: ''
  },
  freeMediation: {
    option: FreeMediationOption.NO
  }
} as ResponseDraft

export const sampleFullAdmissionResponseDraftObj = {
  ...commonResponsePartial,
  response: {
    type: ResponseType.FULL_ADMISSION
  },
  fullAdmission: {
    paymentIntention: {
      paymentOption: {
        option: {
          value: 'INSTALMENTS'
        }
      },
      paymentPlan: {
        totalAmount: 3685,
        instalmentAmount: 100,
        firstPaymentDate: {
          year: 2019,
          month: 1,
          day: 1
        },
        paymentSchedule: {
          value: 'EVERY_MONTH',
          displayValue: 'every month'
        }
      }
    }
  },
  statementOfMeans: {
    residence: {
      type: ResidenceType.OWN_HOME
    },
    employment: { declared: false },
    employers: undefined,
    selfEmployment: undefined,
    unemployment: { option: { value: UnemploymentType.RETIRED.value } },
    dependants: { declared: false },
    otherDependants: { declared: false },
    maintenance: { declared: false },
    bankAccounts: { rows: [] },
    debts: { declared: false },
    monthlyIncome: {
      salary: 1,
      universalCredit: 1,
      jobSeekerAllowanceIncome: 1,
      jobSeekerAllowanceContribution: 1,
      incomeSupport: 1,
      workingTaxCredit: 1,
      childTaxCredit: 1,
      childBenefit: 1,
      councilTaxSupport: 1,
      pension: 1
    },
    monthlyExpenses: {
      mortgage: 1,
      rent: 1,
      councilTax: 1,
      gas: 1,
      electricity: 1,
      water: 1,
      travel: 1,
      schoolCosts: 1,
      foodAndHousekeeping: 1,
      tvAndBroadband: 1,
      mobilePhone: 1,
      maintenance: 1,
      rows: [{ amount: 10, description: 'bla bla bla' }]
    },
    courtOrders: { declared: false },
    explanation: { text: 'aaa' }
  }
}

export const sampleFullRejectionDraftObj = {
  ...commonResponsePartial,
  response: {
    type: ResponseType.DEFENCE
  },
  rejectAllOfClaim: {
    option: RejectAllOfClaimOption.ALREADY_PAID,
    howMuchHaveYouPaid: {
      amount: 200,
      date: {
        year: 2018,
        month: 7,
        day: 27
      },
      text: 'by pigeon'
    },
    whyDoYouDisagree: {
      text: 'bla bla bla'
    }
  }
}

export const samplePartialAdmissionResponseDraftObj = {
  ...commonResponsePartial,
  response: {
    type: ResponseType.PART_ADMISSION
  },
  partialAdmission: {
    alreadyPaid: new AlreadyPaid().deserialize({ alreadyPaid: new AlreadyPaid(YesNoOption.YES) }),
    howMuchHaveYouPaid: new HowMuchHaveYouPaid().deserialize({ amount: 100, date: '2018-02-01', text: 'by Cash' }),
    paymentIntention: {
      paymentOption: {
        option: {
          value: 'INSTALMENTS'
        }
      },
      paymentPlan: {
        totalAmount: 3685,
        instalmentAmount: 100,
        firstPaymentDate: {
          year: 2019,
          month: 1,
          day: 1
        },
        paymentSchedule: {
          value: 'EVERY_MONTH',
          displayValue: 'every month'
        }
      }
    }
  }
}

const sampleCCJDraftObj = {
  defendant: {
    email: { address: 'a@wp.pl' },
    partyDetails: {
      type: 'individual',
      name: 'John Smith',
      address: {
        line1: 'Apartment 99',
        line2: '',
        line3: '',
        city: 'London',
        postcode: 'SE28 0JE'
      },
      dateOfBirth: {
        known: true,
        date: {
          day: 31,
          month: 12,
          year: 1980
        }
      }
    }
  },
  paymentOption: {
    option: {
      value: 'INSTALMENTS',
      displayValue: 'By instalments'
    }
  },
  paidAmount: { option: PaidAmountOption.NO },
  repaymentPlan: {
    remainingAmount: 3685,
    instalmentAmount: 100,
    firstPaymentDate: {
      year: 2019,
      month: 1,
      day: 1
    },
    paymentSchedule: {
      value: 'EVERY_MONTH',
      displayValue: 'every month'
    }
  }
}

export const sampleClaimantResponseDraftObj = {
  defendantResponseViewed: true,
  settleAdmitted: {
    admitted: {
      option: 'yes'
    }
  },
  acceptPaymentMethod: {
    accept: {
      option: 'yes'
    }
  },
  alternatePaymentMethod: {
    paymentOption: {
      option: {
        value: 'INSTALMENTS',
        displayValue: 'By instalments'
      }
    },
    paymentPlan: {
      totalAmount: 3326.59,
      instalmentAmount: 10,
      firstPaymentDate: {
        year: 2019,
        month: 1,
        day: 1
      },
      paymentSchedule: {
        value: 'EACH_WEEK',
        displayValue: 'Each week'
      }
    }
  },
  courtDetermination: {
    courtDecision: {
      paymentOption: {
        value: 'INSTALMENTS'
      },
      repaymentPlan: {
        instalmentAmount: 4.3333335,
        firstPaymentDate: '2019-01-01T00:00:00.000',
        paymentSchedule: 'EVERY_MONTH',
        completionDate: MomentFactory.parse('2039-05-08T00:00:00.000'),
        paymentLength: '20 years 5 months'
      }
    },
    rejectionReason: {
      text: 'i reject repayment plan because ...'
    }
  }
  ,
  formaliseRepaymentPlan: {
    option: {
      value: 'signSettlementAgreement',
      displayValue: 'Sign a settlement agreement'
    }
  },
  settlementAgreement: {
    signed: true
  },
  freeMediation: {
    option: FreeMediationOption.NO
  }
}

export function resolveFind (draftType: string, draftOverride?: object): mock.Scope {
  let documentDocument: object

  switch (draftType) {
    case 'claim':
      documentDocument = { ...sampleClaimDraftObj, ...draftOverride }
      break
    case 'response':
      documentDocument = { ...sampleResponseDraftObj, ...draftOverride }
      break
    case 'response:full-admission':
      documentDocument = { ...sampleFullAdmissionResponseDraftObj, ...draftOverride }
      break
    case 'response:partial-admission':
      documentDocument = { ...samplePartialAdmissionResponseDraftObj, ...draftOverride }
      break
    case 'response:full-rejection':
      documentDocument = { ...sampleFullRejectionDraftObj, ...draftOverride }
      break
    case 'ccj':
      documentDocument = { ...sampleCCJDraftObj, ...draftOverride }
      break
    case 'claimantResponse':
      documentDocument = { ...sampleClaimantResponseDraftObj, ...draftOverride }
      break
    default:
      documentDocument = { ...draftOverride }
  }

  return mock(serviceBaseURL)
    .get(new RegExp('/drafts.*'))
    .reply(HttpStatus.OK, {
      data: [{
        id: 100,
        type: draftType.split(':')[0],
        document: documentDocument,
        created: '2017-10-01T12:00:00.000',
        updated: '2017-10-01T12:01:00.000'
      }]
    })
}

export function resolveFindAllDrafts (): mock.Scope {
  return mock(serviceBaseURL)
    .get(new RegExp('/drafts.*'))
    .reply(HttpStatus.OK, {
      data: [{
        id: 200,
        type: 'claim',
        document: sampleClaimDraftObj,
        created: '2017-10-01T12:00:00.000',
        updated: '2017-10-01T12:01:00.000'
      }, {
        id: 201,
        type: 'response',
        document: {
          ...sampleResponseDraftObj,
          ...sampleFullAdmissionResponseDraftObj
        },
        created: '2017-10-02T12:00:00.000',
        updated: '2017-10-02T12:01:00.000'
      }, {
        id: 203,
        type: 'ccj',
        document: sampleCCJDraftObj,
        created: '2017-10-03T12:00:00.000',
        updated: '2017-10-03T12:01:00.000'
      }, {
        id: 204,
        type: 'claimantResponse',
        document: sampleClaimantResponseDraftObj,
        created: '2017-10-03T12:00:00.000',
        updated: '2017-10-03T12:01:00.000'
      }, {
        id: 205,
        type: 'paid-in-full',
        document: samplePaidInFullDraftObj,
        created: '2017-10-03T12:00:00.000',
        updated: '2017-10-03T12:01:00.000'
      }]
    })
}

export function resolveFindNoDraftFound (): mock.Scope {
  return mock(serviceBaseURL)
    .get(new RegExp('/drafts.*'))
    .reply(HttpStatus.OK, {
      data: []
    })
}

export function rejectFind (reason: string = 'HTTP error'): mock.Scope {
  return mock(serviceBaseURL)
    .get(new RegExp('/drafts.*'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveSave (id: number = 100): mock.Scope {
  return mock(serviceBaseURL)
    .put(`/drafts/${id}`)
    .reply(HttpStatus.OK)
}

export function rejectSave (id: number = 100, reason: string = 'HTTP error'): mock.Scope {
  return mock(serviceBaseURL)
    .put(`/drafts/${id}`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveDelete (id: number = 100): mock.Scope {
  return mock(serviceBaseURL)
    .delete(`/drafts/${id}`)
    .reply(HttpStatus.OK)
}

export function rejectDelete (id: number = 100, reason: string = 'HTTP error'): mock.Scope {
  return mock(serviceBaseURL)
    .delete(`/drafts/${id}`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}
