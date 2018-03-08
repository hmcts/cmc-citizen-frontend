import I = CodeceptJS.I

const I: I = actor()

const fields = {
  claimReference: 'input#reference'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantEnterClaimReferencePage {

  open (): void {
    I.amOnCitizenAppPage('/first-contact/claim-reference')
  }

  enterClaimReference (claimReference: string): void {
    I.fillField(fields.claimReference, claimReference)

    I.click(buttons.submit)
  }
}
