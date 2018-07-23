import I = CodeceptJS.I

const I: I = actor()

const fields = {
  retired: 'input[id="optionRETIRED"]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class UnemploymentPage {

  selectRetired (): void {
    I.checkOption(fields.retired)
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
