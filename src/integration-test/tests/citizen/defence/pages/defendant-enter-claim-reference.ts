import I = CodeceptJS.I

const I: I = actor()

const fields = {
  claimReference: 'input#reference'
}

const buttons = {
  submit: 'input[type=submit]'
}

export class DefendantEnterClaimReferencePage {

  async open () {
    await I.amOnCitizenAppPage('/first-contact/claim-reference')
    return Promise.resolve()
  }

  async enterClaimReference (claimReference: string) {
    await I.fillField(fields.claimReference, claimReference)

    await I.click(buttons.submit)
    return Promise.resolve()
  }
}
