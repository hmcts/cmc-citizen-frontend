import I = CodeceptJS.I

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

export class ClaimantCcjPaidAnyMoneyPage {

  paidSome (amount: number): void {
    I.checkOption(fields.defendantPaidSomeMoney.yes)
    I.fillField(fields.paidAmount, amount.toString())
    I.click(buttons.submit)
  }

  notPaidSome (): void {
    I.checkOption(fields.defendantPaidSomeMoney.no)
    I.click(buttons.submit)
  }

}
