import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantDefenceTypePage {

  admitAllOfMoneyClaim (): void {
    I.checkOption('I admit all of the claim')
    I.click(buttons.submit)
  }

  admitPartOfMoneyClaim (): void {
    I.checkOption('I admit part of the claim')
    I.click(buttons.submit)
  }

  rejectAllOfMoneyClaim (): void {
    I.checkOption('I reject all of the claim')
    I.click(buttons.submit)
  }

}
