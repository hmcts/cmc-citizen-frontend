import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[id="Continue"]'
}

export class StartPage {

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
