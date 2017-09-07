import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

import { ResponseType } from 'response/form/models/responseType'
import { FreeMediationOption } from 'response/form/models/freeMediation'
import { MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { InterestType } from 'app/forms/models/interest'
import { Defendant } from 'app/drafts/models/defendant'
import Claimant from 'app/drafts/models/claimant'
import DraftClaim from 'app/drafts/models/draftClaim'
import { IndividualDetails } from 'app/forms/models/individualDetails'
import { MobilePhone } from 'app/forms/models/mobilePhone'
import Payment from 'app/pay/payment'
import { Address } from 'forms/models/address'
import DateOfBirth from 'app/forms/models/dateOfBirth'
import { LocalDate } from 'forms/models/localDate'
import ClaimAmountBreakdown from 'forms/models/claimAmountBreakdown'
import ClaimAmountRow from 'forms/models/claimAmountRow'
import Interest from 'forms/models/interest'
import InterestDate from 'forms/models/interestDate'
import Reason from 'forms/models/reason'
import { ResponseDraft } from 'response/draft/responseDraft'
import Email from 'app/forms/models/email'
const serviceBaseURL: string = `${config.get('draft-store.url')}/api/${config.get('draft-store.apiVersion')}`

export const sampleClaimDraftObj = {
  externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
  readResolveDispute: true,
  readCompletingClaim: true,
  lastUpdateTimestamp: 12345,
  claimant: {
    partyDetails: {
      type: 'individual',
      name: 'John Smith',
      address: {
        line1: 'Apt 99',
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
        city: 'London',
        postcode: 'E1'
      },
      hasCorrespondenceAddress: false
    } as IndividualDetails,
    email: {address: 'example@example.com' }
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
  lastUpdateTimestamp: 12345,
  response: {
    type: ResponseType.OWE_NONE
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
  counterClaim: {
    counterClaim: false
  },
  defendantDetails: {
    email: {address: 'example@example.com'} as Email,
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
  }
}

export function resolveRetrieve (draftType: string, draftOverride?: object) {
  let draft: object

  switch (draftType) {
    case 'claim':
      draft = { ...sampleClaimDraftObj, ...draftOverride }
      break
    case 'response':
      draft = { ...sampleResponseDraftObj, ...draftOverride }
      break
    case 'ccj':
      draft = { ...sampleCCJDraftObj, ...draftOverride }
      break
    default:
      throw new Error('Unsupported draft type')
  }

  mock(serviceBaseURL)
    .get(`/draft/${draftType}`)
    .reply(HttpStatus.OK, draft)
}

export function resolveRetrieveNoDraftFound (draftType: string) {
  mock(serviceBaseURL)
    .get(`/draft/${draftType}`)
    .reply(HttpStatus.NOT_FOUND)
}

export function rejectRetrieve (draftType: string, reason: string) {
  mock(serviceBaseURL)
    .get(`/draft/${draftType}`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveSave (draftType: string) {
  mock(serviceBaseURL)
    .post(`/draft/${draftType}`)
    .reply(HttpStatus.OK)
}

export function rejectSave (draftType: string, reason: string) {
  mock(serviceBaseURL)
    .post(`/draft/${draftType}`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveDelete (draftType: string) {
  mock(serviceBaseURL)
    .delete(`/draft/${draftType}`)
    .reply(HttpStatus.OK)
}

export function rejectDelete (draftType: string, reason: string) {
  mock(serviceBaseURL)
    .delete(`/draft/${draftType}`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}
