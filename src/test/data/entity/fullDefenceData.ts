import { MomentFactory } from 'shared/momentFactory'
import {
  sampleClaimIssueObj,
  sampleDefendantResponseObj
} from '../../http-mocks/claim-store'

export const respondedAt = {
  respondedAt: MomentFactory.currentDate().format('LL')
}

export const claimantRejectAlreadyPaid = {
  claimantResponse: {
    freeMediation: 'no',
    settleForAmount: 'no',
    type: 'REJECTION'
  },
  claimantRespondedAt: MomentFactory.currentDate()
}

export const claimantRejectAlreadyPaidWithMediation = {
  claimantResponse: {
    freeMediation: 'yes',
    settleForAmount: 'no',
    type: 'REJECTION'
  },
  claimantRespondedAt: MomentFactory.currentDate()
}

export const directionsQuestionnaireDeadline = {
  directionsQuestionnaireDeadline: MomentFactory.currentDate().add(19, 'days')
}

export const intentionToProceedDeadline = {
  intentionToProceedDeadline: MomentFactory.currentDateTime().subtract(1, 'days')
}

export const defendantOffersSettlement = [{
  type: 'OFFER',
  madeBy: 'DEFENDANT',
  offer: {
    content: 'test',
    completionDate: MomentFactory.currentDate().add(1, 'day')
  }
}]

export const claimantAcceptOffer = [{
  madeBy: 'CLAIMANT',
  type: 'ACCEPTATION'
}]

export const claimantRejectOffer = [{
  madeBy: 'CLAIMANT',
  type: 'REJECTION'
}]

export const defendantCounterSign = [{
  madeBy: 'DEFENDANT',
  type: 'COUNTERSIGNATURE'
}]

export const settledWithAgreement = {
  settlement: {
    partyStatements: [
      ...defendantOffersSettlement,
      ...claimantAcceptOffer,
      ...defendantCounterSign
    ]
  },
  settlementReachedAt: MomentFactory.currentDate()
}
export const settlementOfferAccept = {
  settlement: {
    partyStatements: [
      ...defendantOffersSettlement,
      ...claimantAcceptOffer
    ]
  }
}

export const settlementOfferReject = {
  settlement: {
    partyStatements: [
      ...defendantOffersSettlement,
      ...claimantRejectOffer
    ]
  }
}

export const settlementOffer = {
  settlement: {
    partyStatements: [
      ...defendantOffersSettlement
    ]
  }
}

export const sampleDefendantResponseNoMediationObj = {
  respondedAt: '2017-07-25T22:45:51.785',
  response: {
    responseType: 'FULL_DEFENCE',
    defenceType: 'DISPUTE',
    defence: 'I reject this money claim',
    freeMediation: 'no',
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

export const sampleDefendantResponseNoMediationWithDQsObj = {
  respondedAt: '2017-07-25T22:45:51.785',
  response: {
    responseType: 'FULL_DEFENCE',
    defenceType: 'DISPUTE',
    defence: 'I reject this money claim',
    freeMediation: 'no',
    defendant: {
      type: 'individual',
      name: 'full name',
      address: {
        line1: 'line1',
        line2: 'line2',
        city: 'city',
        postcode: 'bb127nq'
      }
    },
    directionsQuestionnaire: {
      selfWitness: 'yes'
    }
  }
}

export const sampleClaimWithFullDefenceNoMediation = {
  ...sampleClaimIssueObj,
  ...sampleDefendantResponseNoMediationObj,
  directionsQuestionnaireDeadline: MomentFactory.currentDate().add(14, 'days')
}

export const sampleClaimWithFullDefenceNoMediationDQsEnabled = {
  ...sampleClaimIssueObj,
  ...sampleDefendantResponseNoMediationWithDQsObj
}

export const sampleClaimWithFullDefenceMediation = {
  ...sampleClaimIssueObj,
  ...sampleDefendantResponseObj
}
