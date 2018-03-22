import I = CodeceptJS.I

const I: I = actor()

const links = {
  iAlreadyHaveAnAccount: 'Already have an account? Click here to login instead.'
}

export class DefendantRegisterPage {

  clickLinkIAlreadyHaveAnAccount (): void {
    I.click(links.iAlreadyHaveAnAccount)
  }
}
