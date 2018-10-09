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

    if (!defendantPaymentDate || !claimantPaymentDate || !courtGeneratedPaymentDate) {
      throw new Error('Input should be a moment, cannot be empty')
    }

    if (claimantPaymentDate.isSameOrAfter(defendantPaymentDate) || claimantPaymentDate.isSameOrAfter(courtGeneratedPaymentDate)) {
      return DecisionType.CLAIMANT
    }
    if (claimantPaymentDate.isSameOrBefore(courtGeneratedPaymentDate) && defendantPaymentDate.isSameOrBefore(courtGeneratedPaymentDate)) {
      return DecisionType.DEFENDANT
    }
    return DecisionType.COURT
  }
}
