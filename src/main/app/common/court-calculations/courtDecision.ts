import { Moment } from 'moment'

export enum DecisionType {
  CLAIMANT_IN_FAVOUR_OF_DEFENDANT = 'CLAIMANT_IN_FAVOUR_OF_DEFENDANT',
  CLAIMANT = 'CLAIMANT',
  DEFENDANT = 'DEFENDANT',
  COURT = 'COURT'
}

export class CourtDecision {

  static calculateDecision (defendantPaymentDate: Moment,
                            claimantPaymentDate: Moment,
                            courtGeneratedPaymentDate: Moment): DecisionType {
    if (!defendantPaymentDate || !claimantPaymentDate) {
      throw new Error('Input should be a moment, cannot be empty')
    }

    if (claimantPaymentDate.isSameOrAfter(defendantPaymentDate)) {
      return DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT
    }

    if (courtGeneratedPaymentDate.isBefore(claimantPaymentDate)) {
      return DecisionType.CLAIMANT
    }

    if (courtGeneratedPaymentDate.isBefore(defendantPaymentDate)) {
      return DecisionType.COURT
    }

    return DecisionType.DEFENDANT
  }
}
