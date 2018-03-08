import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantDashboardPage {

  clickRequestCCJ (): void {
    I.click(buttons.submit)
  }
}
