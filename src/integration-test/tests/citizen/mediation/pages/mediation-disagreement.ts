import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: { css: 'input[type=submit]' }
}

const heading = {
  text: 'You chose not to try free mediation'
}

const fields = {
  optionYes: { css: 'input[id=optionyes]' },
  optionNo: { css: 'input[id=optionno]' }
}

export class MediationDisagreementPage {
  chooseYes (): void {
    I.waitForText(heading.text)
    I.checkOption(fields.optionYes)
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.waitForText(heading.text)
    I.checkOption(fields.optionNo)
    I.click(buttons.submit)
  }
}
