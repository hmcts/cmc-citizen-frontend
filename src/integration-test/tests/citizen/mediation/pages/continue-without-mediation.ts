import I = CodeceptJS.I

const I: I = actor()

export class ContinueWithoutMediationPage {

  chooseContinue (): void {
    I.click('Continue without free mediation')
  }

  chooseGoBack (): void {
    I.click('go back and change your answers')
  }
}
