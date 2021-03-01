import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class DefendantDefenceTypePage {

  admitAllOfMoneyClaim (): void {
    this.answerClaim('I admit all of the claim')
  }

  admitPartOfMoneyClaim (): void {
    this.answerClaim('I admit part of the claim')
  }

  rejectAllOfMoneyClaim (): void {
    this.answerClaim('I reject all of the claim')
  }

  private answerClaim (text: string): void {
    I.waitForText(text)
    I.checkOption(text)
    I.click(buttons.submit)
  }
}
