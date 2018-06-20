import I = CodeceptJS.I

const I: I = actor()

const fields = {
  declared: 'input[id="declaredfalse"]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class OtherDependantsPage {

  selectNotDeclared (): void {
    I.checkOption(fields.declared)
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
