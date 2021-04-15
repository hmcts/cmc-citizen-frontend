import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class LiftBsCheckYourAnswersPage {

  submitLiftBreathingSpace (): void {
    I.click(buttons.submit)
  }
}
