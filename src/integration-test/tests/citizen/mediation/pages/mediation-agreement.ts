import I = CodeceptJS.I

const I: I = actor()

export class MediationAgreementPage {

  chooseAgree (): void {
    I.click('I agree')
  }

  chooseDoNotAgree (): void {
    I.click('I don’t agree')
  }
}
