import I = CodeceptJS.I

const I: I = actor()

const fields = {
  typeStandard: 'input[id=typestandard]',
  typeDifferent: 'input[id=typedifferent]',
  typeNoClaim: 'input[id=typenointerest]',

  rate: 'input[id="rate[label]"]',
  reason: 'input[id="reason[label]"]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantInterestPage {

  selectStandardRate (): void {
    I.checkOption(fields.typeStandard)
    I.click(buttons.submit)
  }

  selectDifferentRate (rate: number): void {
    I.checkOption(fields.typeDifferent)
    I.fillField(fields.rate, rate.toString())
    I.fillField(fields.reason, 'Because I want to')
    I.click(buttons.submit)
  }

  selectNoClaimInterest (): void {
    I.checkOption(fields.typeNoClaim)
    I.click(buttons.submit)
  }
}
