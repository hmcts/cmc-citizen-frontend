import I = CodeceptJS.I

const I: I = actor()

const fields = {
  mortgage: {
    radio: 'input[id="mortgageDeclaredtrue"]',
    input: 'input[id="mortgage[amount]"]',
    everyWeek: 'input[id="mortgage[schedule]WEEK"]'
  },
  rent: {
    radio: 'input[id="rentDeclaredtrue"]',
    input: 'input[id="rent[amount]"]',
    everyWeek: 'input[id="rent[schedule]WEEK"]'
  }
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

interface GenericMonthlyExpenseField {
  radio: string
  input: string
  everyWeek: string
}

export class MonthlyExpensesPage {

  fillOutSomeFields (): void {
    this.fillGenericField(fields.mortgage, '10')
    this.fillGenericField(fields.rent, '10')
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }

  fillGenericField (field: GenericMonthlyExpenseField, amount: string): void {
    I.click(field.radio)
    I.fillField(field.input, amount)
    I.click(field.everyWeek)
  }
}
