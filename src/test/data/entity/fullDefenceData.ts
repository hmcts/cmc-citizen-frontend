import { MomentFactory } from 'shared/momentFactory'

export const respondedAt = {
  respondedAt: MomentFactory.currentDate()
}

export const claimantRejectAlreadyPaid = {
  claimantResponse: {
    freeMediation: 'no',
    settleForAmount: 'no',
    type: 'REJECTION'
  },
  claimantRespondedAt: MomentFactory.currentDate()
}

export const directionsQuestionnaireDeadline = {
  directionsQuestionnaireDeadline: MomentFactory.currentDate()
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
