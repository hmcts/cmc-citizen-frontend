import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

export class StartPage {

  clickContinue (): void {
    I.waitInUrl('statement-of-means/intro');
    I.click(buttons.submit)
  }
}
