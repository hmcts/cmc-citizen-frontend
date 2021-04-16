import I = CodeceptJS.I

const I: I = actor()

export class IDontWantFreeMediationPage {

  chooseSkip (): void {
    I.click('Skip this section')
  }
}
