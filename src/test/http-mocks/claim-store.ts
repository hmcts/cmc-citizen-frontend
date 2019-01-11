import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import { StatementType } from 'features/offer/form/models/statementType'
import { MadeBy } from 'features/offer/form/models/madeBy'
import { InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDateType } from 'common/interestDateType'
import { Interest } from 'claims/models/interest'
import { InterestDate } from 'claims/models/interestDate'
import { InterestType as ClaimInterestType } from 'claims/models/interestType'

import {
  fullAdmissionWithSoMPaymentByInstalmentsData, fullAdmissionWithSoMPaymentByInstalmentsDataWithNoDisposableIncome,
  fullAdmissionWithSoMPaymentByInstalmentsDataWithResonablePaymentSchedule,
  fullAdmissionWithSoMPaymentBySetDate,
  partialAdmissionWithSoMPaymentBySetDateData
} from 'test/data/entity/responseData'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

const serviceBaseURL: string = config.get<string>('claim-store.url')
const externalIdPattern: string = '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'

export const sampleClaimIssueObj = {
  id: 1,
  submitterId: '1',
  submitterEmail: 'claimant@example.com',
  externalId: '400f4c57-9684-49c0-adb4-4cf46579d6da',
  defendantId: '123',
  referenceNumber: '000MC050',
  createdAt: '2017-07-25T22:45:51.785',
  issuedOn: '2017-07-25',
  totalAmountTillToday: 200,
  totalAmountTillDateOfIssue: 200,
  moreTimeRequested: false,
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
    interest: {
      type: ClaimInterestType.STANDARD,
      rate: 10,
      reason: 'Special case',
      interestDate: {
        type: InterestDateType.SUBMISSION,
        endDateType: InterestEndDateOption.SETTLED_OR_JUDGMENT
      } as InterestDate
    } as Interest,
    reason: 'Because I can',
    feeAmountInPennies: 2500,
    timeline: { rows: [{ date: 'a', description: 'b' }] }
  },
  responseDeadline: '2017-08-08',
  features: ['admissions']
}

export const sampleClaimObj = {
  id: 1,
  submitterId: '1',
  submitterEmail: 'claimant@example.com',
  externalId: '400f4c57-9684-49c0-adb4-4cf46579d6dc',
  defendantId: '123',
  referenceNumber: '000MC000',
  createdAt: '2017-07-25T22:45:51.785',
  issuedOn: '2017-07-25',
  totalAmountTillToday: 200,
  totalAmountTillDateOfIssue: 200,
  moreTimeRequested: false,
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
    interest: {
      type: ClaimInterestType.STANDARD,
      rate: 10,
      reason: 'Special case',
      interestDate: {
        type: InterestDateType.SUBMISSION,
        endDateType: InterestEndDateOption.SETTLED_OR_JUDGMENT
      } as InterestDate
    } as Interest,
    reason: 'Because I can',
    feeAmountInPennies: 2500,
    timeline: { rows: [{ date: 'a', description: 'b' }] }
  },
  responseDeadline: '2017-08-08',
  countyCourtJudgment: {
    defendantDateOfBirth: '1990-11-01',
    paidAmount: 2,
    paymentOption: 'IMMEDIATELY'
  },
  settlement: {
    partyStatements: [
      {
        type: StatementType.OFFER.value,
        madeBy: MadeBy.DEFENDANT.value,
        offer: { content: 'offer text', completionDate: '2017-08-08' }
      }
    ]
  },
  features: ['admissions']
}

export const settlementWithInstalmentsAndAcceptation = {
  settlement: {
    partyStatements: [
      {
        type: StatementType.OFFER.value,
        madeBy: MadeBy.DEFENDANT.value,
        offer: {
          content: 'offer text',
          completionDate: '2017-08-08',
          paymentIntention: {
            paymentOption: PaymentOption.INSTALMENTS,
            repaymentPlan: {
              instalmentAmount: 100,
              firstPaymentDate: '2018-10-01',
              paymentSchedule: PaymentSchedule.EACH_WEEK,
              completionDate: '2019-02-01',
              paymentLength: '1'
            }
          }
        }
      },
      {
        madeBy: MadeBy.DEFENDANT.value,
        type: 'COUNTERSIGNATURE'
      }
    ]
  }
}

