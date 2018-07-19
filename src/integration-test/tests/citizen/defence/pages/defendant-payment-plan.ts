import I = CodeceptJS.I
import { claimAmount } from 'integration-test/data/test-data'
import { DateParser } from 'integration-test/utils/date-parser'
import { AmountHelper } from 'integration-test/helpers/amountHelper'

const I: I = actor()

const fields = {
  repayment: {
    equalInstalments: 'input[id=instalmentAmount]',
    firstPaymentDate: {
      day: 'input[id=\'firstPaymentDate[day]\']',
      month: 'input[id=\'firstPaymentDate[month]\']',
      year: 'input[id=\'firstPaymentDate[year]\']'
    },
    frequency: {
      everyWeek: 'input[id=paymentScheduleEACH_WEEK]',
      everyTwoWeeks: 'input[id=paymentScheduleEVERY_TWO_WEEKS]',
      everyMonth: 'input[id=paymentScheduleEVERY_MONTH]'
    }
  }
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantPaymentPlanPage {

  checkOutstandingAmount (defendantPaidAmount: number): void {
    const amountOutstanding: number = claimAmount.getTotal() - defendantPaidAmount
    I.see('You believe you owe ' + AmountHelper.formatMoney(amountOutstanding))
  }

  enterRepaymentPlan (plan: PaymentPlan): void {
    const [ year, month, day ] = DateParser.parse(plan.firstPaymentDate)

    I.fillField(fields.repayment.equalInstalments, plan.equalInstalment.toString())
    I.fillField(fields.repayment.firstPaymentDate.day, day)
    I.fillField(fields.repayment.firstPaymentDate.month, month)
    I.fillField(fields.repayment.firstPaymentDate.year, year)
    I.checkOption(fields.repayment.frequency[plan.frequency])
  }

  saveAndContinue (): void {
    I.click(buttons.submit)
  }

}
