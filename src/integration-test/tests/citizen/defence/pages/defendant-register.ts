import I = CodeceptJS.I

const I: I = actor()

const links = {
  iAlreadyHaveAnAccount: 'Sign in to your account.'
}

export class DefendantRegisterPage {

  clickLinkIAlreadyHaveAnAccount (): void {
    I.click(links.iAlreadyHaveAnAccount)
  }
}
