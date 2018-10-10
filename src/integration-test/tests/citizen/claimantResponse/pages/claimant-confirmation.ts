import I = CodeceptJS.I

const I: I = actor()

const fields = {
  goToYourAccount: 'input[href=/dashboard]'
}

export class ClaimantConfirmation {

  clickGoToYourAccount (): void {
    I.click(fields.goToYourAccount)
  }

}
