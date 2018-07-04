import I = CodeceptJS.I

const I: I = actor()

const fields = {
  options: {
    declared: 'input[id="declaredtrue"]',
    notDeclared: 'input[id="declaredfalse"]'
  },
  row: {
    claimNumber: 'input[id="rows[0][claimNumber]"]',
    amount: 'input[id="rows[0][amount]"]',
    instalmentAmount: 'input[id="rows[0][instalmentAmount]"]'
  }
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class CourtOrdersPage {

  selectDeclared (): void {
    I.checkOption(fields.options.declared)
  }

  selectNotDeclared (): void {
    I.checkOption(fields.options.notDeclared)
  }

  enterCourtOrder (claimNumber: string, amount: number, instalmentAmount: number): void {
    I.fillField(fields.row.claimNumber, claimNumber)
    I.fillField(fields.row.amount, amount.toFixed())
    I.fillField(fields.row.instalmentAmount, instalmentAmount.toFixed())
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
