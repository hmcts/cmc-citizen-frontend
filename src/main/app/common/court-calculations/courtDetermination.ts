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

    if (claimantPaymentDate.isAfter(defendantPaymentDate) || claimantPaymentDate.isAfter(courtGeneratedPaymentDate)) {
      return DecisionType.CLAIMANT
    }
    if (claimantPaymentDate.isBefore(courtGeneratedPaymentDate)) {
      if (defendantPaymentDate.isBefore(courtGeneratedPaymentDate)) {
        return DecisionType.DEFENDANT
      } else {
        return DecisionType.COURT
      }
    }
  }
}
