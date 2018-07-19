import I = CodeceptJS.I

const I: I = actor()

const fields = {
  text: 'textarea[id=text]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class ExplanationPage {

  enterExplanation (text: string): void {
    I.fillField(fields.text, text)
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
