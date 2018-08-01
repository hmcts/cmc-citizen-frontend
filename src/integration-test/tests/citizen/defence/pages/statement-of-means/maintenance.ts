import I = CodeceptJS.I

const I: I = actor()

const fields = {
  options: {
    declared: 'input[id="declaredtrue"]',
    notDeclared: 'input[id="declaredfalse"]'
  },
  value: 'input[id="value"]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class MaintenancePage {

  selectDeclared (): void {
    I.checkOption(fields.options.declared)
  }

  selectNotDeclared (): void {
    I.checkOption(fields.options.notDeclared)
  }

  enterNumberOfChildren (value: number): void {
    I.fillField(fields.value, value.toFixed())
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
