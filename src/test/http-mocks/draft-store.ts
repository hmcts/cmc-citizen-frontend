import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

import { ResponseType } from 'response/form/models/responseType'
import { FreeMediationOption } from 'response/form/models/freeMediation'
import { MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { InterestType } from 'app/../../main/features/claim/form/models/interest'
import { Defendant } from 'app/drafts/models/defendant'
import Claimant from 'app/drafts/models/claimant'
import DraftClaim from 'app/drafts/models/draftClaim'
import { IndividualDetails } from 'app/forms/models/individualDetails'
import { MobilePhone } from 'app/forms/models/mobilePhone'
import Payment from 'app/pay/payment'
import { Address } from 'forms/models/address'
import DateOfBirth from 'app/forms/models/dateOfBirth'
import { LocalDate } from 'forms/models/localDate'
import { ClaimAmountBreakdown } from 'claim/form/models/claimAmountBreakdown'
import { ClaimAmountRow } from 'claim/form/models/claimAmountRow'
import { Interest } from 'claim/form/models/interest'
import { InterestDate } from 'claim/form/models/interestDate'
import { Reason } from 'claim/form/models/reason'
import { ResponseDraft } from 'response/draft/responseDraft'
import Email from 'app/forms/models/email'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { YesNoOption } from 'models/yesNoOption'
import { ClaimValue } from 'claim/form/models/eligibility/claimValue'

const serviceBaseURL: string = `${config.get('draft-store.url')}`

export const sampleClaimDraftObj = {
  externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
  readResolveDispute: true,
  readCompletingClaim: true,
  eligibility: {
    claimantAddress: YesNoOption.YES,
    defendantAddress: YesNoOption.YES,
    claimValue: ClaimValue.UNDER_10000,
    eighteenOrOver: YesNoOption.YES,
    governmentDepartment: YesNoOption.NO,
    helpWithFees: YesNoOption.NO
  },
  claimant: {
    partyDetails: {
      type: 'individual',
      name: 'John Smith',
      address: {
        line1: 'Apt 99',
        line2: '',
        city: 'London',
        postcode: 'E1'
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
      id: '12',
      amount: 2500,
      state: { status: 'success' }
    } as Payment
  } as Claimant,
  defendant: {
    partyDetails: {
      type: 'individual',
      name: 'Rose Smith',
      address: {
        line1: 'Apt 99',
        line2: '',
        city: 'London',
        postcode: 'E1'
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
    type: InterestType.NO_INTEREST
  } as Interest,
  interestDate: {} as InterestDate,
  reason: {
    reason: 'Valid reason'
  } as Reason
} as DraftClaim

const sampleResponseDraftObj = {
  response: {
    type: ResponseType.OWE_NONE
  },
  rejectAllOfClaim: {
    option: RejectAllOfClaimOption.DISPUTE
  },
  defence: {
    text: 'Some valid defence'
  },
  freeMediation: {
    option: FreeMediationOption.NO
  },
  moreTimeNeeded: {
    option: MoreTimeNeededOption.YES
  },
  defendantDetails: {
    email: { address: 'example@example.com' } as Email,
    mobilePhone: { number: '01223344444' } as MobilePhone,
    partyDetails: {
      type: 'individual',
      name: 'John Smith',
      address: { line1: 'Apartment 99', line2: '', city: 'London', postcode: 'SE28 0JE' } as Address,
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
  } as Defendant
} as ResponseDraft

const sampleCCJDraftObj = {
  defendant: {
    email: { address: 'a@wp.pl' },
    partyDetails: {
      type: 'individual',
      name: 'John Smith',
      address: {
        line1: 'Apartment 99',
        line2: '',
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
    firstPayment: 100,
    installmentAmount: 100,
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

export function resolveFind (draftType: string, draftOverride?: object): mock.Scope {
  let documentDocument: object

  switch (draftType) {
    case 'claim':
      documentDocument = { ...sampleClaimDraftObj, ...draftOverride }
      break
    case 'response':
      documentDocument = { ...sampleResponseDraftObj, ...draftOverride }
      break
    case 'ccj':
      documentDocument = { ...sampleCCJDraftObj, ...draftOverride }
      break
    default:
      documentDocument = { ...draftOverride }
  }

  return mock(serviceBaseURL)
    .get(new RegExp('/drafts.*'))
    .reply(HttpStatus.OK, {
      data: [{
        id: 100,
        type: draftType,
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
        document: sampleResponseDraftObj,
        created: '2017-10-02T12:00:00.000',
        updated: '2017-10-02T12:01:00.000'
      }, {
        id: 203,
        type: 'ccj',
        document: sampleCCJDraftObj,
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
