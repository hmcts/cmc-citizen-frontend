import I = CodeceptJS.I

const I: I = actor()

const fields = {
  howMany: 'input[id="howMany"]'
}
const buttons = {
  submit: 'input[type=submit]'
}

export class OtherWitnessPage {

  chooseYes (howMany: number): void {
    I.checkOption('Yes')
    I.fillField(fields.howMany, howMany.toFixed())
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.checkOption('No')
    I.click(buttons.submit)
  }
}
