import I = CodeceptJS.I

const I: I = actor()

const fields = {
  retired: 'input[id="optionRETIRED"]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class UnemployedPage {

  selectRetired (): void {
    I.checkOption(fields.retired)
    I.click(buttons.submit)
  }
}
