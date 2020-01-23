import I = CodeceptJS.I
import { DatePaidPage } from '../pages/date-paid'

const I: I = actor()

export class PaidInFullSteps {

  inputDatePaid (date: string): void {
    const datePaidPage: DatePaidPage = new DatePaidPage()
    datePaidPage.datePaid(date)
  }
}
