import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  continueButton: 'a[class="button"]'
}

export class StartPage {

  clickContinue (): void {
    I.click(buttons.continueButton)
  }
}
