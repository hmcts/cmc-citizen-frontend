import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantViewClaimPage {

  open (): void {
    I.amOnCitizenAppPage('/first-contact/claim-summary')
  }

  clickRespondToClaim (): void {
    I.waitForText('View amount breakdown')
    I.click('summary')
    I.see('Claim fee £25')
    I.click(buttons.submit)
  }

}
