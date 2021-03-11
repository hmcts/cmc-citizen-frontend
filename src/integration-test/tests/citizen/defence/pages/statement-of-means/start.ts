import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

export class StartPage {

  clickContinue (): void {
    I.waitForVisible(buttons.submit)
    I.click(buttons.submit)
  }
}
