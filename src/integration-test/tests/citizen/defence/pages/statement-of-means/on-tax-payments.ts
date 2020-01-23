import I = CodeceptJS.I

const I: I = actor()

const fields = {
  options: {
    declared: 'input[id="declaredtrue"]',
    notDeclared: 'input[id="declaredfalse"]'
  },
  amountYouOwe: 'input[id="amountYouOwe"]',
  reason: 'textarea[id="reason"]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class OnTaxPaymentsPage {

  selectDeclared (): void {
    I.checkOption(fields.options.declared)
  }

  selectNotDeclared (): void {
    I.checkOption(fields.options.notDeclared)
  }

  enterDetails (amountYouOwe: number, reason: string): void {
    I.fillField(fields.amountYouOwe, amountYouOwe.toFixed())
    I.fillField(fields.reason, reason)
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
