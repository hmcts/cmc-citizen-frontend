import I = CodeceptJS.I

const I: I = actor()

const heading = {
  text: 'Do you want other people to give evidence?'
}
const fields = {
  howMany: { css: 'input[id="howMany"]' }
}
const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class OtherWitnessPage {

  chooseYes (): void {
    I.waitForText(heading.text)
    I.checkOption('Yes')
    I.fillField(fields.howMany, '1')
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.waitForText(heading.text)
    I.checkOption('No')
    I.click(buttons.submit)
  }
}
