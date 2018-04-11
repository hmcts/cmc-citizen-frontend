import I = CodeceptJS.I

const I: I = actor()

const buttons = {
  submit: 'input[type=submit]'
}

export class CreateClaimDraftPage {

  open (): void {
    I.amOnCitizenAppPage('/testing-support/create-claim-draft')
  }

  createClaimDraft (): void {
    I.click(buttons.submit)
  }
}
