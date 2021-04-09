import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class FreeMediationPage {

  clickHowFreeMediationWorks (): void {
    I.click(buttons.submit)
  }
}
