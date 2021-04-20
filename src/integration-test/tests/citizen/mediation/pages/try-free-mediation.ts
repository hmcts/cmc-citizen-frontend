import I = CodeceptJS.I

const I: I = actor()

const heading = {
  text: 'Will you try free mediation?'
}
const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class TryFreeMediationPage {

  chooseYes (): void {
    I.waitForText(heading.text)
    I.checkOption('Yes')
    I.click(buttons.submit)
  }

  chooseNo (): void {
    I.waitForText(heading.text)
    I.checkOption('No')
    I.click(buttons.submit)
  }
}
