import { Moment } from 'moment'

export class FinalPaymentDateCalculator {

  //return type should be changed to Return type of either Claimant/Defendant/Court
  //return maybe changed at later point to Moment once we get towards end of story

  static getFinalPaymentDate (defendantPaymentDate: Moment,
                             claimantPaymentDate: Moment,
                             courtGeneratedPaymentDate: Moment): Moment {

    //below if statements replicate design diagram at the moment and can be simplified
    if (claimantPaymentDate > defendantPaymentDate) {
      return claimantPaymentDate
    }

    if (claimantPaymentDate < defendantPaymentDate && claimantPaymentDate > courtGeneratedPaymentDate) {
      return claimantPaymentDate
    }

    if (claimantPaymentDate < defendantPaymentDate && claimantPaymentDate < courtGeneratedPaymentDate) {
      return courtGeneratedPaymentDate
    }

    if (claimantPaymentDate < defendantPaymentDate && defendantPaymentDate < courtGeneratedPaymentDate) {
      return defendantPaymentDate
    }
  }
}
