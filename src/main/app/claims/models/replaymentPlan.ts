export class RepaymentPlan {

  constructor (public remainingAmount: number,
               public firstPayment: number,
               public instalmentAmount: number,
               public firstPaymentDate: string,
               public paymentSchedule: string) {
    this.remainingAmount = remainingAmount
    this.firstPayment = firstPayment
    this.instalmentAmount = instalmentAmount
    this.firstPaymentDate = firstPaymentDate
    this.paymentSchedule = paymentSchedule
  }

}
