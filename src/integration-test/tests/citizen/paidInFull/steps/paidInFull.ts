import { DatePaidPage } from '../../paidInFull/pages/date-paid'

const paidInFullDatePaidPage: DatePaidPage = new DatePaidPage()

const dateClaimantReceivedMoney = '2014-01-01'

export class PaidInFullSteps {

  DateClaimantReceivedMoney (): void {
    paidInFullDatePaidPage.datePaid(dateClaimantReceivedMoney)
  }
}
