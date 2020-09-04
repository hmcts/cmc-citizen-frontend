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
import { Phone } from 'forms/models/phone'
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
import { CompanyDetails } from 'forms/models/companyDetails'

const serviceBaseURL: string = `${config.get('draft-store.url')}`

export const samplePaidInFullDraftObj = {
  datePaid: moment()
}

export const sampleOrganisationDetails = {
  type: 'organisation',
  name: 'John Smith',
  address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'SE28 0JE' } as Address,
  hasCorrespondenceAddress: false,
  contactPerson: 'Mary Richards'
}

const commonClaimObject = {
  externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
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
  readResolveDispute: true,
  readCompletingClaim: true,
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
  timeline: {
    rows: [{ date: 'aaa', description: 'bb' }]
  } as ClaimantTimeline,
  evidence: {
    rows: [{ type: EvidenceType.OTHER, description: 'bb' }]
  } as Evidence
}

const commonIndividualClaimant = {
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
    phone: {
      number: '07000000000'
    } as Phone,
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
  } as Claimant
}

const commonIndividualClaimantIOC = {
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
    phone: {
      number: '07000000000'
    } as Phone
  } as Claimant
}

const commonCompanyClaimant = {
  claimant: {
    partyDetails: {
      type: 'company',
      name: 'Monsters Inc.',
      contactPerson: 'Sully',
      address: {
        line1: 'Apartment 99',
        line2: '',
        line3: '',
        city: 'London',
        postcode: 'SE28 0JE'
      } as Address,
      hasCorrespondenceAddress: false
    } as CompanyDetails,
    phone: {
      number: '07000000000'
    } as Phone,
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
  }
}

const commonCompanyDefendant = {
  defendant: {
    partyDetails: {
      type: 'company',
      name: 'Monsters Inc.',
      contactPerson: 'Sully',
      address: {
        line1: 'Apartment 99',
        line2: '',
        line3: '',
        city: 'London',
        postcode: 'SE28 0JE'
      } as Address,
      hasCorrespondenceAddress: false
    } as CompanyDetails,
    email: { address: 'example@example.com' },
    phone: { number: '07799889988' }
  } as Defendant
}

