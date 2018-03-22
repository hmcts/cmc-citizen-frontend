import I = CodeceptJS.I

const I: I = actor()

const fields = {
  optionStandard: 'input[id=typestandard]',
  optionDifferent: 'input[id=typedifferent]',
  dailyAmount: 'input[id="dailyAmount"]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantInterestHowMuchPage {

  selectStandardRate (): void {
    I.checkOption(fields.optionStandard)
    I.click(buttons.submit)
  }

  selectDifferent (dailyAmount: string): void {
    I.checkOption(fields.optionDifferent)
    I.fillField(fields.dailyAmount, dailyAmount)
    I.click(buttons.submit)
  }
}
