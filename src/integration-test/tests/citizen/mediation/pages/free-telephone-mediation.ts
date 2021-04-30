/* tslint:disable:no-console */

import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  agree: '#mediationYes',
  disagree: '#mediationNo'
}

export class FreeTelephoneMediationPage {

  chooseContinue (): void {
    console.log('inside chooseContinue - FreeTelephoneMediationPage')
    I.waitForText('Free telephone mediation ')
    I.click(buttons.agree)
  }

  chooseDisagree (): void {
    console.log('inside chooseDisagree - FreeTelephoneMediationPage')
    I.waitForText('Free telephone mediation ')
    I.click(buttons.disagree)
  }
}