export const aboveAllowedAmountWithInterest = {
  amount: {
    rows: [
      {
        reason: 'Valid reason',
        amount: 9800
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
    type: InterestDateType.CUSTOM
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
  } as InterestEndDate
}

const commonIndividualDefendant = {
  defendant: {
    partyDetails: {
      type: 'individual',
      firstName: 'Rose',
      lastName: 'Smith',
      address: {
        line1: 'Apt 99',
        line2: '',
        line3: '',
        city: 'London',
        postcode: 'bb127nq'
      },
      hasCorrespondenceAddress: false
    } as IndividualDetails,
    email: { address: 'example@example.com' },
    phone: { number: '07799889988' }
  } as Defendant
}

export const sampleClaimDraftObj = {
  ...commonClaimObject,
  ...commonIndividualClaimant,
  ...commonIndividualDefendant
} as DraftClaim

export const sampleClaimDraftObjIOC = {
  ...commonClaimObject,
  ...commonIndividualClaimantIOC,
  ...commonIndividualDefendant
} as DraftClaim

export const sampleCompanyClaimDraftObj = {
  ...commonClaimObject,
  ...commonCompanyClaimant,
  ...commonIndividualDefendant
} as DraftClaim

export const sampleCompanyAsDefendantClaimDraftObj = {
  ...commonClaimObject,
  ...commonCompanyClaimant,
  ...commonCompanyDefendant
} as DraftClaim

const commonIndividualResponsePartial = {
  defendantDetails: {
    email: { address: 'example@example.com' } as Email,
    phone: { number: '01223344444' } as Phone,
    partyDetails: {
      type: 'individual',
      firstName: 'John',
      lastName: 'Smith',
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

const commonCompanyResponsePartial = {
  defendantDetails: {
    email: { address: 'example@example.com' } as Email,
    phone: { number: '01223344444' } as Phone,
    partyDetails: {
      type: 'company',
      name: 'Monsters Inc.',
      contactPerson: 'Sully',
      address: {
        line1: 'Apartment 99',
        line2: '',
        line3: '',
        city: 'London',
        postcode: 'SE28 0JE'
      } as Address,
      hasCorrespondenceAddress: false
    } as CompanyDetails
  } as Defendant,
  moreTimeNeeded: {
    option: MoreTimeNeededOption.YES
  }
}

const commonDefenceResponse = {
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
}

export const sampleResponseDraftObj = {
  ...commonIndividualResponsePartial,
  ...commonDefenceResponse
} as ResponseDraft

export const sampleCompanyResponseDraftObj = {
  ...commonCompanyResponsePartial,
  ...commonDefenceResponse
} as ResponseDraft

export const sampleFullAdmissionResponseDraftObj = {
  ...commonIndividualResponsePartial,
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
      phone: 1,
      maintenance: 1,
      rows: [{ amount: 10, description: 'bla bla bla' }]
    },
    courtOrders: { declared: false },
    explanation: { text: 'aaa' }
  }
}

export const sampleFullRejectionDraftObj = {
  ...commonIndividualResponsePartial,
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
  ...commonIndividualResponsePartial,
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
      firstPaymentDate: LocalDate.fromMoment(MomentFactory.currentDate().add(50, 'days')),
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

export const sampleMediationDraftObj = {
  willYouTryMediation: {
    option: FreeMediationOption.YES
  },
  youCanOnlyUseMediation: {
    option: FreeMediationOption.YES
  },
  canWeUse: {
    option: FreeMediationOption.NO,
    mediationPhoneNumber: '07777777777'
  },
  canWeUseCompany: {
    option: FreeMediationOption.NO,
    mediationPhoneNumber: '07777777777',
    mediationContactPerson: 'Mary Richards'
  }
}

export const sampleLegacyMediationDraftObj = {
  willYouTryMediation: {
    option: FreeMediationOption.NO
  }
}

export const sampleCompanyMediationDraftObj = {
  willYouTryMediation: {
    option: FreeMediationOption.YES
  },
  youCanOnlyUseMediation: {
    option: FreeMediationOption.YES
  },
  canWeUseCompany: {
    option: FreeMediationOption.NO,
    mediationPhoneNumber: '07777777777',
    mediationContactPerson: 'Mary Richards'
  }
}

export const sampleDirectionsQuestionnaireDraftObj = {
  selfWitness: {
    option: {
      option: 'yes'
    }
  },
  otherWitnesses: {
    otherWitnesses: {
      option: 'yes'
    },
    howMany: 1
  },
  hearingLocation: {
    courtName: 'Little Whinging, Surrey',
    courtPostCode: undefined,
    courtAccepted: { option: 'yes' },
    alternateCourtName: 'some other court name'
  },
  exceptionalCircumstances: {
    exceptionalCircumstances: { option: 'yes' },
    reason: 'Poorly pet owl'
  },
  availability: {
    hasUnavailableDates: true,
    unavailableDates: [
      { year: 2020, month: 1, day: 4 },
      { year: 2020, month: 2, day: 8 }
    ]
  },
  supportRequired: {
    languageSelected: true,
    languageInterpreted: 'Klingon',
    signLanguageSelected: true,
    signLanguageInterpreted: 'Makaton',
    hearingLoopSelected: true,
    disabledAccessSelected: true,
    otherSupportSelected: true,
    otherSupport: 'Life advice'
  },
  expertRequired: {
    option: {
      option: 'yes'
    }
  },
  expertReports: {
    declared: true,
    rows: [
      {
        expertName: 'Prof. McGonagall',
        reportDate: { year: 2018, month: 1, day: 10 }
      },
      {
        expertName: 'Mr Rubeus Hagrid',
        reportDate: { year: 2019, month: 2, day: 27 }
      }
    ]
  },
  permissionForExpert: {
    option: {
      option: 'yes'
    }
  },
  expertEvidence: {
    expertEvidence: {
      option: 'yes'
    },
    whatToExamine: 'Photographs'
  },
  whyExpertIsNeeded: {
    explanation: 'for expert opinion'
  }
}

export const sampleOrdersDraftObj = {
  externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
  disagreeReason: { reason: 'I want a judge to review it' }
}

export function resolveFind (draftType: string, draftOverride?: object): mock.Scope {
  let documentDocument: object

  switch (draftType) {
    case 'claim':
      documentDocument = { ...sampleClaimDraftObj, ...draftOverride }
      break
    case 'claim:ioc':
      documentDocument = { ...sampleClaimDraftObjIOC, ...draftOverride }
      break
    case 'claim:company':
      documentDocument = { ...sampleCompanyClaimDraftObj, ...draftOverride }
      break
    case 'claim:companyAsDefendant':
      documentDocument = { ...sampleCompanyAsDefendantClaimDraftObj, ...draftOverride }
      break
    case 'response':
      documentDocument = { ...sampleResponseDraftObj, ...draftOverride }
      break
    case 'response:company':
      documentDocument = { ...sampleCompanyResponseDraftObj, ...draftOverride }
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
    case 'mediation':
      documentDocument = { ...sampleMediationDraftObj, ...draftOverride }
      break
    case 'directionsQuestionnaire':
      documentDocument = { ...sampleDirectionsQuestionnaireDraftObj, ...draftOverride }
      break
    case 'orders':
      documentDocument = { ...sampleOrdersDraftObj, ...draftOverride }
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

export function resolveUpdate (id: number = 100): mock.Scope {
  return mock(serviceBaseURL)
    .put(`/drafts/${id}`)
    .reply(HttpStatus.OK)
}

export function resolveSave (id: number = 100): mock.Scope {
  return mock(serviceBaseURL)
    .post(`/drafts`)
    .reply(HttpStatus.OK, sampleOrdersDraftObj)
}

export function rejectSave (id: number = 100, reason: string = 'HTTP error'): mock.Scope {
  return mock(serviceBaseURL)
    .post(`/drafts`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function rejectUpdate (id: number = 100, reason: string = 'HTTP error'): mock.Scope {
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
