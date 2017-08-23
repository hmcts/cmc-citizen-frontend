import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import { InterestType } from 'app/forms/models/interest'
import { Individual as DefendantAsIndividual } from 'claims/models/details/theirs/individual'
import { DefendantResponseData } from 'app/claims/models/defendantResponseData'
import { Individual as claimantAsIndividual } from 'claims/models/details/yours/individual'
import { Address } from 'claims/models/address'
import { DefendantResponse } from 'claims/models/defendantResponse'
import { TheirDetails as Defendant } from 'app/claims/models/details/theirs/theirDetails'

const serviceBaseURL: string = config.get<string>('claim-store.url')

const sampleClaimObj = {
  id: 1,
  claimantId: 1,
  externalId: '400f4c57-9684-49c0-adb4-4cf46579d6dc',
  defendantId: 123,
  claimNumber: '000MC000',
  createdAt: '2017-07-25T22:45:51.785',
  issuedOn: '2017-07-25',
  claim: {
    payment: {
      id: '12',
      amount: 2500,
      state: { status: 'failed' }
    },
    amount: {
      rows: [{ reason: 'Reason', amount: 200 }]
    },
    interestDate: {
      date: {
        year: 2000,
        month: 2,
        day: 1
      }
    },
    claimant: {
      type: 'individual',
      name: 'John Smith',
      address: {
        line1: 'line1',
        line2: 'line2',
        city: 'city',
        postcode: 'bb127nq'
      } as Address,
      dateOfBirth: '1990-02-17'
    } as claimantAsIndividual,
    defendant: {
      type: 'individual',
      name: 'John Doe',
      address: {
        line1: 'line1',
        line2: 'line2',
        city: 'city',
        postcode: 'bb127nq'
      }
    } as DefendantAsIndividual,
    interest: {
      type: InterestType.NO_INTEREST
    },
    reason: 'Because I can'
  },
  responseDeadline: '2017-08-08'
}

const sampleDefendantResponseObj = {
  id: 1,
  claimId: 1,
  defendantId: 1,
  respondedAt: {},
  response: {
    type: 'OWE_ALL_PAID_SOME',
    defence: '',
    freeMediation: ''
  } as DefendantResponseData,
  defendantDetails: {
    type: 'individual',
    name: 'full name',
    address: {
      line1: 'line1',
      line2: 'line2',
      city: 'city',
      postcode: 'bb127nq'
    } as Address
  } as Defendant
} as DefendantResponse

export function resolveRetrieveClaimByExternalId (claimOverride?: object) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'))
    .reply(HttpStatus.OK, { ...sampleClaimObj, ...claimOverride })
}

export function rejectRetrieveClaimByExternalId (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveRetrieveByClaimantId (claimOverride?: object) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/claimant/[0-9]+'))
    .reply(HttpStatus.OK, [{ ...sampleClaimObj, ...claimOverride }])
}

export function resolveRetrieveByClaimantIdToEmptyList () {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/claimant/[0-9]+'))
    .reply(HttpStatus.OK, [])
}

export function resolveRetrieveByDefendantIdToEmptyList () {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/defendant/[0-9]+'))
    .reply(HttpStatus.OK, [])
}

export function rejectRetrieveByClaimantId (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/claimant/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveRetrieveByLetterHolderId (referenceNumber: string, defendantId?: number) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/letter/[0-9]+'))
    .reply(HttpStatus.OK, { ...sampleClaimObj, referenceNumber: referenceNumber, defendantId: defendantId })
}

export function rejectRetrieveByLetterHolderId (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/letter/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveRetrieveByDefendantId (referenceNumber: string, defendantId?: number) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/defendant/[0-9]+'))
    .reply(HttpStatus.OK, [{ ...sampleClaimObj, referenceNumber: referenceNumber, defendantId: defendantId }])
}

export function rejectRetrieveByDefendantId (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/defendant/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveLinkDefendant () {
  mock(`${serviceBaseURL}/claims`)
    .put(new RegExp('/[0-9]+/defendant/[0-9]+'))
    .reply(HttpStatus.OK, { ...sampleClaimObj, defendantId: 1 })
}

export function rejectLinkDefendant (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .put(new RegExp('/[0-9]+/defendant/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveSaveResponse () {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+/defendant/[0-9]+'))
    .reply(HttpStatus.OK, { ...sampleClaimObj, defendantId: 1 })
}

export function rejectSaveResponse (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+/defendant/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveRetrieveResponsesByDefendantId (defendantResponseOverride?: object) {
  mock(`${serviceBaseURL}/responses/defendant`)
    .get(new RegExp('/[0-9]+'))
    .reply(HttpStatus.OK, [{ ...sampleDefendantResponseObj, ...defendantResponseOverride }])
}

export function resolveRetrieveResponsesByDefendantIdToEmptyList () {
  mock(`${serviceBaseURL}/responses/defendant`)
    .get(new RegExp('/[0-9]+'))
    .reply(HttpStatus.OK, [])
}

export function rejectRetrieveResponseByDefendantId (reason: string) {
  mock(`${serviceBaseURL}/responses/defendant`)
    .get(new RegExp('/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveRequestForMoreTime () {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+/request-more-time'))
    .reply(HttpStatus.OK)
}

export function rejectRequestForMoreTime (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+/request-more-time'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveSaveClaimForUser () {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+'))
    .reply(HttpStatus.OK, { ...sampleClaimObj })
}

export function rejectSaveClaimForUser (reason: string = 'HTTP error') {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function rejectRetrieveDefendantResponseCopy (reason: string) {
  mock(`${serviceBaseURL}/documents`)
    .get(new RegExp('/defendantResponseCopy/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveRetrieveDefendantResponseCopy () {
  mock(`${serviceBaseURL}/documents`)
    .get(new RegExp('/defendantResponseCopy/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'))
    .reply(HttpStatus.OK, [])
}
