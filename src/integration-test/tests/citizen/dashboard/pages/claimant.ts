import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantDashboardPage {

  clickRequestCCJ (): void {
    I.click(buttons.submit)
  }

  clickViewAndRespond (): void {
    I.see('The defendant has admitted they owe £10')
    I.click('View and respond')
  }
}
