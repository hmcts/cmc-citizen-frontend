import { RoutablePath } from 'shared/router/routablePath'

export const ccjPath = '/case/:externalId/ccj'

export class Paths {
  static readonly dateOfBirthPage = new RoutablePath(`${ccjPath}/date-of-birth`)
  static readonly paidAmountPage = new RoutablePath(`${ccjPath}/paid-amount`)
  static readonly paidAmountSummaryPage = new RoutablePath(`${ccjPath}/paid-amount-summary`)
  static readonly paymentOptionsPage = new RoutablePath(`${ccjPath}/payment-options`)
  static readonly checkAndSendPage = new RoutablePath(`${ccjPath}/check-and-send`)
  static readonly payBySetDatePage = new RoutablePath(`${ccjPath}/pay-by-set-date`)
  static readonly repaymentPlanPage = new RoutablePath(`${ccjPath}/repayment-plan`)
  static readonly confirmationPage = new RoutablePath(`${ccjPath}/confirmation`)
}
