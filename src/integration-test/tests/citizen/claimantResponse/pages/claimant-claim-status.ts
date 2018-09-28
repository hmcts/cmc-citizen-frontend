import I = CodeceptJS.I

const I: I = actor()

const viewAndRespondButton = {
  submit: 'input#button'
}

export class ClaimantClaimStatusPage {

  viewAndRespondButton (): void {
    I.click(viewAndRespondButton.submit)
  }
}
