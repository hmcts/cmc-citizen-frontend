import I = CodeceptJS.I

const I: I = actor()

const links = {
  tacticalLoginLink: 'Already have an account? Click here to login instead.',
  strategicLoginLink: 'Sign in to your account.'
}

const idamUrl: string = process.env.IDAM_URL

const strategicIdam: boolean = idamUrl.includes('core-compute') ||
  idamUrl.includes('platform.hmcts.net')

export class DefendantRegisterPage {

  clickLinkIAlreadyHaveAnAccount (): void {
    if (strategicIdam) {
      I.click(links.strategicLoginLink)
    } else {
      I.click(links.tacticalLoginLink)
    }
  }
}
