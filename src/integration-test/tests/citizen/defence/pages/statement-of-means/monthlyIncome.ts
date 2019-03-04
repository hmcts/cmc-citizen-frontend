import I = CodeceptJS.I

const I: I = actor()

const fields = {
  salary: {
    radio: 'input[id="salarySourceDeclaredtrue"]',
    input: 'input[id="salarySource[amount]"]',
    everyWeek: 'input[id="salarySource[schedule]WEEK"]'
  },
  universalCredit: {
    radio: 'input[id="universalCreditSourceDeclaredtrue"]',
    input: 'input[id="universalCreditSource[amount]"]',
    everyWeek: 'input[id="universalCreditSource[schedule]WEEK"]'
  }
}

interface GenericMonthyIncomeField {
  radio: string
  input: string
  everyWeek: string
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class MonthlyIncomePage {

  fillOutSomeFields (amount: string = '10'): void {
    this.fillGenericField(fields.salary, amount)
    this.fillGenericField(fields.universalCredit, amount)
  }

  fillGenericField (field: GenericMonthyIncomeField, amount: string): void {
    I.click(field.radio)
    I.fillField(field.input, amount)
    I.click(field.everyWeek)
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
