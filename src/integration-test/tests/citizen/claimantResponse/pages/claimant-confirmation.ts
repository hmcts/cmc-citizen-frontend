import I = CodeceptJS.I

const I: I = actor()

const fields = {
  linkGoToYourAccount: 'a[href="/dashboard"]'
}

export class ClaimantConfirmation {

  clickGoToYourAccount (): void {
    I.click(fields.linkGoToYourAccount)
  }

}
