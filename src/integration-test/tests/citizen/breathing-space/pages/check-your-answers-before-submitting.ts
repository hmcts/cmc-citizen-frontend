import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class CheckYourAnswersBeforeSubmittingPage {

  submitBreathingSpace (): void {
    I.click(buttons.submit)
  }
}
