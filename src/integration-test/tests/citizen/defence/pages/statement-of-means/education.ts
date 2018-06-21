import I = CodeceptJS.I

const I: I = actor()

const fields = {
  value: 'input[id="value"]'
}

const buttons = {
  submit: 'input[id="saveAndContinue"]'
}

export class EducationPage {

  enterNumberOfChildren (value: number): void {
    I.fillField(fields.value, value.toFixed())
  }

  clickContinue (): void {
    I.click(buttons.submit)
  }
}
