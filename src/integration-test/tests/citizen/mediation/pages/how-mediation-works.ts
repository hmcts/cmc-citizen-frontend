import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[id="mediationYes"]',
  disagree: '#mediationNo'
}

export class HowMediationWorksPage {

  chooseContinue (): void {
    I.click(buttons.submit)
  }

  chooseDisagree (): void {
    I.click(buttons.disagree)
  }
}