export const settlementWithSetDateAndAcceptation = {
  settlement: {
    partyStatements: [
      {
        type: StatementType.OFFER.value,
        madeBy: MadeBy.DEFENDANT.value,
        offer: {
          content: 'offer text',
          completionDate: '2017-08-08',
          paymentIntention: {
            paymentOption: PaymentOption.BY_SPECIFIED_DATE,
            paymentDate: '2010-12-31'
          }
        }
      },
      {
        madeBy: MadeBy.DEFENDANT.value,
        type: 'COUNTERSIGNATURE'
      }
    ]
  }
}

export const settlementAndSettlementReachedAt: object = {
  settlementReachedAt: '2017-07-25T22:45:51.785',
  ...this.settlementWithInstalmentsAndAcceptation

}

export const sampleDefendantResponseObj = {
  respondedAt: '2017-07-25T22:45:51.785',
  response: {
    responseType: 'FULL_DEFENCE',
    defenceType: 'DISPUTE',
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

export const samplePartialAdmissionWithPaymentBySetDateResponseObj = {
  respondedAt: '2017-07-25T22:45:51.785',
  claimantRespondedAt: '2017-07-25T22:45:51.785',
  response: partialAdmissionWithSoMPaymentBySetDateData
}

export const sampleFullAdmissionWithPaymentBySetDateResponseObj = {
  respondedAt: '2017-07-25T22:45:51.785',
  response: fullAdmissionWithSoMPaymentBySetDate
}

export const sampleFullAdmissionWithPaymentByInstalmentsResponseObj = {
  respondedAt: '2017-07-25T22:45:51.785',
  response: fullAdmissionWithSoMPaymentByInstalmentsData
}

export const sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithNoDisposableIncome = {
  respondedAt: '2017-07-25T22:45:51.785',
  response: fullAdmissionWithSoMPaymentByInstalmentsDataWithNoDisposableIncome
}

export const sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithReasonablePaymentSchedule = {
  respondedAt: '2017-07-25T22:45:51.785',
  response: fullAdmissionWithSoMPaymentByInstalmentsDataWithResonablePaymentSchedule
}

export function mockCalculateInterestRate (expected: number): mock.Scope {
  return mock(serviceBaseURL)
    .get('/interest/calculate')
    .query(true)
    .reply(HttpStatus.OK, { amount: expected })
}

export function resolveRetrieveClaimByExternalId (claimOverride?: object): mock.Scope {
  return mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/' + externalIdPattern))
    .reply(HttpStatus.OK, { ...sampleClaimObj, ...claimOverride })
}

export function resolveRetrieveClaimByExternalIdWithResponse (override?: object): mock.Scope {
  return mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/' + externalIdPattern))
    .reply(HttpStatus.OK, { ...sampleClaimObj, ...sampleDefendantResponseObj, ...override })
}

export function resolveRetrieveClaimByExternalIdWithFullAdmissionAndSettlement (override?: object): mock.Scope {
  return mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/' + externalIdPattern))
    .reply(HttpStatus.OK, { ...sampleClaimObj, ...sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithReasonablePaymentSchedule, ...override })
}

export function rejectRetrieveClaimByExternalId (reason: string = 'Error') {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/' + externalIdPattern))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveRetrieveClaimByExternalIdTo404HttpCode (reason: string = 'Claim not found') {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/' + externalIdPattern))
    .reply(HttpStatus.NOT_FOUND, reason)
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

export function resolveRetrieveByLetterHolderId (referenceNumber: string, claimOverride?: any): mock.Scope {
  return mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/letter/[0-9]+'))
    .reply(HttpStatus.OK, { ...sampleClaimObj, referenceNumber: referenceNumber, ...claimOverride })
}

export function rejectRetrieveByLetterHolderId (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/letter/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveRetrieveByDefendantId (referenceNumber: string, defendantId?: string) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/defendant/[0-9]+'))
    .reply(HttpStatus.OK, [{ ...sampleClaimObj, referenceNumber: referenceNumber, defendantId: defendantId }])
}

export function rejectRetrieveByDefendantId (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .get(new RegExp('/defendant/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolvePrePaymentSave () {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/' + externalIdPattern + '/pre-payment'))
    .reply(HttpStatus.OK, { case_reference: 1527177480274990 })
}

export function resolveSaveResponse () {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/.+/defendant/[0-9]+'))
    .reply(HttpStatus.OK, { ...sampleClaimObj, defendantId: '1' })
}

export function rejectSaveResponse (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/.+/defendant/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveLinkDefendant () {
  mock(`${serviceBaseURL}/claims`)
    .put('/defendant/link')
    .reply(HttpStatus.OK)
}

export function resolveRequestForMoreTime () {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/.+/request-more-time'))
    .reply(HttpStatus.OK)
}

export function rejectRequestForMoreTime (reason: string) {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/.+/request-more-time'))
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

export function resolveSaveCcjForExternalId () {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/' + externalIdPattern +
      '/county-court-judgment'))
    .reply(HttpStatus.OK, { ...sampleClaimObj })
}

export function resolveSaveReDeterminationForExternalId (explanation: string) {

  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/' + externalIdPattern +
      '/re-determination'))
    .reply(HttpStatus.OK, { explanation: explanation, partyType: MadeBy.CLAIMANT })
}

