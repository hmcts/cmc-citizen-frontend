import { Moment } from 'moment'

export enum DecisionType {
  CLAIMANT = 'CLAIMANT',
  DEFENDANT = 'DEFENDANT',
  COURT = 'COURT'
}

export class PaymentDeadline {
  constructor (
    readonly source: DecisionType,
    readonly date: Moment
  ) {}
}

export class CourtDetermination {

  static determinePaymentDeadline (defendantPaymentDate: Moment,
                                   claimantPaymentDate: Moment,
                                   courtGeneratedPaymentDate: Moment): PaymentDeadline {

    if (!defendantPaymentDate || !claimantPaymentDate || !courtGeneratedPaymentDate) {
      throw new Error('Input should be a moment, cannot be empty')
    }

    if (claimantPaymentDate.isAfter(defendantPaymentDate) || claimantPaymentDate.isAfter(courtGeneratedPaymentDate)) {
      return new PaymentDeadline(DecisionType.CLAIMANT, claimantPaymentDate)
    }
    if (claimantPaymentDate.isBefore(courtGeneratedPaymentDate)) {
      if (defendantPaymentDate.isBefore(courtGeneratedPaymentDate)) {
        return new PaymentDeadline(DecisionType.DEFENDANT, defendantPaymentDate)
      } else {
        return new PaymentDeadline(DecisionType.COURT, courtGeneratedPaymentDate)
      }
    }
    // TODO: Kiran in some cases undefined is return, please fix it
  }
}
