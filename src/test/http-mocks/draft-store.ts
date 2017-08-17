import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

import { ResponseType } from 'response/form/models/responseType'
import { FreeMediationOption } from 'response/form/models/freeMediation'
import { MoreTimeNeededOption } from 'response/form/models/moreTimeNeeded'
import { InterestType } from 'app/forms/models/interest'

const serviceBaseURL: string = `${config.get('draft-store.url')}/api/${config.get('draft-store.apiVersion')}`

const sampleClaimDraftObj = {
  externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
  readResolveDispute: true,
  readCompletingClaim: true,
  claimant: {
    name: {
      name: 'John Smith'
    },
    partyDetails: {
      address: {
        line1: 'Apt 99',
        city: 'London',
        postcode: 'E1'
      },
      hasCorrespondenceAddress: false
    },
    dateOfBirth: {
      date: {
        day: '31',
        month: '12',
        year: '1980'
      }
    },
    mobilePhone: {
      number: '07000000000'
    },
    payment: {
      id: 12,
      amount: 2500,
      state: { status: 'failed' }
    }
  },
  defendant: {
    name: {
      name: 'Rose Smith'
    },
    partyDetails: {
      address: {
        line1: 'Apt 99',
        city: 'London',
        postcode: 'E1'
      },
      hasCorrespondenceAddress: false
    },
    email: {}
  },
  amount: {
    rows: [
      {
        reason: 'Valid reason',
        amount: 1
      }
    ]
  },
  interest: {
    type: InterestType.NO_INTEREST
  },
  interestDate: {},
  reason: {
    reason: 'Valid reason'
  }
}

const sampleResponseDraftObj = {
  response: {
    type: ResponseType.OWE_NONE
  },
  counterClaim: {
    counterClaim: false
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
    name: { name: 'John Smith' },
    partyDetails: {
      address: { line1: 'Apartment 99', line2: '', city: 'London', postcode: 'SE28 0JE' },
      hasCorrespondenceAddress: false
    },
    dateOfBirth: { date: { year: 1978, month: 1, day: 11 } },
    mobilePhone: { number: '07123456789' }
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
    default:
      throw new Error('Unsupported draft type')
  }

  mock(serviceBaseURL)
    .get(`/draft/${draftType}`)
    .reply(HttpStatus.OK, draft)
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
