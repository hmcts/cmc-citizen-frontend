import I = CodeceptJS.I

const I: I = actor()

const heading = {
  text: 'You can only use free mediation if you'
}

export class MediationAgreementPage {

  chooseAgree (): void {
    I.waitForText(heading.text)
    I.click('I agree')
  }

  chooseDoNotAgree (): void {
    I.waitForText(heading.text)
    I.click('I don’t agree')
  }
}
