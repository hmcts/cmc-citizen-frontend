import I = CodeceptJS.I

const I: I = actor()

const fields = {
  options: {
    declared: 'input[id="declaredtrue"]',
    notDeclared: 'input[id="declaredfalse"]'
  },
  employmentOptions: {
    employed: 'input[id="employedtrue"]',
    selfEmployed: 'input[id="selfEmployedtrue"]'
  }
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class EmploymentPage {

  selectDeclared (): void {
    I.checkOption(fields.options.declared)
  }

  selectNotDeclared (): void {
    I.checkOption(fields.options.notDeclared)
  }

  tickEmployed (): void {
    I.checkOption(fields.employmentOptions.employed)
  }

  tickSelfEmployed (): void {
    I.checkOption(fields.employmentOptions.selfEmployed)
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
