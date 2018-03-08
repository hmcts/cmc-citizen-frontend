import I = CodeceptJS.I

const I: I = actor()

const fields = {
  claimFee: 'table > tbody > tr:nth-child(0) > td:nth-child(0).numeric'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantFeesToPayPage {

  open (): void {
    I.amOnCitizenAppPage('/claim/before-you-start/cost')
  }

  getClaimFee (): void {
    I.grabTextFrom(fields.claimFee)
    I.click(buttons.submit)
  }

  continue (): void {
    I.click(buttons.submit)
  }
}
