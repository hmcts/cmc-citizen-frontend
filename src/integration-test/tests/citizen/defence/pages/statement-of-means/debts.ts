import I = CodeceptJS.I

const I: I = actor()

const fields = {
  options: {
    declared: 'input[id="declaredtrue"]',
    notDeclared: 'input[id="declaredfalse"]'
  },
  row: {
    debt: 'input[id="rows[0][debt]"]',
    totalOwed: 'input[id="rows[0][totalOwed]"]',
    monthlyPayments: 'input[id="rows[0][monthlyPayments]"]'
  }
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class DebtsPage {

  selectDeclared (): void {
    I.checkOption(fields.options.declared)
  }

  selectNotDeclared (): void {
    I.checkOption(fields.options.notDeclared)
  }

  enterDebt (debt: string, totalOwed: number, monthlyPayments: number): void {
    I.fillField(fields.row.debt, debt)
    I.fillField(fields.row.totalOwed, totalOwed.toFixed())
    I.fillField(fields.row.monthlyPayments, monthlyPayments.toFixed())
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
