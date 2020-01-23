import I = CodeceptJS.I

const I: I = actor()

export class DefendantRegisterPage {

  clickLinkIAlreadyHaveAnAccount (): void {
    I.click('Sign in to your account.')
  }
}
