import * as config from 'config'
import * as mock from 'nock'
import { Scope } from 'nock'
import * as HttpStatus from 'http-status-codes'
import { InterestType } from 'app/forms/models/interest'

const serviceBaseURL: string = config.get<string>('claim-store.url')

export const sampleClaimObj = {
  id: 1,
  submitterId: 1,
  externalId: '400f4c57-9684-49c0-adb4-4cf46579d6dc',
  defendantId: 123,
  referenceNumber: '000MC000',
  createdAt: '2017-07-25T22:45:51.785',
  issuedOn: '2017-07-25',
  claim: {
    claimants: [
      {
        type: 'individual',
        name: 'John Smith',
        address: {
          line1: 'line1',
          line2: 'line2',
          city: 'city',
          postcode: 'bb127nq'
        },
        dateOfBirth: '1990-02-17'
      }
    ],
    defendants: [
      {
        type: 'individual',
        name: 'John Doe',
        address: {
          line1: 'line1',
          line2: 'line2',
          city: 'city',
          postcode: 'bb127nq'
        }
      }
    ],
    payment: {
      id: '12',
      amount: 2500,
      state: { status: 'failed' }
    },
    amount: {
      type: 'breakdown',
      rows: [{ reason: 'Reason', amount: 200 }]
    },
    interestDate: {
      date: {
        year: 2000,
        month: 2,
        day: 1
      }
    },
    interest: {
      type: InterestType.NO_INTEREST
    },
    reason: 'Because I can'
  },
  responseDeadline: '2017-08-08',
  countyCourtJudgment: {
    defendant: {
      name: 'asdsd',
      type: 'individual',
      email: 'd@w.pl',
      address: {
        city: 'sadasd',
        line1: 'sadasd',
        line2: 'dsas',
        postcode: 'sdasd'
      },
      dateOfBirth: '1990-11-01'
    },
    paidAmount: 2,
    paymentOption: 'IMMEDIATELY'
  }
}

const sampleDefendantResponseObj = {
  respondedAt: '2017-07-25T22:45:51.785',
  response: {
    type: 'OWE_NONE',
    defence: 'I reject this money claim',
    freeMediation: 'yes',
    defendant: {
      type: 'individual',
      name: 'full name',
      address: {
        line1: 'line1',
        line2: 'line2',
        city: 'city',
        postcode: 'bb127nq'
      }
    }
  }
}

export function resolveRetrieveClaimByExternalId (claimOverride?: object): Scope {
  return mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'))
    .reply(HttpStatus.OK, { ...sampleClaimObj, ...claimOverride })
}

export function resolveRetrieveClaimByExternalIdWithResponse (override?: object) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'))
    .reply(HttpStatus.OK, { ...sampleClaimObj, ...sampleDefendantResponseObj, ...override })
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

export function resolveIsClaimLinked (status: boolean) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/.+/defendant-link-status'))
    .reply(HttpStatus.OK, { linked: status })
}

export function rejectIsClaimLinked () {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/.+/defendant-link-status'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
}

export function resolveRetrieveByLetterHolderId (referenceNumber: string, defendantId?: number): Scope {
  return mock(`${serviceBaseURL}/claims`)
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

export function resolveRetrieveByDefendantIdWithResponse (override?: object) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/defendant/[0-9]+'))
    .reply(HttpStatus.OK, [{ ...sampleClaimObj, ...sampleDefendantResponseObj, ...override }])
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

export function resolveSaveCcjForUser () {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+/county-court-judgment'))
    .reply(HttpStatus.OK, { ...sampleClaimObj })
}

export function rejectSaveCcjForUser (reason: string = 'HTTP error') {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/[0-9]+/county-court-judgment'))
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
