import I = CodeceptJS.I
import { claimAmount } from 'integration-test/data/test-data'
import { AmountHelper } from 'integration-test/helpers/amountHelper'

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
    I.fillField(fields.paidAmount, amountPaid.toString())
  }

  defendantPaid (amount: number): void {
    this.paidSome()
    I.see('Total claim amount: ' + AmountHelper.formatMoney(claimAmount.getTotal()))
    I.fillField(fields.paidAmount, amount.toString())
    I.click(buttons.submit)
  }
}
