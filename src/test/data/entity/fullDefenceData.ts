import { MomentFactory } from 'shared/momentFactory'

export function respondedAt () {
  return {
    respondedAt: MomentFactory.currentDate()
  }
}

export function claimantRejectAlreadyPaid () {
  return {
    claimantResponse: {
      freeMediation: 'no',
      settleForAmount: 'no',
      type: 'REJECTION'
    },
    claimantRespondedAt: MomentFactory.currentDate()
  }
}

export function claimantRejectAlreadyPaidWithMediation () {
  return {
    claimantResponse: {
      freeMediation: 'yes',
      settleForAmount: 'no',
      type: 'REJECTION'
    },
    claimantRespondedAt: MomentFactory.currentDate()
  }
}

export function directionsQuestionnaireDeadline () {
  return {
    directionsQuestionnaireDeadline: MomentFactory.currentDate().add(19, 'days')
  }
}

export function intentionToProceedDeadline () {
  return {
    intentionToProceedDeadline: MomentFactory.currentDateTime().subtract(1, 'days')
  }
}

function defendantOffersSettlement () {
  return [{
    type: 'OFFER',
    madeBy: 'DEFENDANT',
    offer: {
      content: 'test',
      completionDate: MomentFactory.currentDate().add(1, 'day')
    }
  }]
}

const claimantAcceptOffer = [{
  madeBy: 'CLAIMANT',
  type: 'ACCEPTATION'
}]

const claimantRejectOffer = [{
  madeBy: 'CLAIMANT',
  type: 'REJECTION'
}]

const defendantCounterSign = [{
  madeBy: 'DEFENDANT',
  type: 'COUNTERSIGNATURE'
}]

export function settledWithAgreement () {
  return {
    settlement: {
      partyStatements: [
        ...defendantOffersSettlement(),
        ...claimantAcceptOffer,
        ...defendantCounterSign
      ]
    },
    settlementReachedAt: MomentFactory.currentDate()
  }
}

export function settlementOfferAccept () {
  return {
    settlement: {
      partyStatements: [
        ...defendantOffersSettlement(),
        ...claimantAcceptOffer
      ]
    }
  }
}

export function settlementOfferReject () {
  return {
    settlement: {
      partyStatements: [
        ...defendantOffersSettlement(),
        ...claimantRejectOffer
      ]
    }
  }
}

export function settlementOffer () {
  return {
    settlement: {
      partyStatements: [
        ...defendantOffersSettlement()
      ]
    }
  }
}
