import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  agree: '#mediationYes',
  disagree: '#mediationNo'
}

export class FreeTelephoneMediationPage {

  chooseContinue (): void {
    I.waitForText('Free telephone mediation')
    I.click(buttons.agree)
  }

  chooseDisagree (): void {
    I.waitForText('Free telephone mediation')
    I.click(buttons.disagree)
  }
}
