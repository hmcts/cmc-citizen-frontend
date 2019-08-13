import * as HttpStatus from 'http-status-codes'
import * as config from 'config'
import * as mock from 'nock'
import { MadeBy } from 'claims/models/madeBy'
import { StatementType } from 'offer/form/models/statementType'

const serviceBaseURL: string = config.get<string>('claim-store.url')
const externalIdPattern: string = '[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'

export const sampleSettlementAgreementOffer = {
  partyStatements: [
    {
      type: StatementType.OFFER.value,
      madeBy: MadeBy.CLAIMANT.value,
      offer: { content: 'offer text', completionDate: '2017-08-08' }
    },
    {
      type: StatementType.ACCEPTATION.value,
      madeBy: MadeBy.CLAIMANT.value
    }
  ]
}

export const sampleSettlementAgreementOfferMadeByCourt = {
  partyStatements: [
    {
      type: StatementType.OFFER.value,
      madeBy: MadeBy.COURT.value,
      offer: { content: 'offer text', completionDate: '2017-08-08' }
    },
    {
      type: StatementType.ACCEPTATION.value,
      madeBy: MadeBy.CLAIMANT.value
    }
  ]
}

export const sampleSettlementAgreementAcceptation = {
  partyStatements: [
    {
      type: StatementType.OFFER.value,
      madeBy: MadeBy.CLAIMANT.value,
      offer: { content: 'offer text', completionDate: '2017-08-08' }
    },
    {
      type: StatementType.ACCEPTATION.value,
      madeBy: MadeBy.CLAIMANT.value
    },
    {
      type: StatementType.ACCEPTATION.value,
      madeBy: MadeBy.DEFENDANT.value
    }

  ]
}

export const sampleSettlementAgreementRejection = {
  partyStatements: [
    {
      type: StatementType.OFFER.value,
      madeBy: MadeBy.CLAIMANT.value,
      offer: { content: 'offer text', completionDate: '2017-08-08' }
    },
    {
      type: StatementType.ACCEPTATION.value,
      madeBy: MadeBy.CLAIMANT.value
    },
    {
      type: StatementType.REJECTION.value,
      madeBy: MadeBy.DEFENDANT.value
    }

  ]
}

export function resolveRejectSettlementAgreement () {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp(`/${externalIdPattern}/settlement-agreement/reject`))
    .reply(HttpStatus.CREATED)
}

export function rejectRejectSettlementAgreement (reason: string = 'HTTP Error') {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp(`/${externalIdPattern}/settlement-agreement/reject`))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveCountersignSettlementAgreement () {
  mock(`${serviceBaseURL}/claims`)
    .post(new RegExp(`/${externalIdPattern}/settlement-agreement/countersign`))
    .reply(HttpStatus.CREATED)
}
