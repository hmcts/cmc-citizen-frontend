import I = CodeceptJS.I

const I: I = actor()

const fields = {
  reason: 'textarea[id=text]'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class ClaimantRejectionReasonPage {

  enterReason (reason: string): void {
    I.fillField(fields.reason, reason)
    I.click(buttons.submit)
  }

}
