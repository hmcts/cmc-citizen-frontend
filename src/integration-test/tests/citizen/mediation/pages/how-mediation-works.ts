import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: '#mediationYes',
  disagree: '#mediationNo'
}

export class HowMediationWorksPage {

  chooseContinue (): void {
    I.waitForText('How free mediation works')
    I.click('Continue')
  }

  chooseDisagree (): void {
    I.click(buttons.disagree)
  }
}
