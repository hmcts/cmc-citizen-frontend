import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class WillYouTryMediationPage {

  chooseYes (): void {
    I.waitForText('Yes')
    I.checkOption('Yes')
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.waitForText('No')
    I.checkOption('No')
    I.click(buttons.submit)
  }
}
