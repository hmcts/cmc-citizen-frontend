import I = CodeceptJS.I

const I: I = actor()

const fields = {
  linkGoToYourAccount: 'input[href=/dashboard]'
}

export class ClaimantConfirmation {

  clickGoToYourAccount (): void {
    I.click(fields.linkGoToYourAccount)
  }

}
