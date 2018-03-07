import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  startNow: 'a.button.button-start'
}

export class ClaimantStartClaimPage {

  open (): void {
    I.amOnCitizenAppPage('/claim/start')
  }

  startClaim (): void {
    I.click(buttons.startNow)
  }
}