export function rejectSaveReDeterminationForExternalId (reason: string = 'HTTP error') {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/.+/re-determination'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function rejectSaveOfferForDefendant (reason: string = 'HTTP error') {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/.+/offers/defendant'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveSaveOffer () {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/.+/offers/defendant'))
    .reply(HttpStatus.CREATED)
}

export function resolveAcceptOffer (by: string = 'claimant') {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp(`/.+/offers/${by}/accept`))
    .reply(HttpStatus.CREATED)
}

export function resolveRejectOffer (by: string = 'claimant') {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp(`/.+/offers/${by}/reject`))
    .reply(HttpStatus.CREATED)
}

export function rejectSaveClaimantResponse (reason: string = 'HTTP error') {
  mock(`${serviceBaseURL}/responses`)
    .post(new RegExp('/.+/claimant/[0-9]+'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveCountersignOffer (by: string = 'defendant') {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp(`/.+/offers/${by}/countersign`))
    .reply(HttpStatus.CREATED)
}

export function rejectSaveCcjForExternalId (reason: string = 'HTTP error') {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp('/' + externalIdPattern +
      '/county-court-judgment'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function rejectRetrieveDocument (reason: string) {
  mock(`${serviceBaseURL}/documents`)
    .get(new RegExp('/' + externalIdPattern))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveRetrieveDocument () {
  mock(`${serviceBaseURL}/documents`)
    .get(new RegExp('/' + externalIdPattern))
    .reply(HttpStatus.OK)
}

export function resolvePostponedDeadline (deadline: string): mock.Scope {
  return mock(`${serviceBaseURL}/deadline`)
    .get(new RegExp('/\\d{4}-\\d{2}-\\d{2}'))
    .reply(HttpStatus.OK, deadline)
}

export function rejectPostponedDeadline (reason: string = 'HTTP error'): mock.Scope {
  return mock(`${serviceBaseURL}/deadline`)
    .get(new RegExp('/\\d{4}-\\d{2}-\\d{2}'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveAddRolesToUser (role: string) {
  mock(`${serviceBaseURL}/user`)
    .post('/roles')
    .reply(HttpStatus.CREATED, { role: role })
}

export function rejectAddRolesToUser (reason: string = 'HTTP error') {
  mock(`${serviceBaseURL}/user`)
    .post('/roles')
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveRetrieveUserRoles (...userRoles: string[]): mock.Scope {
  return mock(`${serviceBaseURL}/user`)
    .get('/roles')
    .reply(HttpStatus.OK, userRoles)
}

export function rejectRetrieveUserRoles () {
  mock(`${serviceBaseURL}/user`)
    .get('/roles')
    .reply(HttpStatus.INTERNAL_SERVER_ERROR)
}

export function resolveClaimantResponse () {
  mock(`${serviceBaseURL}/responses`)
    .post(new RegExp('/.+/claimant/[0-9]+'))
    .reply(HttpStatus.OK)
}

export function resolveSavePaidInFull () {
  mock(`${serviceBaseURL}/claims`)
    .put(new RegExp('/' + externalIdPattern + '/paid-in-full'))
    .reply(HttpStatus.OK)
}
