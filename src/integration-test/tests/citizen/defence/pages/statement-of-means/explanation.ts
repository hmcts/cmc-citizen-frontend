import I = CodeceptJS.I

const I: I = actor()

const fields = {
  text: 'textarea[id=text]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class ExplanationPage {

  enterExplanation (): void {
    I.fillField(fields.text, 'I cannot pay immediately')
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
