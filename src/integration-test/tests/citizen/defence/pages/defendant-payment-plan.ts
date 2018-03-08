import I = CodeceptJS.I
import { claimAmount } from 'integration-test/data/test-data'
import { DateParser } from 'integration-test/utils/date-parser'

const I: I = actor()

const fields = {
  repayment: {
    firstPayment: 'input[id=firstPayment]',
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
  },
  text: 'textarea[id=text]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantPaymentPlanPage {

  checkOutstandingAmount (defendantPaidAmount: number): void {
    const amountOutstanding: number = claimAmount.getTotal() - defendantPaidAmount
    I.see('You believe you owe £' + amountOutstanding.toFixed(2))
  }

  enterRepaymentPlan (plan: PaymentPlan, text: string): void {
    const [ year, month, day ] = DateParser.parse(plan.firstPaymentDate)

    I.fillField(fields.repayment.firstPayment, plan.firstPayment.toFixed(2))
    I.fillField(fields.repayment.equalInstalments, plan.equalInstalment.toFixed(2))
    I.fillField(fields.repayment.firstPaymentDate.day, day)
    I.fillField(fields.repayment.firstPaymentDate.month, month)
    I.fillField(fields.repayment.firstPaymentDate.year, year)
    I.checkOption(fields.repayment.frequency[plan.frequency])
    I.fillField(fields.text, text)
    I.click(buttons.submit)
  }

  saveAndContinue (): void {
    I.click(buttons.submit)
  }

}
