import I = CodeceptJS.I

const I: I = actor()

const fields = {
  optionSame: 'input[id=optionsame]',
  optionBreakdown: 'input[id=optionbreakdown]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantInterestTypePage {

  selectSameRate (): void {
    I.checkOption(fields.optionSame)
    I.click(buttons.submit)
  }

  selectBreakdown (): void {
    I.checkOption(fields.optionBreakdown)
    I.click(buttons.submit)
  }
}
