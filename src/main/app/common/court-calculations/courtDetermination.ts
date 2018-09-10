import { Moment } from 'moment'

export enum DecisionType {
  CLAIMANT = 'CLAIMANT',
  DEFENDANT = 'DEFENDANT',
  COURT = 'COURT'
}

export class CourtDetermination {

  static calculateDecision (defendantPaymentDate: Moment,
                             claimantPaymentDate: Moment,
                             courtGeneratedPaymentDate: Moment): DecisionType {

    if (claimantPaymentDate > defendantPaymentDate) {
      return DecisionType.CLAIMANT
    }

    if (claimantPaymentDate < defendantPaymentDate && claimantPaymentDate > courtGeneratedPaymentDate) {
      return DecisionType.CLAIMANT
    }

    if (claimantPaymentDate < defendantPaymentDate && claimantPaymentDate < courtGeneratedPaymentDate) {
      return DecisionType.COURT
    }

    if (claimantPaymentDate < defendantPaymentDate && defendantPaymentDate < courtGeneratedPaymentDate) {
      return DecisionType.DEFENDANT
    }
  }
}
