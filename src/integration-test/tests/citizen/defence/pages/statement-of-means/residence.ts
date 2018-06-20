import I = CodeceptJS.I

const I: I = actor()

const fields = {
  ownHome: 'input[id="typeOWN_HOME"]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class ResidencePage {

  selectOwnHome (): void {
    I.checkOption(fields.ownHome)
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
