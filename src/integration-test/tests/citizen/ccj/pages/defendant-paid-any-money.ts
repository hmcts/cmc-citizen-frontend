import I = CodeceptJS.I
import { claimAmount } from 'integration-test/data/test-data'

const I: I = actor()

const fields = {
  defendantPaidSomeMoney: {
    yes: 'input[id=optionyes]',
    no: 'input[id=optionno]'
  },

  paidAmount: 'input[id=amount]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantPaidAnyMoneyPage {

  paidSome (): void {
    I.checkOption(fields.defendantPaidSomeMoney.yes)
  }

  notPaidSome (): void {
    I.checkOption(fields.defendantPaidSomeMoney.no)
  }

  amountPaid (amountPaid: number): void {
    I.fillField(fields.paidAmount, amountPaid.toFixed(2))
  }

  defendantPaid (amount: number): void {
    this.paidSome()
    I.see('Total claim amount is £' + claimAmount.getTotal().toFixed(2))
    I.fillField(fields.paidAmount, amount.toFixed(2))
    I.click(buttons.submit)
  }
}
