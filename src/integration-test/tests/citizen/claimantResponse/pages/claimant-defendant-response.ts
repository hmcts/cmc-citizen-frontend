import I = CodeceptJS.I

const I: I = actor()

const button = {
  submit: 'input[type=submit]'
}

export class ClaimantDefendantResponsePage {

  Submit (): void {
    I.click(button.submit)
  }
}
