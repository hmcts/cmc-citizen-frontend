import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

export class CitizenCompletingClaimInfoPage {

  open (): void {
    I.amOnCitizenAppPage('/claim/completing-claim')
  }

  confirmRead (): void {
    I.click(buttons.submit)
  }
}
