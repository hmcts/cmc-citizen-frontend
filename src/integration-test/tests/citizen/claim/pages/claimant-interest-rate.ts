import I = CodeceptJS.I

const I: I = actor()

const fields = {
  optionStandard: 'input[id=typestandard]',
  optionDifferent: 'input[id=typedifferent]',
  differentRate: 'input[id="rate[label]"]',
  differentRateReason: 'input[id="reason[label]"]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantInterestRatePage {

  selectStandardRate (): void {
    I.checkOption(fields.optionStandard)
    I.click(buttons.submit)
  }

  selectDifferent (rate: string, reason: string): void {
    I.checkOption(fields.optionDifferent)
    I.fillField(fields.differentRate, rate)
    I.fillField(fields.differentRateReason, reason)
    I.click(buttons.submit)
  }
}
