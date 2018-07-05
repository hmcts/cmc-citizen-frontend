import I = CodeceptJS.I

const I: I = actor()

const fields = {
  options: {
    declared: 'input[id="declaredtrue"]',
    notDeclared: 'input[id="declaredfalse"]'
  },
  numberOfPeople: {
    value: 'input[id="numberOfPeople[value]"]',
    details: 'textarea[id="numberOfPeople[details]"]'
  }
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class OtherDependantsPage {

  selectDeclared (): void {
    I.checkOption(fields.options.declared)
  }

  selectNotDeclared (): void {
    I.checkOption(fields.options.notDeclared)
  }

  enterNumberOfPeople (value: number, details: string): void {
    I.fillField(fields.numberOfPeople.value, value.toFixed())
    I.fillField(fields.numberOfPeople.details, details)
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
