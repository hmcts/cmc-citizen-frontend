import I = CodeceptJS.I

const I: I = actor()

const fields = {
  reason: 'textarea[id=reason]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantReasonPage {

  open (): void {
    I.amOnCitizenAppPage('/claim/reason')
  }

  enterReason (reason: string): void {
    I.fillField(fields.reason, reason)
    I.click(buttons.submit)
  }
}
